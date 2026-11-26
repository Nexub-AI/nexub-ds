// 12.0 (RFC 12.0, decision 2): every prebuilt stylesheet in one `nexub` cascade layer.
// Built from the package's source stylesheet: every cascade layer it declares or imports into
// moves under `nexub` (theme → nexub.theme, base → nexub.base, …), so an app's own layers
// (Tailwind v4's theme/base/components/utilities included) all come after it and win.
//   node <react>/scripts/build-nexub-layer.mjs [input] [output…]
// Run from the package root (its Tailwind CLI compiles); defaults: src/styles.css →
// dist/styles.css. @nexub/react also writes dist/styles.nexub-layer.css, the 11.9 opt-in name,
// kept in 12.x so apps that switched early keep working (`changes-in-12` moves them back).
// The relative @import of the v3 compatibility file is inlined so its `@layer base` moves too;
// Tailwind compiles the result from stdin with src/ as its base, so the @source globs and the
// utilities import's source(none) mean what they mean in styles.css.
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const reactPkg = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const LAYER_LIST = /@layer\s+([\w.-]+(?:\s*,\s*[\w.-]+)*)(?=\s*[;{])/g;
const IMPORT_LAYER = /(@import\s+['"][^'"]+['"]\s+)layer\(([\w-]+)\)/g;
const LOCAL_IMPORT = /@import\s+['"](\.{1,2}\/[^'"]+\.css)['"]\s*;/g;

const prefix = (names) =>
  names
    .split(',')
    .map((n) => n.trim())
    .map((n) => (n.startsWith('nexub.') ? n : `nexub.${n}`))
    .join(', ');

/** Rename every layer in a stylesheet's source under `nexub` (no nested layers expected). */
export function toNexubLayer(css, from = resolve(reactPkg, 'src/styles.css')) {
  const inlined = css.replace(LOCAL_IMPORT, (_, spec) => {
    const file = resolve(dirname(from), spec);
    return toNexubLayer(readFileSync(file, 'utf8'), file).trim();
  });
  return inlined
    .replace(IMPORT_LAYER, (_, head, name) => `${head}layer(nexub.${name})`)
    .replace(LAYER_LIST, (_, names) => `@layer ${prefix(names)}`);
}

/** Tailwind adds layers of its own to the output (`properties`, for @property fallbacks). */
export function nexubLayerOutput(css) {
  const out = css.replace(LAYER_LIST, (_, names) => `@layer ${prefix(names)}`);
  const stray = [...out.matchAll(/@layer\b([^;{]*)/g)]
    .flatMap((m) => m[1].split(','))
    .map((n) => n.trim() || '(anonymous)')
    .filter((n) => !n.startsWith('nexub.'));
  if (stray.length) throw new Error(`nexub layer build: layers outside nexub: ${stray.join(', ')}`);
  return out;
}

/** Compile a stylesheet source with a package's Tailwind CLI, `base` = the source's folder. */
export function compile(css, { minify = true, pkg = reactPkg, src = resolve(pkg, 'src') } = {}) {
  const bin = resolve(pkg, 'node_modules/.bin/tailwindcss');
  const r = spawnSync(bin, ['-i', '-', ...(minify ? ['--minify'] : [])], {
    cwd: src,
    input: css,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
  if (r.status !== 0) throw new Error(`tailwindcss failed:\n${r.stderr}`);
  return r.stdout.trimEnd();
}

export function buildNexubLayer(input = resolve(reactPkg, 'src/styles.css'), pkg = reactPkg) {
  return nexubLayerOutput(compile(toNexubLayer(readFileSync(input, 'utf8'), input), { pkg, src: dirname(input) }));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const pkg = process.cwd();
  const [input = 'src/styles.css', ...outs] = process.argv.slice(2);
  const css = buildNexubLayer(resolve(pkg, input), pkg);
  for (const out of outs.length ? outs : ['dist/styles.css']) {
    writeFileSync(resolve(pkg, out), css);
    console.log(`${out}: ${Buffer.byteLength(css)} B`);
  }
}
