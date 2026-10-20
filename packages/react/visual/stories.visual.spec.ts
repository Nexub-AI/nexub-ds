import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

// One screenshot per story × variant. Story list comes from the built Storybook.
const index = JSON.parse(
  readFileSync(new URL('../storybook-static/index.json', import.meta.url), 'utf8'),
) as { entries: Record<string, { id: string; type: string }> };
const stories = Object.values(index.entries).filter((e) => e.type === 'story');

// ponytail: one brand covers the accent remap; add the other three if brand CSS diverges.
const variants = [
  { name: 'light', theme: 'light', brand: 'none' },
  { name: 'dark', theme: 'dark', brand: 'none' },
  { name: 'payub', theme: 'light', brand: 'payub' },
];

test.beforeEach(async ({ page }) => {
  // Freeze time and randomness so date pickers and generated data render identically.
  await page.clock.setFixedTime(new Date('2026-01-15T10:00:00Z'));
  await page.addInitScript(() => {
    let seed = 42;
    Math.random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  });
});

for (const { id } of stories) {
  for (const v of variants) {
    test(`${id} ${v.name}`, async ({ page }) => {
      await page.goto(`/iframe.html?id=${id}&viewMode=story&globals=theme:${v.theme};brand:${v.brand}`);
      await page.waitForFunction(() =>
        ['sb-show-main', 'sb-show-errordisplay', 'sb-show-nopreview'].some((c) =>
          document.body.classList.contains(c),
        ),
      );
      const error = await page.locator('#error-message').textContent().catch(() => '');
      expect(await page.evaluate(() => document.body.classList.contains('sb-show-main')), error ?? '').toBe(true);
      // URL globals can apply after the first render; wait for the decorator to set them.
      // A story that pins its own globals (e.g. `globals: { theme: 'dark' }`) never
      // matches the other variants — skip those; its own variant still covers it.
      const applied = await page
        .waitForFunction(
          ([t, b]) =>
            document.documentElement.dataset.theme === t &&
            (document.documentElement.dataset.product ?? 'none') === b,
          [v.theme, v.brand],
          { timeout: 3000 },
        )
        .then(() => true, () => false);
      test.skip(!applied, 'story pins its own theme/brand globals');
      await page.evaluate(() => document.fonts.ready);
      await expect(page).toHaveScreenshot(`${id}--${v.name}.png`, { fullPage: true });
    });
  }
}
