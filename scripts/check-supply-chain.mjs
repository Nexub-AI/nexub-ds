// 9.7 dependency policy, checked on every PR (ci.yml) and in `pnpm ci:local`:
//   1. Lockfile lint: every package in pnpm-lock.yaml resolves from the registry with a
//      sha512 integrity. No git, tarball-URL or directory resolutions.
//   2. Runtime dependencies: each one of each published package is listed with its reason
//      in dependency-policy.json, and nothing listed there is gone.
//   3. Minimum package age: pnpm (minimumReleaseAge) and Dependabot (cooldown) both wait
//      at least the policy's days before a new release can be installed or proposed.
// Node 24, no dependencies.
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');

/** Lockfile resolutions that are not a registry package with a sha512 integrity. */
export function lintLockfile(lock) {
  const bad = [];
  let current = '';
  for (const line of lock.split('\n')) {
    const key = /^ {2}(\S.*):$/.exec(line);
    if (key) current = key[1].replace(/^'|'$/g, '');
    const res = /^ {4}resolution: \{(.*)\}$/.exec(line);
    if (res && !/^integrity: sha512-[A-Za-z0-9+/=]+$/.test(res[1])) bad.push(`${current}: ${res[1].slice(0, 80)}`);
  }
  return bad;
}

/** A policy key matches a dependency by name, or by prefix when it ends in "*". */
const covers = (key, dep) => (key.endsWith('*') ? dep.startsWith(key.slice(0, -1)) : key === dep);

/** Unlisted runtime dependencies, and policy entries that match nothing. */
export function checkRuntimeDeps(manifests, policy) {
  const problems = [];
  for (const pkg of manifests) {
    if (pkg.private) continue;
    const deps = Object.keys(pkg.dependencies ?? {});
    const keys = Object.keys(policy.packages[pkg.name] ?? {});
    for (const dep of deps) if (!keys.some((k) => covers(k, dep))) problems.push(`${pkg.name}: runtime dependency "${dep}" has no reason in dependency-policy.json`);
    for (const key of keys) if (!deps.some((d) => covers(key, d))) problems.push(`${pkg.name}: dependency-policy.json lists "${key}", which is no longer a dependency`);
  }
  for (const name of Object.keys(policy.packages)) {
    if (!manifests.some((p) => p.name === name && !p.private)) problems.push(`dependency-policy.json lists ${name}, which is not a published package`);
  }
  return problems;
}

/** Both waiting periods are configured and at least `days` long. */
export function checkAge({ workspace, dependabot }, days) {
  const problems = [];
  const minutes = Number(/^minimumReleaseAge:\s*(\d+)/m.exec(workspace)?.[1] ?? 0);
  if (minutes < days * 24 * 60) problems.push(`pnpm-workspace.yaml: minimumReleaseAge must be at least ${days * 24 * 60} minutes (${days} days), found ${minutes}`);
  const cooldown = Number(/cooldown:\s*\n\s*default-days:\s*(\d+)/.exec(dependabot)?.[1] ?? 0);
  if (cooldown < days) problems.push(`.github/dependabot.yml: npm cooldown default-days must be at least ${days}, found ${cooldown}`);
  return problems;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const policy = JSON.parse(read('dependency-policy.json'));
  const manifests = readdirSync(new URL('packages/', root)).map((d) => JSON.parse(read(`packages/${d}/package.json`)));
  const problems = [
    ...lintLockfile(read('pnpm-lock.yaml')).map((p) => `pnpm-lock.yaml: not a registry sha512 resolution: ${p}`),
    ...checkRuntimeDeps(manifests, policy),
    ...checkAge({ workspace: read('pnpm-workspace.yaml'), dependabot: read('.github/dependabot.yml') }, policy.minimumReleaseAgeDays),
  ];
  if (problems.length) {
    console.error(problems.map((p) => `✗ ${p}`).join('\n'));
    process.exit(1);
  }
  const count = manifests.filter((p) => !p.private).reduce((n, p) => n + Object.keys(p.dependencies ?? {}).length, 0);
  console.log(`✓ supply chain: lockfile is registry + sha512 only, ${count} runtime dependencies all have a reason, releases wait ${policy.minimumReleaseAgeDays} days`);
}
