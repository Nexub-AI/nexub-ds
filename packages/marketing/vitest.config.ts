import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Per-package cache: under vite 8 both packages otherwise share one dir and race under turbo.
  cacheDir: 'node_modules/.vite',
  test: {
    // Vitest 5's module cache defaults to the workspace root; per package, or
    // parallel runs under turbo delete each other's cache (ENOTEMPTY).
    fsModuleCachePath: new URL('node_modules/.vitest-cache', import.meta.url).pathname,
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
    // On for `pnpm test` (vitest run --coverage); reports land in coverage/.
    // Thresholds are a ratchet: raise them as tests land, never lower them.
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.{ts,tsx}', 'src/**/*.stories.tsx', 'src/test-setup.ts'],
      reporter: ['text-summary', 'json-summary'],
      // Measured 2026-11-11 (8.2), rounded down.
      thresholds: { lines: 100, functions: 100, branches: 71, statements: 100 },
    },
  },
});
