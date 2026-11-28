// minify-dist (12.8): minifies a package's built JavaScript in place, with source maps.
//   node ../../scripts/minify-dist.mjs [dir=dist] [--skip <prefix>]…
// Run from the package root after its build (tsup `sourcemap: true`; tsc `sourceMap` with
// `inlineSources` in @nexub/tokens). Every .js file in `dir` must have the .js.map the build
// wrote beside it (src/ → dist/); each one is rewritten minified with terser and its map composed
// onto that one, so the published map still points at src/ and carries it (sourcesContent): a
// stack trace or a debugger shows the source.
// `--skip vendor/` leaves files under that prefix as they are (third-party code the build
// already minified, without a map).
//
// What stays: exports and their names, property names (no property mangling), module-level
// directives ('use client'), and /* @__PURE__ */ annotations, which consumers' bundlers need to
// drop unused icons and tables. Function and class names stay too (React DevTools, stack
// traces). Imports are untouched, so each entry point and module stays its own file and
// tree-shaking works as before. Type declarations are not touched.
// terser, not esbuild: esbuild drops @__PURE__ annotations when it minifies whitespace.
// Deterministic: the same input gives the same bytes (scripts/reproducible-build.mjs).
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { basename, join, relative } from 'node:path';
import { minify } from 'terser';

const args = process.argv.slice(2);
const skip = args.flatMap((a, i) => (args[i - 1] === '--skip' ? [a] : []));
const dir = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--skip') ?? 'dist';

const MAP_URL = /\n?\/\/# sourceMappingURL=\S+\s*$/;

const files = readdirSync(dir, { recursive: true })
  .map(String)
  .filter((f) => f.endsWith('.js') && !skip.some((p) => f.startsWith(p)))
  .sort();

for (const f of files) {
  const file = join(dir, f);
  const mapFile = `${file}.map`;
  if (!existsSync(mapFile))
    throw new Error(
      `${file}: no source map beside it; build with \`sourcemap: true\` (or --skip it)`,
    );
  const code = readFileSync(file, 'utf8').replace(MAP_URL, '\n');
  const result = await minify(
    { [basename(file)]: code },
    {
      module: true,
      ecma: 2020,
      // `directives: false` keeps 'use client' (terser drops directives it doesn't know).
      compress: { directives: false },
      mangle: true,
      keep_classnames: true,
      keep_fnames: true,
      format: { comments: false, preserve_annotations: true },
      sourceMap: {
        content: readFileSync(mapFile, 'utf8'),
        url: basename(mapFile),
        includeSources: true,
      },
    },
  );
  writeFileSync(file, `${result.code}\n`);
  writeFileSync(mapFile, result.map);
}
console.log(`minify-dist: ${files.length} files in ${relative(process.cwd(), dir) || '.'}`);
