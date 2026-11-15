// 9.7: publishes the tarballs the release build made and attested (build-release.yml),
// byte for byte, instead of packing again in the publish job. What reaches npm is then
// exactly the artifact the SLSA provenance describes.
//
//   node scripts/publish-tarballs.mjs <dir> [--dry-run]
//   1. every tarball must match <dir>/checksums.txt (sha256), or nothing is published
//   2. a version already on the registry is skipped, so a re-run finishes a partial release
//   3. `npm publish <file>` (the call `pnpm publish` makes; npm trusted publishing adds provenance)
//   4. `changeset tag`: tags each new version and prints the "New tag:" lines
//      changesets/action reads to create the GitHub releases
// --dry-run does 1 and 2 and runs `npm publish --dry-run` for new versions; it never tags.
// Node 24, no dependencies.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const REGISTRY = 'https://registry.npmjs.org';

/** `sha256  file` lines → { file: sha256 }. */
export function parseChecksums(text) {
  return Object.fromEntries(
    text
      .split('\n')
      .filter(Boolean)
      .map((line) => {
        const m = /^([a-f0-9]{64}) {2}(\S+\.tgz)$/.exec(line);
        if (!m) throw new Error(`checksums.txt: unreadable line: ${line.slice(0, 120)}`);
        return [m[2], m[1]];
      }),
  );
}

/** What is wrong between the tarballs present and checksums.txt; empty when they agree. */
export function verify(expected, actual) {
  const problems = [];
  for (const file of Object.keys(actual)) {
    if (!(file in expected)) problems.push(`${file}: not in checksums.txt`);
    else if (expected[file] !== actual[file]) problems.push(`${file}: sha256 ${actual[file]} does not match checksums.txt`);
  }
  for (const file of Object.keys(expected)) if (!(file in actual)) problems.push(`${file}: listed in checksums.txt but missing`);
  return problems;
}

/**
 * npm dist-tag for a version. 9.9.x is the 10.0 release candidate: it publishes to `next`
 * and `latest` stays on 9.8 until 10.0. To end the soak early (a fix `latest` users need),
 * drop the 9.9 rule in the same PR (INCIDENT_RUNBOOK.md).
 */
export const distTag = (version) => (version.startsWith('9.9.') ? 'next' : 'latest');

const manifestOf = (tgz) => JSON.parse(execFileSync('tar', ['-xzOf', tgz, 'package/package.json'], { encoding: 'utf8' }));

async function onRegistry({ name, version }) {
  const res = await fetch(`${REGISTRY}/${name.replaceAll('/', '%2F')}/${encodeURIComponent(version)}`, { signal: AbortSignal.timeout(30_000) });
  if (res.status === 404) return false;
  if (!res.ok) throw new Error(`registry answered HTTP ${res.status} for ${name}@${version}`);
  return true;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const dir = process.argv[2];
  const dryRun = process.argv.includes('--dry-run');
  if (!dir) {
    console.error('Usage: publish-tarballs.mjs <dir> [--dry-run]');
    process.exit(2);
  }
  const files = readdirSync(dir).filter((f) => f.endsWith('.tgz')).sort();
  const actual = Object.fromEntries(files.map((f) => [f, createHash('sha256').update(readFileSync(join(dir, f))).digest('hex')]));
  const problems = verify(parseChecksums(readFileSync(join(dir, 'checksums.txt'), 'utf8')), actual);
  if (problems.length || files.length === 0) {
    console.error(['✗ tarballs do not match the release build; nothing published', ...problems].join('\n'));
    process.exit(1);
  }
  for (const file of files) {
    const { name, version } = manifestOf(join(dir, file));
    // npm refuses even a dry run over an existing version, so the check comes first in both modes.
    if (await onRegistry({ name, version })) {
      console.log(`${name}@${version} is already on the registry, skipping (${file} matches checksums.txt)`);
      continue;
    }
    console.log(`${dryRun ? 'dry run: ' : ''}publishing ${name}@${version} to "${distTag(version)}" (${file}, sha256 ${actual[file].slice(0, 16)}…)`);
    // Absolute path: npm reads a bare `tarballs/x.tgz` as the GitHub repository tarballs/x.tgz.
    execFileSync('npm', ['publish', resolve(dir, file), '--access', 'public', '--tag', distTag(version), ...(dryRun ? ['--dry-run'] : [])], { stdio: 'inherit' });
  }
  if (!dryRun) execFileSync('pnpm', ['changeset', 'tag'], { stdio: 'inherit' });
}
