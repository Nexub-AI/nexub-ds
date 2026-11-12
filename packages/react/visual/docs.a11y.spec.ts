import { createRequire } from 'node:module';
import { expect, test } from '@playwright/test';

// 8.8: the docs site's own accessibility, over the static export (project "docs").
// axe (WCAG 2.2 A/AA, colour contrast included) on one page of each kind, in light and
// dark, so the code surface, tables, previews and nav are checked in both themes; then
// the keyboard paths every page shares: skip link, "On this page" and search.
const axePath = createRequire(import.meta.url).resolve('axe-core');
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

const PAGES = [
  '/',
  '/getting-started/react-native',
  '/foundations/colors',
  '/components/button',
  '/components/data-table',
  '/patterns/stat-card',
  '/changelog',
];

// `path theme` → rule ids that fail today. Shrink-only, like a11y.visual.spec.ts.
const KNOWN: Record<string, string[]> = {};

for (const path of PAGES) {
  for (const theme of ['light', 'dark'] as const) {
    test(`docs a11y ${path} ${theme}`, async ({ page }) => {
      await page.addInitScript((t) => localStorage.setItem('nexub-theme', t), theme);
      await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
      await page.goto(path);
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      await page.waitForLoadState('networkidle');
      await page.evaluate(() => document.fonts.ready);
      // Scroll regions get their tab stop from a ResizeObserver, which fires a frame after
      // layout; slower engines (WebKit in CI) ran axe in between.
      await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
      await page.addScriptTag({ path: axePath });
      const violations = await page.evaluate(async (tags) => {
        // Live previews are separate documents (iframes) with their own checks in Storybook.
        // @ts-expect-error injected global
        const r = await window.axe.run({ exclude: [['iframe']] }, { runOnly: { type: 'tag', values: tags } });
        return (r.violations as { id: string; nodes: { target: string[] }[] }[]).map((v) => ({
          id: v.id,
          targets: v.nodes.slice(0, 3).map((n) => n.target.join(' ')),
        }));
      }, TAGS);
      expect(
        violations.map((v) => v.id).sort(),
        JSON.stringify(violations, null, 2),
      ).toEqual(KNOWN[`${path} ${theme}`] ?? []);
    });
  }
}

test('skip link is the first stop and moves focus to the content', async ({ page }) => {
  await page.goto('/components/button');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main-content$/);
  // The next Tab lands inside the content, not back in the header.
  await page.keyboard.press('Tab');
  expect(await page.evaluate(() => !!document.activeElement?.closest('#main-content'))).toBe(true);
});

test('"On this page" links go to headings that exist', async ({ page }) => {
  await page.goto('/components/button');
  const toc = page.getByRole('navigation', { name: 'On this page' });
  const hrefs = await toc.getByRole('link').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
  expect(hrefs.length).toBeGreaterThan(2);
  for (const href of hrefs) await expect(page.locator(href!)).toHaveCount(1);
  await toc.locator(`a[href="${hrefs[1]}"]`).click();
  await expect(page).toHaveURL(new RegExp(`${hrefs[1]}$`));
  await expect(page.locator(hrefs[1]!)).toBeInViewport();
});

test('search opens from the keyboard, is labelled, and Escape returns focus', async ({ page }) => {
  await page.goto('/components/button');
  await page.waitForLoadState('networkidle'); // the palette is a lazy chunk
  const trigger = page.getByRole('button', { name: 'Search', exact: true });
  await trigger.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAccessibleName(/.+/);
  await page.keyboard.type('button');
  await expect(dialog.getByRole('option').first()).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});
