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
      exclude: ['src/**/*.test.ts', 'src/test-setup.ts'],
      reporter: ['text-summary', 'json-summary'],
      // 11.6: set from the first measured run, rounded down; a ratchet from here.
      thresholds: { lines: 0, functions: 0, branches: 0, statements: 0 },
    },
  },
});
