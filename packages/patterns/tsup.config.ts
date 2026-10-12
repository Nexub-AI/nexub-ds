import { defineConfig } from 'tsup';

export default defineConfig({
  // One entry per component so consumers' bundlers can drop unused modules
  // (sideEffects:false only works at module granularity).
  entry: ['src/index.ts', 'src/components/*/index.ts'],
  format: ['esm'],
  dts: { entry: 'src/index.ts' },
  splitting: true,
  clean: true,
  external: ['react', 'react-dom', '@nexub/react', '@nexub/icons', '@nexub/tokens'],
  // esbuild strips module-level directives when bundling; re-add on every
  // output file so Next.js RSC consumers can import from server components.
  banner: { js: "'use client';" },
});
