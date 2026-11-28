import { defineConfig } from 'tsup';

export default defineConfig({
  // One entry and no splitting: a single dist/index.js, so two builds of one commit are
  // byte-identical without the chunk renaming @nexub/patterns needs.
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  splitting: false,
  sourcemap: true, // 12.8: for ../../scripts/minify-dist.mjs, which minifies dist/ after the build
  // 12.8: no @__PURE__ on JSX calls: nearly all sit inside components, where they don't help
  // tree-shaking, and minify-dist keeps every annotation, so they would only add bytes.
  esbuildOptions(options) {
    options.jsxSideEffects = true;
  },
  clean: true,
  // React Flow is a peer: apps that draw diagrams install it; the size budget measures our code only.
  external: ['react', 'react-dom', '@nexub/react', '@nexub/icons', '@nexub/tokens', '@xyflow/react'],
  // React Flow is client-only (hooks, DOM measurement); mark every output for Next.js RSC.
  banner: { js: "'use client';" },
});
