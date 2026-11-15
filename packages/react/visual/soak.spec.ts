import { expect, test } from '@playwright/test';

// 9.5 soak (project "soak"): one docs tab, used like a long session. It navigates client-side,
// opens and closes the search overlay and switches theme, over and over, for SOAK_MINUTES.
// It must log no error, never reload, and end with the heap, DOM node and listener counts
// it settled at: growth across the run is a leak a five-second test can't see.
// CI runs 1 minute on every PR (so the spec can't rot) and 30 minutes nightly (soak.yml).
const MINUTES = Number(process.env.SOAK_MINUTES ?? 1);
const ROUTES = [
  '/components/dialog',
  '/components/data-table',
  '/components/command-palette',
  '/components/date-picker',
  '/patterns/stat-card',
  '/foundations/motion',
  '/foundations/colors',
  '/getting-started/react-native',
];
// Allowed growth from the settled level to the end: a ratio plus a floor for GC and cache noise.
const LIMITS = { heap: [1.15, 3_000_000], nodes: [1.1, 300], listeners: [1.1, 60] } as const;

const median = (xs: number[]) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)]!;

test(`docs: ${MINUTES} min of navigation, overlays and theme switches`, async ({ page }) => {
  test.setTimeout((MINUTES + 3) * 60_000);
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`console: ${m.text()}`);
  });
  const cdp = await page.context().newCDPSession(page);
  const sample = async () => {
    await cdp.send('HeapProfiler.collectGarbage');
    const { usedSize } = await cdp.send('Runtime.getHeapUsage');
    const { nodes, jsEventListeners } = await cdp.send('Memory.getDOMCounters');
    return { heap: usedSize, nodes, listeners: jsEventListeners };
  };

  await page.goto(ROUTES[0]!);
  // Mark the document: a reload (a crash recovered by a full navigation) would drop it.
  await page.evaluate(() => ((window as unknown as { __soak: number }).__soak = 1));
  const sidebar = page.getByRole('complementary', { name: 'Documentation navigation' });
  const search = page.getByRole('dialog', { name: 'Search the docs' });
  const samples: Awaited<ReturnType<typeof sample>>[] = [];
  const end = Date.now() + MINUTES * 60_000;
  let steps = 0;

  while (Date.now() < end) {
    for (const href of ROUTES) {
      const link = sidebar.locator(`a[href="${href}"]`);
      // Collapsed sections don't render their links; open them all.
      while ((await link.count()) === 0) {
        const closed = sidebar.locator('[aria-expanded="false"]');
        if ((await closed.count()) === 0) break;
        await closed.first().click();
      }
      await link.click();
      await expect(page).toHaveURL(href);
      await expect(page.locator('main h1')).toBeVisible();

      await page.getByRole('button', { name: 'Search', exact: true }).click();
      await expect(search).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(search).toBeHidden();

      await page.getByRole('radiogroup', { name: 'Theme' }).getByTitle(steps++ % 2 ? 'Light' : 'Dark').click();
      samples.push(await sample());
    }
  }

  expect(await page.evaluate(() => (window as unknown as { __soak?: number }).__soak), 'the document was reloaded').toBe(1);
  expect(errors).toEqual([]);
  // The first quarter is warm-up (route chunks, caches); the second is the settled level.
  const q = Math.floor(samples.length / 4);
  expect(q, 'too few samples to judge').toBeGreaterThanOrEqual(2);
  for (const key of ['heap', 'nodes', 'listeners'] as const) {
    const settled = median(samples.slice(q, 2 * q).map((s) => s[key]));
    const final = median(samples.slice(-q).map((s) => s[key]));
    const [ratio, floor] = LIMITS[key];
    expect(final, `${key}: settled at ${settled}, ended at ${final} after ${samples.length} steps`).toBeLessThanOrEqual(settled * ratio + floor);
  }
});
