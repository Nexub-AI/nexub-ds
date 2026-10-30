import { expect, test } from '@playwright/test';

// Docs navigation over the static export (project "docs"): sidebar links must
// navigate client-side, and a page view must not prefetch the whole site.
// On Cloudflare every non-asset request used to run the Pages Function, and
// prefetching all ~110 routes on load cost ~180 requests per page view.

const sameOrigin = (url: string) => new URL(url).port === '6008';
const isAsset = (url: string) => new URL(url).pathname.startsWith('/_next/');

test('a page view stays under 40 non-asset requests', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (r) => {
    if (sameOrigin(r.url()) && !isAsset(r.url())) requests.push(r.url());
  });
  await page.goto('/components/button');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500); // idle-time prefetches would land here
  expect(requests.length, requests.join('\n')).toBeLessThan(40);
});

test('sidebar links navigate client-side', async ({ page }) => {
  await page.goto('/components/button');
  const sidebar = page.getByRole('complementary', { name: 'Documentation navigation' });
  // Mark the document: a full reload would drop the marker.
  await page.evaluate(() => ((window as unknown as { __nav: number }).__nav = 1));

  for (const href of [
    '/components/split-button',
    '/components/dialog',
    '/patterns/stat-card',
    '/foundations/motion',
    '/getting-started/react-native',
  ]) {
    const link = sidebar.locator(`a[href="${href}"]`);
    // Collapsed sections don't render their links; open them all.
    while ((await link.count()) === 0) {
      const closed = sidebar.locator('[aria-expanded="false"]');
      if ((await closed.count()) === 0) break;
      await closed.first().click();
    }
    await link.click();
    await expect(page).toHaveURL(href, { timeout: 5000 });
    await expect(page.locator('main h1')).toBeVisible();
    expect(await page.evaluate(() => (window as unknown as { __nav?: number }).__nav)).toBe(1);
  }
});
