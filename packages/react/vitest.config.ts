import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Per-package cache: under vite 8 both packages otherwise share one dir and race under turbo.
  cacheDir: 'node_modules/.vite',
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
    // visual/ is the Playwright suite (pnpm test:visual), not vitest.
    exclude: ['**/node_modules/**', '**/dist/**', 'visual/**'],
  },
});
