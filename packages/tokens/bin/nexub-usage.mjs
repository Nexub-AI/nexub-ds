#!/usr/bin/env node
// nexub-usage: counts which @nexub exports your repos import, so the design
// system's deprecations and codemods follow real usage (roadmap R6).
//
//   npx -p @nexub/tokens nexub-usage ./apps/web ./apps/admin   markdown table
//   npx -p @nexub/tokens nexub-usage . --json                   JSON
//   npx -p @nexub/tokens nexub-usage ./src --css src/nexub.css    12.1: the CSS list (see cssPlan)
//   npx -p @nexub/tokens nexub-usage ./src --css src/nexub.css --check   CI: exit 1 if it is stale
//   npx -p @nexub/tokens nexub-usage --prune .next/static/css --js .next/static   12.1: after the build,
//       drop Nexub custom properties that nothing uses (see pruneCss)
//   npx -p @nexub/tokens nexub-usage --apps apps/crm apps/payhub [--wrapper packages/admin-ui]
//       [--stopgaps stopgaps.json] [--parts parts.json] [--tests] [--json]
//       12.7: one report per app: components and props, overrides, copies of Nexub parts,
//       deprecated APIs, @nexub versions, use through a wrapper package (see nexub-usage-apps.mjs)
//
// ponytail: regex over import statements, not a TS parse. It misses
// `import * as N` member use and re-exports; switch to the TS API if those matter.

import { readFileSync, readdirSync, statSync, existsSync, writeFileSync } from 'node:fs';
import { join, extname, dirname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { scanApp, summarize, wrapperMap, cssVarNames } from './nexub-usage-apps.mjs';

export * from './nexub-usage-apps.mjs';

const SKIP = new Set([
  'node_modules',
  'dist',
  'lib',
  'build',
  '.next',
  '.expo',
  '.turbo',
  '.git',
  'coverage',
]);
const EXT = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']);
const IMPORT = /import\s+(?:type\s+)?\{([^}]*)\}\s*from\s*['"](@nexub\/[^'"]+)['"]/g;

/** Returns [{ pkg, name }] for every named @nexub import in one source file. */
export function scanSource(text) {
  const out = [];
  for (const [, names, pkg] of text.matchAll(IMPORT)) {
    for (const raw of names.split(',')) {
      const name = raw
        .trim()
        .replace(/^type\s+/, '')
        .split(/\s+as\s+/)[0]
        .trim();
      if (name) out.push({ pkg, name });
    }
  }
  return out;
}

function* files(dir) {
  for (const entry of readdirSync(dir)) {
    if (SKIP.has(entry)) continue;
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) yield* files(path);
    else if (EXT.has(extname(entry))) yield path;
  }
}

/** Tallies imports across repos: one row per pkg + export, with use and repo counts. */
export function scanRepos(roots) {
  const tally = new Map();
  for (const root of roots) {
    for (const file of files(root)) {
      for (const { pkg, name } of scanSource(readFileSync(file, 'utf8'))) {
        const key = `${pkg} ${name}`;
        const row = tally.get(key) ?? { pkg, name, uses: 0, repos: new Set() };
        row.uses++;
        row.repos.add(root);
        tally.set(key, row);
      }
    }
  }
  return [...tally.values()].sort((a, b) => b.uses - a.uses || a.name.localeCompare(b.name));
}

/** True when every name of one trigger set appears in `text` (same rule as @nexub/themes build-parts). */
function needsPart(sets, text) {
  return sets.some((names) =>
    names.every((n) => new RegExp(`(^|[^A-Za-z0-9-])${n}($|[^A-Za-z0-9-])`).test(text)),
  );
}

/**
 * 12.1: what a Tailwind v4 app needs from the Nexub component packages, for the components it imports.
 *   imports   [{ pkg, name }] the app imports (scanSource)
 *   appText   the app's own source, for nx-* classes it uses directly (nx-stagger, nx-sheen…)
 *   manifests { '@nexub/react': css-manifest.json, … } from each package's dist
 *   parts     @nexub/themes/parts/index.json
 * Returns { parts: [part names, in core.css order], files: { pkg: [dist modules] }, unknown: [pkg name] }.
 */
export function cssPlan({ imports, appText, manifests, parts }) {
  const files = {};
  const unknown = [];
  const queue = [];
  const enqueue = (pkg, name) => {
    const m = manifests[pkg];
    if (!m) return;
    const mod = m.exports[name];
    if (mod) queue.push([pkg, mod]);
    else if (/^[A-Z]/.test(name)) unknown.push(`${pkg} ${name}`);
  };
  for (const { pkg, name } of imports) enqueue(pkg, name);
  const seen = new Set();
  const own = new Set();
  while (queue.length) {
    const [pkg, mod] = queue.pop();
    const key = `${pkg} ${mod}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const entry = manifests[pkg].modules[mod];
    if (!entry) continue;
    (files[pkg] ??= []).push(mod);
    for (const p of entry.parts ?? []) own.add(p);
    for (const dep of entry.deps) queue.push([pkg, dep]);
    for (const [other, names] of Object.entries(entry.nexub ?? {}))
      for (const n of names) enqueue(other, n);
  }
  for (const [name, sets] of Object.entries(parts.triggers))
    if (needsPart(sets, appText)) own.add(name);
  for (const list of Object.values(files)) list.sort();
  return {
    parts: parts.order.filter((p) => own.has(p)),
    files,
    unknown: [...new Set(unknown)].sort(),
  };
}

const posix = (p) => p.split(sep).join('/');

/** The CSS file `--css` writes. `distDirs` maps a package to its dist folder; paths are relative to `outFile`. */
export function renderCss(plan, { outFile, distDirs, command }) {
  const lines = [
    `/* GENERATED by \`${command}\` (12.1). Do not edit: run it again after you import`,
    '   other @nexub components. Load it after @nexub/themes/base-lean, and drop the',
    '   `@source` lines that scan a whole @nexub dist folder. */',
  ];
  for (const p of plan.parts) lines.push(`@import '@nexub/themes/parts/${p}.css' layer(base);`);
  for (const [pkg, mods] of Object.entries(plan.files)) {
    const base = posix(relative(dirname(outFile), distDirs[pkg]));
    for (const mod of mods) lines.push(`@source "${base}/${mod}";`);
  }
  return lines.join('\n') + '\n';
}

/**
 * 12.1: removes declarations of Nexub custom properties that nothing reads, from built CSS.
 *   css        the built stylesheet
 *   usedText   the built JS (and any other code that may write var(--x) or '--x')
 *   nexubNames the custom properties @nexub/tokens and @nexub/themes define: only these are ever
 *              removed, so the app's own custom properties always stay
 * A variable stays when the CSS or the code names it, when a kept variable's value uses it, or when
 * the code builds names from a prefix (`--motion-spring-${…}` keeps every --motion-spring-*).
 */
export function pruneCss(css, usedText, nexubNames) {
  const defs = new Map();
  for (const [, name, value] of css.matchAll(/(--[\w-]+)\s*:([^;}]*)/g))
    defs.set(name, (defs.get(name) ?? '') + value);
  const used = new Set();
  const prefixes = [];
  const note = (name) => {
    if (name.endsWith('-')) prefixes.push(name);
    else used.add(name);
  };
  const scan = (text) => {
    for (const [, name] of text.matchAll(/var\(\s*(--[\w-]+)/g)) note(name);
    for (const [, name] of text.matchAll(/["'`](--[\w-]+)/g)) note(name);
  };
  // References in the CSS itself (values, not the declarations' own names) and in the code.
  scan(css.replace(/(--[\w-]+)\s*:/g, ':'));
  scan(usedText);
  for (const name of defs.keys()) if (prefixes.some((p) => name.startsWith(p))) used.add(name);
  for (let changed = true; changed;) {
    changed = false;
    for (const name of [...used]) {
      for (const [, dep] of (defs.get(name) ?? '').matchAll(/var\(\s*(--[\w-]+)/g)) {
        if (!used.has(dep)) {
          used.add(dep);
          changed = true;
        }
      }
    }
  }
  let removed = 0;
  const out = css.replace(/(--[\w-]+)\s*:[^;}]*(;|(?=\}))/g, (decl, name) => {
    if (used.has(name) || !nexubNames.has(name)) return decl;
    removed++;
    return '';
  });
  return { css: out, removed };
}

/** Finds node_modules/<pkg> walking up from `from`. */
function findPackage(pkg, from) {
  for (let dir = resolve(from); ; dir = dirname(dir)) {
    const candidate = join(dir, 'node_modules', pkg);
    if (existsSync(join(candidate, 'package.json'))) return candidate;
    if (dirname(dir) === dir) return null;
  }
}

function appSource(roots) {
  let text = '';
  for (const root of roots)
    for (const file of files(root)) text += readFileSync(file, 'utf8') + '\n';
  return text;
}

/** Values after `flag` up to the next `--option`. */
function valuesOf(args, flag) {
  const at = args.indexOf(flag);
  if (at < 0) return [];
  const out = [];
  for (let i = at + 1; i < args.length && !args[i].startsWith('--'); i++) out.push(args[i]);
  return out;
}

/** Every file under `paths` (files or folders) whose name passes `keep`. */
function* filesUnder(paths, keep) {
  for (const p of paths) {
    if (!existsSync(p)) continue;
    if (statSync(p).isDirectory()) {
      for (const entry of readdirSync(p)) yield* filesUnder([join(p, entry)], keep);
    } else if (keep(p)) yield p;
  }
}

/** Custom properties that the installed @nexub/tokens and @nexub/themes define. */
function nexubNamesFrom(from) {
  const names = new Set();
  for (const [pkg, dir] of [
    ['@nexub/tokens', 'dist/css'],
    ['@nexub/themes', 'src'],
  ]) {
    const root = findPackage(pkg, from);
    if (!root) continue;
    for (const file of filesUnder([join(root, dir)], (f) => f.endsWith('.css'))) {
      for (const [, name] of readFileSync(file, 'utf8').matchAll(/(--[\w-]+)\s*:/g))
        names.add(name);
    }
  }
  return names;
}

/**
 * Nexub component names, for spotting copies: from a --parts file ({ pkg: [names] } or the docs'
 * web-props.generated.json shape), else from the installed packages' css-manifest.json exports.
 */
function partNames(file, from) {
  const names = new Set();
  const add = (list) => list.filter((n) => /^[A-Z]/.test(n)).forEach((n) => names.add(n));
  if (file) {
    for (const v of Object.values(JSON.parse(readFileSync(file, 'utf8'))))
      add(Array.isArray(v) ? v : Object.keys(v));
    return names;
  }
  for (const pkg of ['@nexub/react', '@nexub/patterns', '@nexub/marketing', '@nexub/diagram']) {
    for (const dir of from) {
      const root = findPackage(pkg, dir);
      const manifest = root && join(root, 'dist/css-manifest.json');
      if (manifest && existsSync(manifest)) {
        add(Object.keys(JSON.parse(readFileSync(manifest, 'utf8')).exports));
        break;
      }
    }
  }
  return names;
}

/** 12.7: `--apps`, one adoption report per app folder. */
function appsCli(args) {
  const roots = valuesOf(args, '--apps');
  if (!roots.length) {
    console.error(
      'usage: nexub-usage --apps <app-dir>... [--wrapper <package-dir>]... [--stopgaps <file>] [--parts <file>] [--tests] [--json]',
    );
    return 1;
  }
  const wrappers = valuesOf(args, '--wrapper').map((dir) => wrapperMap(dir));
  const stopgapsFile = valuesOf(args, '--stopgaps')[0];
  const stopgaps = stopgapsFile ? JSON.parse(readFileSync(stopgapsFile, 'utf8')).stopgaps : [];
  const here = dirname(fileURLToPath(import.meta.url));
  const themes = findPackage('@nexub/themes', here) ?? findPackage('@nexub/themes', roots[0]);
  const dsVars = cssVarNames([
    join(here, '../dist/css'),
    themes ? join(themes, 'src') : join(here, '../../themes/src'),
  ]);
  const parts = partNames(valuesOf(args, '--parts')[0], [...roots, here]);
  if (!parts.size)
    console.error('nexub-usage --apps: no Nexub component list found (pass --parts); copies are not counted.');
  const apps = {};
  for (const root of roots)
    apps[root] = scanApp(root, { wrappers, stopgaps, dsVars, parts, tests: args.includes('--tests') });
  if (args.includes('--json')) {
    console.log(JSON.stringify({ wrappers, apps }, null, 2));
    return 0;
  }
  console.log(
    '| App | Nexub version | Components (with wrappers) | Uses | Overrides | Copies | Deprecated | Stopgaps |\n|---|---|---|---|---|---|---|---|',
  );
  for (const [root, app] of Object.entries(apps)) {
    const s = summarize(app);
    console.log(
      `| ${root} | ${s.version ?? '—'} | ${s.componentsDirect} (${s.componentsWithWrappers}) | ${s.componentUses} | ${s.overrides} | ${s.copies} | ${s.deprecated} | ${s.stopgaps} |`,
    );
  }
  return 0;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.includes('--prune')) {
    const cssFiles = [...filesUnder(valuesOf(args, '--prune'), (f) => f.endsWith('.css'))];
    const code = [...filesUnder(valuesOf(args, '--js'), (f) => /\.(m?js|cjs|html)$/.test(f))];
    if (!cssFiles.length || !code.length) {
      console.error(
        'usage: nexub-usage --prune <built css file or folder>... --js <built code folder>...',
      );
      process.exit(1);
    }
    const names = nexubNamesFrom(process.cwd());
    if (!names.size) {
      console.error(
        'nexub-usage --prune: @nexub/tokens and @nexub/themes not found from here; run it in the app.',
      );
      process.exit(1);
    }
    // Every stylesheet counts as a reader too: a variable one file defines may be read by another.
    const allCss = cssFiles.map((f) => readFileSync(f, 'utf8'));
    const usedText =
      code.map((f) => readFileSync(f, 'utf8')).join('\n') +
      allCss.join('\n').replace(/(--[\w-]+)\s*:/g, ':');
    for (const [i, file] of cssFiles.entries()) {
      const { css, removed } = pruneCss(allCss[i], usedText, names);
      if (removed) writeFileSync(file, css);
      console.log(
        `nexub-usage --prune: ${file}: removed ${removed} unused Nexub custom properties`,
      );
    }
    process.exit(0);
  }
  if (args.includes('--apps')) {
    process.exit(appsCli(args));
  }
  const cssAt = args.indexOf('--css');
  const outFile = cssAt >= 0 ? args[cssAt + 1] : undefined;
  const roots = args.filter((a, i) => !a.startsWith('--') && !(cssAt >= 0 && i === cssAt + 1));
  if (!roots.length || (cssAt >= 0 && !outFile)) {
    console.error(
      'usage: nexub-usage <repo-dir>... [--json] | [--css <out.css> [--check]] | --apps <app-dir>... [--json]',
    );
    process.exit(1);
  }
  if (outFile) {
    const out = resolve(outFile);
    const manifests = {};
    const distDirs = {};
    for (const pkg of ['@nexub/react', '@nexub/patterns', '@nexub/marketing']) {
      const dir = findPackage(pkg, dirname(out));
      if (!dir) continue;
      const manifest = join(dir, 'dist/css-manifest.json');
      if (!existsSync(manifest)) {
        console.error(
          `nexub-usage --css: ${pkg} has no dist/css-manifest.json; it needs 12.1 or later.`,
        );
        process.exit(1);
      }
      manifests[pkg] = JSON.parse(readFileSync(manifest, 'utf8'));
      distDirs[pkg] = join(dir, 'dist');
    }
    const themes = findPackage('@nexub/themes', dirname(out));
    const index = themes && join(themes, 'src/parts/index.json');
    if (!index || !existsSync(index)) {
      console.error(
        'nexub-usage --css: @nexub/themes has no parts/index.json; it needs 12.1 or later.',
      );
      process.exit(1);
    }
    const imports = roots.flatMap((root) =>
      [...files(root)].flatMap((f) => scanSource(readFileSync(f, 'utf8'))),
    );
    const plan = cssPlan({
      imports,
      appText: appSource(roots),
      manifests,
      parts: JSON.parse(readFileSync(index, 'utf8')),
    });
    const command = `nexub-usage ${roots.join(' ')} --css ${outFile}`;
    const css = renderCss(plan, { outFile: out, distDirs, command });
    for (const u of plan.unknown)
      console.error(`nexub-usage --css: ${u} is not in the manifest (a type, or an old import?)`);
    if (args.includes('--check')) {
      const current = existsSync(out) ? readFileSync(out, 'utf8') : '';
      if (current !== css) {
        console.error(
          `nexub-usage --css: ${outFile} is stale. Run: npx -p @nexub/tokens ${command}`,
        );
        process.exit(1);
      }
      console.log(`nexub-usage --css: ${outFile} is up to date`);
    } else {
      writeFileSync(out, css);
      const count = Object.values(plan.files).reduce((n, l) => n + l.length, 0);
      console.log(
        `nexub-usage --css: wrote ${outFile} (${plan.parts.length} parts, ${count} modules)`,
      );
    }
    process.exit(0);
  }
  const rows = scanRepos(roots);
  if (args.includes('--json')) {
    console.log(
      JSON.stringify(
        rows.map((r) => ({ ...r, repos: [...r.repos] })),
        null,
        2,
      ),
    );
  } else {
    console.log('| Package | Export | Imports | Repos |\n|---|---|---|---|');
    for (const r of rows) console.log(`| ${r.pkg} | ${r.name} | ${r.uses} | ${r.repos.size} |`);
  }
}
