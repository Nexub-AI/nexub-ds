import { defineConfig } from 'tsup';

// One output file per source file (no bundle), like @nexub/react: each module
// keeps its own 'use client' or none, so the sections render as React Server
// Components and only the interactive ones (FAQ, PricingTable, MarketingNav)
// ship to the browser. Types come from tsc (see the build script).
export default defineConfig({
  entry: ['src/**/*.{ts,tsx}', '!src/**/*.test.{ts,tsx}', '!src/**/*.stories.tsx', '!src/test-setup.ts'],
  format: ['esm'],
  bundle: false,
  clean: false,
  sourcemap: true, // 12.8: for ../../scripts/minify-dist.mjs, which minifies dist/ after the build
  // 12.8: no @__PURE__ on JSX calls: nearly all sit inside components, where they don't help
  // tree-shaking, and minify-dist keeps every annotation, so they would only add bytes.
  esbuildOptions(options) {
    options.jsxSideEffects = true;
  },
  silent: true, // one line per file otherwise
});
