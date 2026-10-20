import { defineConfig } from '@playwright/test';

// Visual regression + contrast over the built Storybook (run `build-storybook` first).
// Baselines are rendered in the pinned Playwright Linux image so they match CI:
//   pnpm --filter @nexub/react test:visual:docker [--update-snapshots]
export default defineConfig({
  testDir: '.',
  snapshotPathTemplate: '{testDir}/__screenshots__/{arg}{ext}',
  fullyParallel: true,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:6007',
    viewport: { width: 1024, height: 768 },
    deviceScaleFactor: 1,
    colorScheme: 'light',
    reducedMotion: 'reduce',
  },
  expect: {
    toHaveScreenshot: { animations: 'disabled', caret: 'hide', scale: 'css' },
  },
  webServer: {
    command: 'node visual/serve.mjs',
    cwd: '..',
    url: 'http://localhost:6007/index.json',
    reuseExistingServer: !process.env.CI,
  },
});
