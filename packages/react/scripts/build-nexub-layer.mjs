// 11.9 (RFC 12.0, decision 2): dist/styles.nexub-layer.css, the opt-in 12.0 stylesheet.
// Built from src/styles.css, the one source: every cascade layer it declares or imports into
// moves under one `nexub` layer (theme → nexub.theme, base → nexub.base, …), so an app's own
// layers (Tailwind v4's theme/base/components/utilities included) all come after it and win.
//   node scripts/build-nexub-layer.mjs     (run by `pnpm build`, after dist/styles.css)
// The relative @import of the v3 compatibility file is inlined so its `@layer base` moves too;
// Tailwind compiles the result from stdin with src/ as its base, so the @source globs and the
// utilities import's source(none) mean what they mean in styles.css.
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const pkg = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const src = resolve(pkg, 'src');

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
export function toNexubLayer(css, from = resolve(src, 'styles.css')) {
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
  if (stray.length) throw new Error(`styles.nexub-layer.css: layers outside nexub: ${stray.join(', ')}`);
  return out;
}

/** Compile a stylesheet source with the package's Tailwind CLI, `base` = src/ (as styles.css). */
export function compile(css, { minify = true } = {}) {
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

export function buildNexubLayer() {
  return nexubLayerOutput(compile(toNexubLayer(readFileSync(resolve(src, 'styles.css'), 'utf8'))));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const out = resolve(pkg, 'dist/styles.nexub-layer.css');
  writeFileSync(out, buildNexubLayer());
  console.log(`styles.nexub-layer.css: ${readFileSync(out).length} B`);
}
