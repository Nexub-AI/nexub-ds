import { existsSync, readdirSync } from 'node:fs';
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

// 9.2: no theme flash. With every script bundle blocked, only the inline ThemeScript
// runs, so the stored choice must already be on <html> and painted before React loads.
// (Density is markup, not a stored choice, so it can't flash.)
const STORED = [
  { name: 'light', storage: { 'nexub-theme': 'light' }, attrs: { 'data-theme': 'light' }, scheme: 'dark' },
  { name: 'dark', storage: { 'nexub-theme': 'dark' }, attrs: { 'data-theme': 'dark' }, scheme: 'light' },
  { name: 'high contrast', storage: { 'nexub-theme': 'dark', 'nexub-contrast': 'high' }, attrs: { 'data-theme': 'dark', 'data-contrast': 'high' }, scheme: 'light' },
  { name: 'brand', storage: { 'nexub-theme': 'light', 'nexub-brand': 'payub' }, attrs: { 'data-theme': 'light', 'data-product': 'payub' }, scheme: 'light' },
] as const;

for (const s of STORED) {
  test(`no theme flash: ${s.name} applies before any bundle runs`, async ({ page }) => {
    // The OS asks for the other scheme, so a late theme would show the wrong one first.
    await page.emulateMedia({ colorScheme: s.scheme });
    await page.addInitScript((st) => {
      for (const [k, v] of Object.entries(st)) localStorage.setItem(k, v);
    }, s.storage);
    await page.route(/\/_next\/static\/.*\.js(\?|$)/, (r) => r.abort());
    await page.goto('/components/button');
    for (const [attr, value] of Object.entries(s.attrs)) {
      await expect(page.locator('html')).toHaveAttribute(attr, value);
    }
    // The page colour: the first opaque background of body or html.
    const bg = await page.evaluate(() =>
      [document.body, document.documentElement]
        .map((el) => getComputedStyle(el).backgroundColor)
        .find((c) => !/^rgba\(.*, 0\)$|transparent/.test(c)),
    );
    expect(bg, 'an opaque page background').toBeTruthy();
    const [r, g, b] = bg!.match(/[\d.]+/g)!.map(Number);
    expect((r + g + b) / 3 < 128, `page ${bg}`).toBe(s.attrs['data-theme'] === 'dark');
  });
}

// 9.2: CLS 0 on every docs page. Layout shifts (not caused by input) from load until
// fonts, images and client components settle. Pages come from the static export; /m (the
// Expo web showcase) and /frame are iframe documents, like the previews docs.a11y skips.
const out = new URL('../../../apps/docs/out/', import.meta.url);
const docsPages = existsSync(out)
  ? readdirSync(out, { recursive: true, encoding: 'utf8' })
      .filter((f) => f.endsWith('.html') && !/^(examples|_next|m|frame)\//.test(f) && !/404/.test(f))
      .map((f) => '/' + f.replace(/(^|\/)index\.html$/, '').replace(/\.html$/, ''))
  : [];

// `path` → highest CLS still allowed, and why. Shrink-only: a page that reaches 0 must
// leave the list. Each is a live preview whose component lays itself out after hydration.
const CLS_KNOWN: Record<string, number> = {
  '/components/resizable-panels': 0.005, // panel sizes come from the client layout pass
  '/components/combobox': 0.003, // cmdk renders its options only after mount
  '/components/tree-view': 0.001, // row indents measured on mount
  '/components/filter-builder': 0.0005, // field widths settle after hydration
  '/components/slider': 0.0005, // Radix positions the thumb on mount
};

test('CLS_KNOWN only lists docs pages', () => {
  expect(Object.keys(CLS_KNOWN).filter((p) => !docsPages.includes(p))).toEqual([]);
});

for (const path of docsPages) {
  test(`CLS 0: ${path}`, async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'layout-shift entries are Chromium-only');
    // Web fonts are blocked here, so the page stays in its metric-matched fallback. A font
    // that lands after first paint is the runner's timing, not the page's structure: on a
    // slow CI core it made random pages fail. Everything structural (placeholder swaps, late
    // content, images, components resizing after hydration) is still measured, the same on
    // any machine. The real-font case is the Lighthouse budget, with the fonts preloaded.
    await page.route(/\.woff2(\?|$)/, (r) => r.abort());
    await page.addInitScript(() => {
      const w = window as unknown as { __cls: number; __moved: string[] };
      w.__cls = 0;
      w.__moved = []; // what moved, for the failure message: a random-page failure is a shared element
      new PerformanceObserver((list) => {
        for (const e of list.getEntries() as unknown as { value: number; hadRecentInput: boolean; sources: { node: Node | null }[] }[]) {
          if (e.hadRecentInput) continue;
          w.__cls += e.value;
          for (const { node } of e.sources) {
            const el = node instanceof Element ? node : node?.parentElement;
            w.__moved.push(el ? `<${el.tagName.toLowerCase()} class="${el.className}">`.slice(0, 120) : 'removed node');
          }
        }
      }).observe({ type: 'layout-shift', buffered: true });
    });
    await page.goto(path);
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    const cls = await page.evaluate(() => (window as unknown as { __cls: number }).__cls);
    if (path in CLS_KNOWN) {
      expect(cls, 'fixed: remove it from CLS_KNOWN').toBeGreaterThan(0);
      expect(cls).toBeLessThanOrEqual(CLS_KNOWN[path]);
    } else expect(cls, `moved: ${(await page.evaluate(() => (window as unknown as { __moved: string[] }).__moved)).join(', ')}`).toBe(0);
  });
}
