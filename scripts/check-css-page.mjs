// check-css-page: the 12.1 CSS gate. A typical app page (scripts/fixtures/css-page/Page.tsx)
// built the 12.1 way must load under half of the 11.6 `react/styles.css` budget (43.8 kB gzip):
//
//   1. `nexub-usage --css` lists the parts and dist modules the page's imports reach;
//   2. Tailwind v4 compiles the page's CSS from @nexub/themes/base-lean, light, dark and that list,
//      the way the platform apps set up their CSS;
//   3. `nexub-usage --prune` drops the Nexub custom properties nothing reads.
//
// Run after building the packages: `pnpm check:css-page`. Prints the size at each step.

import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { scanSource, cssPlan, renderCss, pruneCss } from '../packages/tokens/bin/nexub-usage.mjs';

/** Half of the 11.6 budget for react/styles.css (ROADMAP_12.x.md, 12.1). */
export const BUDGET = 21900;

const root = fileURLToPath(new URL('..', import.meta.url));
const pkgs = join(root, 'packages');
const react = join(pkgs, 'react');
const work = join(react, '.css-page');
const gz = (s) => gzipSync(s, { level: 9 }).length;

const page = readFileSync(join(root, 'scripts/fixtures/css-page/Page.tsx'), 'utf8');
const manifests = {};
const distDirs = {};
for (const pkg of ['react', 'patterns']) {
  const name = `@nexub/${pkg}`;
  manifests[name] = JSON.parse(readFileSync(join(pkgs, pkg, 'dist/css-manifest.json'), 'utf8'));
  distDirs[name] = join(pkgs, pkg, 'dist');
}
const parts = JSON.parse(readFileSync(join(pkgs, 'themes/src/parts/index.json'), 'utf8'));
const plan = cssPlan({ imports: scanSource(page), appText: page, manifests, parts });

rmSync(work, { recursive: true, force: true });
mkdirSync(work, { recursive: true });
const listFile = join(work, 'nexub.css');
writeFileSync(
  listFile,
  renderCss(plan, { outFile: listFile, distDirs, command: 'scripts/check-css-page.mjs' }),
);
writeFileSync(
  join(work, 'app.css'),
  [
    '@layer theme, base, nexub, components, utilities;',
    "@import 'tailwindcss/theme.css' layer(theme);",
    "@import '@nexub/themes/base-lean' layer(base);",
    "@import '@nexub/themes/light' layer(base);",
    "@import '@nexub/themes/dark' layer(base);",
    "@import 'tailwindcss/preflight.css' layer(base);",
    "@import 'tailwindcss/utilities.css' layer(utilities) source(none);",
    "@import '@nexub/tokens/tailwind.css';",
    "@import './nexub.css';",
    '',
  ].join('\n'),
);
const out = join(work, 'app.out.css');
execFileSync(
  join(react, 'node_modules/.bin/tailwindcss'),
  ['-i', join(work, 'app.css'), '-o', out, '--minify'],
  {
    cwd: react,
    stdio: ['ignore', 'ignore', 'inherit'],
  },
);
const compiled = readFileSync(out, 'utf8');

const code = Object.entries(plan.files)
  .flatMap(([pkg, mods]) => mods.map((m) => readFileSync(join(distDirs[pkg], m), 'utf8')))
  .join('\n');
const names = new Set();
for (const file of [
  join(pkgs, 'tokens/dist/css/variables.css'),
  join(pkgs, 'tokens/dist/css/roles.css'),
])
  for (const [, n] of readFileSync(file, 'utf8').matchAll(/(--[\w-]+)\s*:/g)) names.add(n);
for (const file of ['core.css', 'light.css', 'dark.css', 'fonts.css'])
  for (const [, n] of readFileSync(join(pkgs, 'themes/src', file), 'utf8').matchAll(
    /(--[\w-]+)\s*:/g,
  ))
    names.add(n);
const { css: pruned, removed } = pruneCss(compiled, code, names);

const full = gz(readFileSync(join(react, 'dist/styles.css'), 'utf8'));
const kb = (n) => `${(n / 1024).toFixed(1)} kB`;
console.log(
  `check-css-page: ${Object.values(plan.files).flat().length} modules, ${plan.parts.length} parts (${plan.parts.join(', ')})`,
);
console.log(`  react/styles.css (every component)     ${kb(full)}`);
console.log(`  base-lean + list, compiled             ${kb(gz(compiled))}`);
console.log(`  after --prune (${removed} properties)     ${kb(gz(pruned))}   budget ${kb(BUDGET)}`);
rmSync(work, { recursive: true, force: true });
if (gz(pruned) > BUDGET) {
  console.error(
    `check-css-page: the typical page is ${kb(gz(pruned))}, over the 12.1 budget of ${kb(BUDGET)}.`,
  );
  process.exit(1);
}
