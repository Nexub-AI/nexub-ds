// build-css-manifest: writes dist/css-manifest.json for a component package (12.1).
//
//   node scripts/build-css-manifest.mjs packages/react
//
// The manifest lets `nexub-usage --css` give a Tailwind v4 app only the CSS for the
// components it imports:
//   exports  export name → the dist module that defines it
//   modules  dist module → { deps: relative modules it imports, nexub: { pkg: [names] } it
//            imports from other @nexub packages, parts: @nexub/themes parts its code needs }
// A module's CSS needs are its own plus those of everything it imports, so the reader walks
// `deps` (and `nexub`) from each import the app makes.

import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const posix = (p) => p.split(sep).join('/');

function* jsFiles(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* jsFiles(path);
    else if (entry.name.endsWith('.js')) yield path;
  }
}

/** Named imports from other @nexub packages: { '@nexub/react': ['Button', …] }. */
export function nexubImports(code, self) {
  const out = {};
  for (const [, names, pkg] of code.matchAll(
    /import\s*\{([^}]*)\}\s*from\s*["'](@nexub\/[a-z-]+)["']/g,
  )) {
    if (pkg === self) continue;
    for (const raw of names.split(',')) {
      const name = raw
        .trim()
        .replace(/^type\s+/, '')
        .split(/\s+as\s+/)[0]
        .trim();
      if (name) (out[pkg] ??= new Set()).add(name);
    }
  }
  return Object.fromEntries(Object.entries(out).map(([k, v]) => [k, [...v].sort()]));
}

/** export name → module, read from the package's dist/index.js re-exports and imports. */
export function exportsOf(indexCode) {
  const local = new Map();
  for (const [, names, spec] of indexCode.matchAll(
    /import\s*\{([^}]*)\}\s*from\s*["'](\.[^"']+)["']/g,
  )) {
    for (const raw of names.split(',')) {
      const [orig, alias] = raw
        .trim()
        .split(/\s+as\s+/)
        .map((s) => s.trim());
      if (orig) local.set(alias ?? orig, spec);
    }
  }
  const out = {};
  for (const [, names, spec] of indexCode.matchAll(
    /export\s*\{([^}]*)\}(?:\s*from\s*["'](\.[^"']+)["'])?/g,
  )) {
    for (const raw of names.split(',')) {
      const [orig, alias] = raw
        .trim()
        .split(/\s+as\s+/)
        .map((s) => s.trim());
      if (!orig) continue;
      const from = spec ?? local.get(orig);
      if (from) out[alias ?? orig] = from.replace(/^\.\//, '');
    }
  }
  return out;
}

export function buildManifest(pkgDir, parts) {
  const dist = join(pkgDir, 'dist');
  const self = JSON.parse(readFileSync(join(pkgDir, 'package.json'), 'utf8')).name;
  const modules = {};
  for (const file of jsFiles(dist)) {
    const code = readFileSync(file, 'utf8');
    const deps = [];
    for (const [, spec] of code.matchAll(/(?:from|import)\s*["'](\.[^"']+)["']/g)) {
      const target = resolve(dirname(file), spec);
      if (existsSync(target)) deps.push(posix(relative(dist, target)));
    }
    const need = Object.entries(parts.triggers)
      .filter(([, sets]) => parts.needsPart(sets, code))
      .map(([name]) => name);
    const entry = { deps: [...new Set(deps)].sort() };
    const nexub = nexubImports(code, self);
    if (Object.keys(nexub).length) entry.nexub = nexub;
    if (need.length) entry.parts = need;
    modules[posix(relative(dist, file))] = entry;
  }
  return {
    package: self,
    exports: exportsOf(readFileSync(join(dist, 'index.js'), 'utf8')),
    modules,
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const pkgDir = resolve(process.argv[2]);
  // Runs in this repo only (package builds), so the workspace's @nexub/themes is the one to read.
  const themes = fileURLToPath(new URL('../packages/themes/', import.meta.url));
  const { needsPart } = await import(join(themes, 'scripts/build-parts.mjs'));
  const { triggers } = JSON.parse(readFileSync(join(themes, 'src/parts/index.json'), 'utf8'));
  const manifest = buildManifest(pkgDir, { triggers, needsPart });
  writeFileSync(join(pkgDir, 'dist/css-manifest.json'), JSON.stringify(manifest) + '\n');
  console.log(
    `css-manifest: ${manifest.package}, ${Object.keys(manifest.exports).length} exports, ${Object.keys(manifest.modules).length} modules`,
  );
}
