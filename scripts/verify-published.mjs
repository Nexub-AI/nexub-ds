// Post-publish check for release.yml: every package changesets just published
// must be on the npm registry at that version, with a provenance attestation
// (npm trusted publishing attaches one; a version without it was not published
// by release.yml's OIDC identity).
//
// The registry lags a publish by a minute or two (one package took ~90 s in
// 2.3.1), so missing versions are retried with backoff for up to 5 minutes.
//
//   PUBLISHED_PACKAGES='[{"name":"@nexub/react","version":"2.4.0"}]' node scripts/verify-published.mjs
//   node scripts/verify-published.mjs '[{"name":"@nexub/react","version":"2.4.0"}]'
//
// Node 24, no dependencies.

import { fileURLToPath } from 'node:url';

const REGISTRY = 'https://registry.npmjs.org';

/** Parses changesets/action's `publishedPackages` output: a JSON array of {name, version}. */
export function parsePublished(json) {
  let list;
  try {
    list = JSON.parse(json);
  } catch {
    throw new Error(`publishedPackages is not JSON: ${String(json).slice(0, 200)}`);
  }
  if (!Array.isArray(list) || list.some((p) => typeof p?.name !== 'string' || typeof p?.version !== 'string')) {
    throw new Error(`publishedPackages must be an array of {name, version}: ${String(json).slice(0, 200)}`);
  }
  return list.map(({ name, version }) => ({ name, version }));
}

export const versionUrl = ({ name, version }) =>
  `${REGISTRY}/${name.replace('/', '%2F')}/${encodeURIComponent(version)}`;

/**
 * One registry lookup.
 * @returns {Promise<{ status: 'ok' | 'missing' | 'unattested' | 'error', detail: string }>}
 */
export async function checkPackage(pkg, fetchImpl = fetch) {
  let res;
  try {
    res = await fetchImpl(versionUrl(pkg), { headers: { accept: 'application/json' }, signal: AbortSignal.timeout(30_000) });
  } catch (err) {
    return { status: 'error', detail: `request failed: ${err?.message ?? err}` };
  }
  if (res.status === 404) return { status: 'missing', detail: 'version not on the registry' };
  if (!res.ok) return { status: 'error', detail: `registry answered HTTP ${res.status}` };
  let doc;
  try {
    doc = await res.json();
  } catch {
    return { status: 'error', detail: 'registry answered with invalid JSON' };
  }
  if (doc?.version !== pkg.version) return { status: 'missing', detail: `registry returned version ${doc?.version}` };
  if (!doc.dist?.attestations?.provenance) return { status: 'unattested', detail: 'no provenance attestation (dist.attestations)' };
  return { status: 'ok', detail: doc.dist.attestations.url ?? 'attested' };
}

/**
 * Checks every package, re-checking missing ones (and registry errors) with
 * exponential backoff until all pass or `timeoutMs` runs out. An unattested
 * version is final: npm stores the attestation with the publish itself, so
 * waiting will not add one.
 * @returns {Promise<{ ok: object[], failed: { name: string, version: string, status: string, detail: string }[] }>}
 */
export async function verifyPublished(
  packages,
  {
    fetch: fetchImpl = fetch,
    sleep = (ms) => new Promise((r) => setTimeout(r, ms)),
    now = Date.now,
    log = console.log,
    timeoutMs = 5 * 60_000,
    initialDelayMs = 10_000,
    maxDelayMs = 60_000,
  } = {},
) {
  const start = now();
  const ok = [];
  const final = [];
  let pending = [...packages];
  let delay = initialDelayMs;
  for (let attempt = 1; ; attempt++) {
    const results = await Promise.all(pending.map(async (pkg) => ({ ...pkg, ...(await checkPackage(pkg, fetchImpl)) })));
    for (const r of results) {
      if (r.status === 'ok') {
        ok.push(r);
        log(`ok   ${r.name}@${r.version} (${r.detail})`);
      }
    }
    final.push(...results.filter((r) => r.status === 'unattested'));
    const retry = results.filter((r) => r.status === 'missing' || r.status === 'error');
    if (!retry.length || now() - start + delay > timeoutMs) return { ok, failed: [...retry, ...final] };
    log(`attempt ${attempt}: ${retry.length} not on the registry yet (${retry.map((f) => `${f.name}@${f.version}: ${f.detail}`).join(', ')}); retrying in ${Math.round(delay / 1000)}s`);
    await sleep(delay);
    pending = retry.map(({ name, version }) => ({ name, version }));
    delay = Math.min(delay * 2, maxDelayMs);
  }
}

export function failureMessage(failed) {
  return [
    `${failed.length} published package(s) failed verification on ${REGISTRY}:`,
    ...failed.map((f) => `  - ${f.name}@${f.version}: ${f.status} (${f.detail})`),
    'missing: the version never reached the registry (check the publish log).',
    'unattested: published without npm provenance (not via trusted publishing from release.yml).',
  ].join('\n');
}

async function main() {
  const json = process.argv[2] ?? process.env.PUBLISHED_PACKAGES;
  if (!json) {
    console.error('Pass the published packages JSON as an argument or in PUBLISHED_PACKAGES.');
    process.exit(2);
  }
  const packages = parsePublished(json);
  if (!packages.length) {
    console.error('publishedPackages is empty, but changesets reported a publish.');
    process.exit(1);
  }
  console.log(`Verifying ${packages.length} package(s) on ${REGISTRY}…`);
  const { ok, failed } = await verifyPublished(packages);
  if (failed.length) {
    const msg = failureMessage(failed);
    console.error(msg);
    // GitHub Actions annotation, so the reason shows on the run summary.
    if (process.env.GITHUB_ACTIONS) console.log(`::error title=npm publish verification failed::${msg.replaceAll('%', '%25').replaceAll('\r', '%0D').replaceAll('\n', '%0A')}`);
    process.exit(1);
  }
  console.log(`verify-published: ${ok.length} package(s) on npm with provenance.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
