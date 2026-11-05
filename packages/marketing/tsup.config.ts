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
  silent: true, // one line per file otherwise
});
