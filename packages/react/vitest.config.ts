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
    // visual/ is the Playwright suite (pnpm test:visual), not vitest.
    // src/leaks.test.tsx takes minutes (1,000 mounts per story): `pnpm test:leaks`, CI job "Resilience".
    exclude: ['**/node_modules/**', '**/dist/**', 'visual/**', ...(process.env.LEAKS ? [] : ['src/leaks.test.tsx'])],
    // On for `pnpm test` (vitest run --coverage). Reports land in coverage/
    // (turbo's test output). Thresholds are a ratchet: raise them as tests
    // land, never lower them.
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.{ts,tsx}', 'src/**/*.stories.tsx', 'src/stories/**', 'src/test-setup.ts', 'src/vendor/**'],
      reporter: ['text-summary', 'json-summary'],
      // Measured 2026-11-11 (8.2), rounded down.
      thresholds: { lines: 95, functions: 91, branches: 85, statements: 93 },
    },
  },
});
