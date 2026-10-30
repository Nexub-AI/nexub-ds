import { expect, test } from '@playwright/test';

// Full-page screenshots of the docs foundation pages, served from the static export
// (apps/docs/out — run `pnpm --filter @nexub/docs build` first). Project "docs" in
// playwright.config.ts. These pages are static; the only moving parts are masked below.
const pages = [
  '/foundations/principles',
  '/foundations/colors',
  '/foundations/typography',
  '/foundations/shadows',
  '/foundations/motion',
  '/foundations/materials',
  '/getting-started/ai-surfaces',
];

for (const path of pages) {
  for (const theme of ['light', 'dark'] as const) {
    test(`${path} ${theme}`, async ({ page }) => {
      await page.clock.setFixedTime(new Date('2026-01-15T10:00:00Z'));
      // ThemeScript / ThemeProvider read the docs' storage key before first paint.
      await page.addInitScript((t) => localStorage.setItem('nexub-theme', t), theme);
      await page.emulateMedia({ colorScheme: theme });
      await page.goto(path);
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      await page.evaluate(() => document.fonts.ready);
      // Client components (live previews, measured motion wrappers) settle after load.
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(400);
      await expect(page).toHaveScreenshot(`docs${path.replaceAll('/', '-')}--${theme}.png`, {
        fullPage: true,
        // Version badge and footer year change every release / year, not with the page.
        // Live previews (phone frames) load on their own schedule.
        mask: [page.locator('header').getByText(/^v\d+\.\d+\.\d+/), page.locator('footer'), page.locator('[data-live-preview]')],
      });
    });
  }
}
