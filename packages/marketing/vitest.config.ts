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
  },
});
