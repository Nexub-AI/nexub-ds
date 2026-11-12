// 9.7: the published tarballs are reproducible. Builds every package from clean and packs
// it, twice, and compares the sha256 of each tarball. A difference means the build depends
// on something outside the commit (time, order, machine), so a published tarball could not
// be re-derived from its source and its provenance would prove less.
//
//   node scripts/reproducible-build.mjs            build + pack twice, compare
//   node scripts/reproducible-build.mjs --pack DIR  build is done: pack into DIR and print checksums
//   node scripts/reproducible-build.mjs --against FILE  build + pack once, compare with a checksums.txt
//     from another build of this commit (ci.yml: the release build ran on a different machine)
// The second form is what release builds use (build-release.yml), so the release and this
// check pack the same way. Node 24, no dependencies.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const run = (cmd, args, cwd = root) => execFileSync(cmd, args, { cwd, stdio: ['ignore', 'pipe', 'inherit'], encoding: 'utf8' });

const published = () =>
  readdirSync(join(root, 'packages'))
    .map((dir) => ({ dir: join(root, 'packages', dir), pkg: JSON.parse(readFileSync(join(root, 'packages', dir, 'package.json'), 'utf8')) }))
    .filter(({ pkg }) => !pkg.private);

const DEP_FIELDS = ['dependencies', 'peerDependencies', 'peerDependenciesMeta', 'optionalDependencies', 'devDependencies'];

/**
 * Packs every published package into `dest`; returns { 'file.tgz': sha256 }.
 * `pnpm pack` resolves the workspace: ranges and applies publishConfig, but writes the
 * dependency maps back in a different key order on each run, so its tarball is never the
 * same twice. So: take its tarball, sort those keys, and let `npm pack` write the final
 * one (sorted entries, fixed mtime). Scripts are off in both steps.
 */
export function pack(destination) {
  const dest = resolve(destination); // npm pack runs in a temp directory
  mkdirSync(dest, { recursive: true });
  for (const { dir } of published()) {
    const tmp = mkdtempSync(join(tmpdir(), 'nexub-pack-'));
    run('pnpm', ['pack', '--pack-destination', tmp, '--config.ignore-scripts=true'], dir);
    const [tgz] = readdirSync(tmp).filter((f) => f.endsWith('.tgz'));
    run('tar', ['-xzf', join(tmp, tgz), '-C', tmp]);
    const manifestPath = join(tmp, 'package', 'package.json');
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    for (const field of DEP_FIELDS) {
      if (manifest[field]) manifest[field] = Object.fromEntries(Object.entries(manifest[field]).sort(([a], [b]) => (a < b ? -1 : 1)));
    }
    writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
    run('npm', ['pack', '--ignore-scripts', '--loglevel=error', '--pack-destination', dest], join(tmp, 'package'));
    rmSync(tmp, { recursive: true, force: true });
  }
  return Object.fromEntries(
    readdirSync(dest)
      .filter((f) => f.endsWith('.tgz'))
      .sort()
      .map((f) => [f, createHash('sha256').update(readFileSync(join(dest, f))).digest('hex')]),
  );
}

function buildAndPack() {
  for (const { dir } of published()) {
    rmSync(join(dir, 'dist'), { recursive: true, force: true });
    rmSync(join(dir, 'lib'), { recursive: true, force: true });
  }
  run('pnpm', ['turbo', 'build', "--filter=./packages/*", '--force', '--output-logs=errors-only']);
  return pack(mkdtempSync(join(tmpdir(), 'nexub-pack-')));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const at = process.argv.indexOf('--pack');
  const against = process.argv.indexOf('--against');
  if (against > 0) {
    const theirs = Object.fromEntries(
      readFileSync(process.argv[against + 1], 'utf8').split('\n').filter(Boolean).map((l) => l.split(/\s+/).reverse()),
    );
    const ours = buildAndPack();
    const names = [...new Set([...Object.keys(ours), ...Object.keys(theirs)])].sort();
    const differing = names.filter((f) => ours[f] !== theirs[f]);
    for (const f of names) console.log(`${differing.includes(f) ? '✗' : '✓'} ${f} ${ours[f]?.slice(0, 16) ?? 'missing'}${differing.includes(f) ? ` ≠ ${theirs[f]?.slice(0, 16) ?? 'missing'}` : ''}`);
    if (differing.length) {
      console.error(`✗ ${differing.length} tarball(s) differ from the other build of this commit`);
      process.exit(1);
    }
    console.log(`✓ ${names.length} tarballs are byte-identical to the other build of this commit`);
  } else if (at > 0) {
    // sha256sum format, for `sha256sum -c` and the release's checksums.txt.
    for (const [file, hash] of Object.entries(pack(process.argv[at + 1]))) console.log(`${hash}  ${file}`);
  } else {
    const first = buildAndPack();
    const second = buildAndPack();
    const differing = Object.keys(first).filter((f) => first[f] !== second[f]);
    for (const f of Object.keys(first)) console.log(`${differing.includes(f) ? '✗' : '✓'} ${f} ${first[f].slice(0, 16)}${differing.includes(f) ? ` ≠ ${second[f]?.slice(0, 16)}` : ''}`);
    if (differing.length || Object.keys(first).length !== Object.keys(second).length) {
      console.error(`✗ ${differing.length} tarball(s) differ between two builds of the same commit`);
      process.exit(1);
    }
    console.log(`✓ ${Object.keys(first).length} tarballs are byte-identical across two clean builds`);
  }
}
