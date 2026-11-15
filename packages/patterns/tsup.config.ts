import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
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
  // esbuild writes the chunk imports of a file in a different order from build to build, and a
  // chunk's name is a hash of its text, so the name changes with that order. The imports are
  // side-effect-free definitions, so: sort them, and name each chunk by a hash of its text with
  // the chunk names masked. Two builds of one commit are then byte-identical
  // (scripts/reproducible-build.mjs).
  async onSuccess() {
    const CHUNK = /chunk-[A-Z0-9]{8}(?=\.js)/g;
    const IMPORT = /import (?:\{[^}]*\} from )?"(?:\.\.?\/)+chunk-[A-Z0-9]{8}\.js";\n/g;
    const mask = (text: string) => text.replace(CHUNK, 'chunk');
    const sortImports = (file: string, text: string, key: (statement: string) => string) => {
      const imports = [...text.matchAll(IMPORT)];
      if (!imports.length) return text;
      const start = imports[0]!.index;
      const end = imports.at(-1)!.index + imports.at(-1)![0].length;
      const block = imports.map((m) => m[0]);
      if (text.slice(start, end) !== block.join('')) throw new Error(`${file}: expected one block of chunk imports`);
      return text.slice(0, start) + block.sort((a, b) => (key(a) < key(b) ? -1 : 1)).join('') + text.slice(end);
    };
    const files = (readdirSync('dist', { recursive: true }) as string[]).filter((f) => f.endsWith('.js')).map((f) => `dist/${f}`);
    const names = new Map<string, string>();
    const taken = new Map<string, string>();
    for (const file of files) {
      const old = file.match(/^dist\/(chunk-[A-Z0-9]{8})\.js$/)?.[1];
      if (!old) continue;
      const text = readFileSync(file, 'utf8');
      const canonical = sortImports(file, mask(text), mask);
      const name = `chunk-${createHash('sha256').update(canonical).digest('hex').slice(0, 8).toUpperCase()}`;
      // Chunks with the same text and no chunk import are the same module (the empty chunks of
      // type-only files): they share one file. Anything else with the same name is a real clash.
      if (taken.has(name) && (taken.get(name) !== text || mask(text) !== text)) throw new Error(`${file}: chunk name ${name} is taken`);
      taken.set(name, text);
      names.set(old, name);
    }
    const rename = (text: string) => text.replace(CHUNK, (old) => names.get(old) ?? old);
    const output = files.map((file) => [rename(file), sortImports(file, rename(readFileSync(file, 'utf8')), (statement) => statement)] as const);
    for (const file of files) rmSync(file);
    for (const [file, text] of output) writeFileSync(file, text);
  },
});
