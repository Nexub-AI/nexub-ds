import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { defineConfig } from 'tsup';

export default defineConfig({
  // One entry per component so consumers' bundlers can drop unused modules
  // (sideEffects:false only works at module granularity).
  // An explicit, sorted list, not a glob: glob order isn't stable, and it decided the order of
  // the chunk imports in dist/index.js, so two builds of one commit differed (9.7).
  entry: ['src/index.ts', ...readdirSync('src/components').sort().map((dir) => `src/components/${dir}/index.ts`)],
  format: ['esm'],
  dts: { entry: 'src/index.ts' },
  splitting: true,
  clean: true,
  external: ['react', 'react-dom', '@nexub/react', '@nexub/icons', '@nexub/tokens'],
  // esbuild strips module-level directives when bundling; re-add on every
  // output file so Next.js RSC consumers can import from server components.
  banner: { js: "'use client';" },
  // esbuild writes the chunk imports of dist/index.js in a different order from build to
  // build. They are side-effect-free definitions, so sort them by path: two builds of one
  // commit are then byte-identical (scripts/reproducible-build.mjs).
  async onSuccess() {
    const file = 'dist/index.js';
    const source = readFileSync(file, 'utf8');
    const IMPORT = /import (?:\{[^}]*\} from )?"([^"]+)";\n/g;
    const imports = [...source.matchAll(IMPORT)];
    const start = imports[0]!.index;
    const end = imports.at(-1)!.index + imports.at(-1)![0].length;
    if (source.slice(start, end) !== imports.map((m) => m[0]).join('')) throw new Error(`${file}: expected one block of imports`);
    const sorted = imports.sort((a, b) => (a[1]! < b[1]! ? -1 : 1)).map((m) => m[0]).join('');
    writeFileSync(file, source.slice(0, start) + sorted + source.slice(end));
  },
});
