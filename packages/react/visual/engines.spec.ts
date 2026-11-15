import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

// 9.1: every story renders in WebKit and Firefox (projects "webkit" and "firefox") with no
// uncaught error, and the stories whose CSS differs most between engines (glass and
// backdrop-filter, shared-element view transitions, the control and surface overviews)
// keep a screenshot per engine. Chromium's per-story baselines stay in stories.visual.spec.ts.
const index = JSON.parse(
  readFileSync(new URL('../storybook-static/index.json', import.meta.url), 'utf8'),
) as { entries: Record<string, { id: string; type: string }> };
const stories = Object.values(index.entries).filter((e) => e.type === 'story');
const SHOTS = /glass|shared-?element|foundations-core-controls--states|foundations-surfaces--cards/;

test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-01-15T10:00:00Z'));
  await page.addInitScript(() => {
    let seed = 42;
    Math.random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  });
});

for (const { id } of stories) {
  test(`${id} renders`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(`/iframe.html?id=${id}&viewMode=story&globals=theme:light`);
    await page.waitForFunction(() =>
      ['sb-show-main', 'sb-show-errordisplay', 'sb-show-nopreview'].some((c) =>
        document.body.classList.contains(c),
      ),
    );
    const error = await page.locator('#error-message').textContent().catch(() => '');
    expect(await page.evaluate(() => document.body.classList.contains('sb-show-main')), error ?? '').toBe(true);
    await page.evaluate(() => document.fonts.ready);
    expect(errors).toEqual([]);
    if (SHOTS.test(id)) {
      await expect(page).toHaveScreenshot(`${id}.png`, {
        fullPage: true,
        ...(/glass/.test(id) && { threshold: 0.05 }),
      });
    }
  });
}
