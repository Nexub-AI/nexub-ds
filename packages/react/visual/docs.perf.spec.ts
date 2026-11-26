import { expect, test, type Page } from '@playwright/test';

// 12.1 gate: INP under 200 ms on the 3 heaviest page templates (ROADMAP_12.x.md). "Heaviest"
// by rendered size: the template frames with the most elements (dashboard 314, team 233,
// sign-up 207 in the 12.1 export; every frame loads the same JavaScript). Same method as
// perf.spec.ts: the slowest 'event' entry (durationThreshold 16) while a user types in the
// first text field and clicks the first enabled button. CI is not CPU-throttled, so this is a
// tripwire for regressions, not lab INP; mobile Lighthouse covers the throttled load.
const INP_MS = 200;
const PAGES = ['dashboard', 'team', 'sign-up'];

async function measure(page: Page, interact: () => Promise<void>) {
  await page.evaluate(() => {
    const w = window as unknown as { __inp: number };
    w.__inp = 0;
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) w.__inp = Math.max(w.__inp, e.duration);
    }).observe({ type: 'event', durationThreshold: 16 } as PerformanceObserverInit);
  });
  await interact();
  // Event entries are reported after the next paint; let deferred renders settle too.
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => setTimeout(r, 500))));
  const inp = await page.evaluate(() => (window as unknown as { __inp: number }).__inp);
  test.info().annotations.push({ type: 'perf', description: `inp ${inp}ms` });
  return inp;
}

for (const slug of PAGES) {
  test(`INP < ${INP_MS} ms: /frame/${slug}`, async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'event timing entries are Chromium-only');
    await page.goto(`/frame/${slug}`);
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts.ready);
    const field = page.getByRole('textbox').first();
    const button = page.locator('button:not([disabled]):visible').first();
    const inp = await measure(page, async () => {
      if (await field.count()) {
        await field.click();
        await field.pressSequentially('Avery Chen', { delay: 50 });
      }
      if (await button.count()) await button.click();
    });
    expect(inp, 'slowest interaction (ms)').toBeLessThan(INP_MS);
  });
}
