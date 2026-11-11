import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from '@playwright/test';

// Visual regression + contrast over the built Storybook (run `build-storybook` first),
// plus the docs foundation pages (project "docs": run `pnpm --filter @nexub/docs build` first).
// Baselines are rendered in the pinned Playwright Linux image so they match CI:
//   pnpm --filter @nexub/react test:visual:docker [--update-snapshots] [--project=docs]
const docsOut = fileURLToPath(new URL('../../../apps/docs/out/', import.meta.url));

export default defineConfig({
  testDir: '.',
  snapshotPathTemplate: '{testDir}/__screenshots__/{arg}{ext}',
  fullyParallel: true,
  // One retry in CI only to tell flaky from broken; flake-report.mjs lists every test
  // that needed it (step summary) so it gets fixed, and applies quarantine.json.
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI
    ? [['list'], ['html', { open: 'never' }], ['./flake-report.mjs']]
    : [['list'], ['./flake-report.mjs']],
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
  projects: [
    { name: 'storybook', testIgnore: /docs\.(visual|nav)\.spec\.ts|perf\.spec\.ts/ },
    // Interaction-latency budgets (perf.spec.ts); serial so its tests don't compete for CPU.
    { name: 'perf', testMatch: /perf\.spec\.ts/, fullyParallel: false },
    {
      name: 'docs',
      testMatch: /docs\.(visual|nav)\.spec\.ts/,
      use: { baseURL: 'http://localhost:6008', viewport: { width: 1280, height: 800 } },
    },
  ],
  webServer: [
    {
      command: 'node visual/serve.mjs',
      cwd: '..',
      url: 'http://localhost:6007/index.json',
      reuseExistingServer: !process.env.CI,
    },
    // Only when the docs export exists, so Storybook-only runs don't need a docs build.
    ...(existsSync(docsOut)
      ? [
          {
            command: 'node visual/serve.mjs',
            cwd: '..',
            env: { SERVE_ROOT: docsOut, PORT: '6008' },
            url: 'http://localhost:6008/index.html',
            reuseExistingServer: !process.env.CI,
          },
        ]
      : []),
  ],
});
