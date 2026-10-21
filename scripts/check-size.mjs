// Bundle-size budgets for the published packages (gzip; brotli shown for reference).
//   node scripts/check-size.mjs           check against size-budgets.json (exit 1 on any overrun)
//   node scripts/check-size.mjs --update  rewrite budgets to current size +10%, rounded up to 100 B
// Run after `pnpm turbo build --filter='./packages/*'`. Each JS entry is measured with every
// local file it imports (followed recursively, each file counted once); bare imports are
// peer/third-party and not counted. Each CSS entry includes its local @import graph.
import { readFileSync, readdirSync, writeFileSync, appendFileSync, existsSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync, brotliCompressSync, constants } from 'node:zlib';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pkgs = join(root, 'packages');
const budgetFile = join(root, 'size-budgets.json');

const JS_IMPORT =
  /(?:\bimport|\bexport)\s*(?:[^'";]*?\bfrom\s*)?['"](\.{1,2}\/[^'"]+)['"]|\bimport\(\s*['"](\.{1,2}\/[^'"]+)['"]\s*\)/g;
const CSS_IMPORT = /@import\s+(?:url\()?['"]([^'"]+)['"]/g;

// '@nexub/tokens/css' → packages/tokens/<exports['./css']>; relative → file path.
function resolveCss(spec, from) {
  if (spec.startsWith('.')) return resolve(dirname(from), spec);
  const m = spec.match(/^@nexub\/([^/]+)(\/.*)?$/);
  if (!m) return null; // third-party CSS: not ours to budget
  const pkg = JSON.parse(readFileSync(join(pkgs, m[1], 'package.json'), 'utf8'));
  const target = pkg.exports?.[`.${m[2] ?? ''}`];
  return typeof target === 'string' ? join(pkgs, m[1], target) : null;
}

function graph(entry) {
  const seen = new Set();
  const visit = (file) => {
    if (seen.has(file)) return;
    seen.add(file);
    const src = readFileSync(file, 'utf8');
    const isCss = file.endsWith('.css');
    for (const m of src.matchAll(isCss ? CSS_IMPORT : JS_IMPORT)) {
      const dep = isCss ? resolveCss(m[1], file) : resolve(dirname(file), m[1] ?? m[2]);
      if (dep && existsSync(dep)) visit(dep);
    }
  };
  visit(entry);
  return [...seen];
}

function measure(entry) {
  const files = graph(entry);
  let gzip = 0;
  let brotli = 0;
  for (const f of files) {
    const buf = readFileSync(f);
    gzip += gzipSync(buf, { level: 9 }).length;
    brotli += brotliCompressSync(buf, { params: { [constants.BROTLI_PARAM_QUALITY]: 11 } }).length;
  }
  return { gzip, brotli, files: files.length };
}

const entries = {};
const add = (name, file) => {
  if (!existsSync(file))
    throw new Error(`${name}: ${relative(root, file)} missing — build packages first`);
  entries[name] = file;
};

add('tokens (js)', join(pkgs, 'tokens/dist/js/index.js'));
// Runtime seed theming (lazy-loaded by ThemeProvider seed); MCU is a dependency, not counted.
add('tokens/seed', join(pkgs, 'tokens/dist/js/seed.js'));
// Every CSS file a consumer can import (package.json exports ending in .css).
for (const pkg of ['tokens', 'themes']) {
  const { exports } = JSON.parse(readFileSync(join(pkgs, pkg, 'package.json'), 'utf8'));
  for (const [key, target] of Object.entries(exports)) {
    if (typeof target === 'string' && target.endsWith('.css'))
      add(`${pkg}${key.slice(1)}`, join(pkgs, pkg, target));
  }
}
add('icons', join(pkgs, 'icons/dist/index.js'));
add('react', join(pkgs, 'react/dist/index.js'));
add('patterns', join(pkgs, 'patterns/dist/index.js'));
for (const dir of ['react', 'patterns']) {
  const comps = join(pkgs, dir, 'dist/components');
  if (!existsSync(comps)) continue;
  for (const c of readdirSync(comps).sort()) {
    const file = join(comps, c, 'index.js');
    if (existsSync(file)) add(`${dir}/${c}`, file);
  }
}

const results = Object.entries(entries).map(([name, file]) => ({ name, ...measure(file) }));
const kb = (n) => `${(n / 1024).toFixed(1)} kB`;

if (process.argv.includes('--update')) {
  const budgets = Object.fromEntries(
    results.map((r) => [r.name, Math.ceil((r.gzip * 1.1) / 100) * 100]),
  );
  writeFileSync(budgetFile, `${JSON.stringify(budgets, null, 2)}\n`);
  console.log(`Wrote ${results.length} budgets to ${relative(root, budgetFile)}`);
  process.exit(0);
}

const budgets = JSON.parse(readFileSync(budgetFile, 'utf8'));
const rows = results.map((r) => {
  const budget = budgets[r.name];
  const status = budget === undefined ? 'NO BUDGET' : r.gzip > budget ? 'OVER' : 'ok';
  return { ...r, budget, status };
});
const failed = rows.filter((r) => r.status !== 'ok');

console.table(
  Object.fromEntries(
    rows.map((r) => [
      r.name,
      {
        gzip: kb(r.gzip),
        brotli: kb(r.brotli),
        files: r.files,
        budget: r.budget === undefined ? '—' : kb(r.budget),
        delta:
          r.budget === undefined ? '—' : `${r.gzip > r.budget ? '+' : ''}${kb(r.gzip - r.budget)}`,
        status: r.status,
      },
    ]),
  ),
);

if (process.env.GITHUB_STEP_SUMMARY) {
  const top = [...rows].sort((a, b) => b.gzip - a.gzip).slice(0, 10);
  const line = (r) =>
    `| ${r.name} | ${kb(r.gzip)} | ${r.budget === undefined ? '—' : kb(r.budget)} | ${r.status} |`;
  const md = [
    `### Bundle size: ${failed.length ? `${failed.length} over budget` : `all ${rows.length} entries within budget`}`,
    '',
    '| Entry | gzip | Budget | Status |',
    '|---|---|---|---|',
    ...(failed.length ? failed : top).map(line),
    '',
    failed.length ? '' : '_Largest 10 entries shown. Full table in the job log._',
    '',
  ];
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, md.join('\n'));
}

if (failed.length) {
  for (const r of failed) {
    console.error(
      r.status === 'OVER'
        ? `✗ ${r.name}: ${kb(r.gzip)} gzip exceeds budget ${kb(r.budget)}`
        : `✗ ${r.name}: no budget in size-budgets.json (new entry? run \`pnpm check:size --update\` and review the diff)`,
    );
  }
  process.exit(1);
}
console.log(`✓ ${rows.length} entries within budget`);
