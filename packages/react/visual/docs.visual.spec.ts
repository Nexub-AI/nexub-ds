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
      // A full-page capture resizes the viewport and lays out every off-screen line,
      // which can reflow the page once (late font fallback). Do that first, untimed,
      // so the shots compared below are all taken after it.
      await page.screenshot({ fullPage: true, animations: 'disabled' });
      // Wait until the page height holds for 3 polls: a full-page shot taken mid-settle
      // comes out a different height and fails (seen on /foundations/motion).
      await page.waitForFunction(
        () =>
          new Promise<boolean>((done) => {
            let last = -1;
            let same = 0;
            const t = setInterval(() => {
              const h = document.documentElement.scrollHeight;
              same = h === last ? same + 1 : 0;
              last = h;
              if (same >= 3) {
                clearInterval(t);
                done(true);
              }
            }, 150);
          }),
      );
      // Sticky in-page bars (the motion gallery's controls, ~105px: the size of the
      // CI height flip) sit wherever the scroll position and the capture-time viewport
      // put them. Pin them in normal flow: same pixels at scroll 0, no dependence.
      await page.addStyleTag({ content: 'main .sticky { position: static !important; }' });
      await expect(page).toHaveScreenshot(`docs${path.replaceAll('/', '-')}--${theme}.png`, {
        fullPage: true,
        // Version badge and footer year change every release / year, not with the page.
        // Live previews (phone frames) load on their own schedule.
        mask: [page.locator('header').getByText(/^v\d+\.\d+\.\d+/), page.locator('footer'), page.locator('[data-live-preview]')],
      });
    });
  }
}

// 8.1 type map guard: one computed size per heading level, and every code block
// at the code size, on a spread of pages in both themes (D1–D3 regressions).
const TYPE_PAGES = [
  '/getting-started/nextjs',
  '/getting-started/ai-tools',
  '/components/button',
  '/foundations/colors',
  '/foundations/materials',
  '/foundations/typography',
];
for (const path of TYPE_PAGES) {
  for (const theme of ['light', 'dark'] as const) {
    test(`type map ${path} ${theme}`, async ({ page }) => {
      await page.addInitScript((t) => localStorage.setItem('nexub-theme', t), theme);
      await page.emulateMedia({ colorScheme: theme });
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      const sizes = await page.evaluate(() => {
        const of = (sel: string) => [...new Set([...document.querySelectorAll(sel)].map((el) => getComputedStyle(el).fontSize))];
        return {
          h2: of('main .docs-h2, main .docs-prose h2:not([class])'),
          h3: of('main .docs-h3, main .docs-prose h3:not([class])'),
          code: of('main .docs-code pre'),
        };
      });
      expect(sizes.h2.length, `h2 sizes ${sizes.h2}`).toBeLessThanOrEqual(1);
      expect(sizes.h3.length, `h3 sizes ${sizes.h3}`).toBeLessThanOrEqual(1);
      expect(sizes.code.every((s) => s === '13px'), `code sizes ${sizes.code}`).toBe(true);
    });
  }
}
