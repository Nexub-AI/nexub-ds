import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
    // visual/ is the Playwright suite (pnpm test:visual), not vitest.
    exclude: ['**/node_modules/**', '**/dist/**', 'visual/**'],
  },
});
