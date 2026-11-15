import { expect, test, type Page } from '@playwright/test';

// Interaction states and display modes the per-story suite can't see
// (ENHANCEMENTS_PLAN.md B3). Light theme; one target per story.
const STATES: { id: string; target: string }[] = [
  { id: 'components-button--default', target: 'button' },
  { id: 'components-iconbutton--default', target: 'button' },
  { id: 'components-card--interactive', target: '[data-card-link]' },
  { id: 'components-filterchip--default', target: 'button' },
  { id: 'components-switch--default', target: '[role="switch"]' },
  { id: 'components-checkbox--default', target: '[role="checkbox"]' },
  { id: 'components-input--default', target: 'input' },
  { id: 'components-link--default', target: 'a' },
  { id: 'components-segmentedcontrol--default', target: '[role="radio"]' },
  { id: 'components-radiocard--plan-picker', target: '[role="radio"]' },
];

const MODES = [
  { name: 'high-contrast', globals: 'contrast:high' },
  { name: 'dark-high-contrast', globals: 'theme:dark;contrast:high' },
  { name: 'compact', globals: 'density:compact' },
  { name: 'rtl', globals: 'dir:rtl' },
];
const OVERVIEWS = ['foundations-core-controls--states', 'foundations-surfaces--cards'];

async function open(page: Page, id: string, globals = 'theme:light') {
  await page.goto(`/iframe.html?id=${id}&viewMode=story&globals=${globals}`);
  await page.waitForFunction(() => document.body.classList.contains('sb-show-main'));
  await page.evaluate(() => document.fonts.ready);
}

// Soft: one run reports hover, focus and pressed together (re-baselines in one pass).
for (const { id, target } of STATES) {
  test(`${id} states`, async ({ page }) => {
    await open(page, id);
    const el = page.locator(`#storybook-root ${target}`).first();
    const root = page.locator('#storybook-root');

    await el.hover();
    await expect.soft(root).toHaveScreenshot(`${id}--hover.png`);

    await page.mouse.move(0, 0);
    // Keyboard focus, so :focus-visible matches.
    await el.evaluate((node: HTMLElement) => node.blur());
    await el.focus();
    await expect.soft(root).toHaveScreenshot(`${id}--focus.png`);

    await el.hover();
    await page.mouse.down();
    await expect.soft(root).toHaveScreenshot(`${id}--pressed.png`);
    await page.mouse.up();
  });
}

// Tokens are rem by default (3.0). Under a 20px browser default text, spacing
// and control heights should grow together without clipping.
for (const id of OVERVIEWS) {
  test(`${id} rem at 20px root`, async ({ page }) => {
    await open(page, id);
    await page.addStyleTag({ content: 'html { font-size: 20px; }' });
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveScreenshot(`${id}--rem-20.png`, { fullPage: true });
  });
}

for (const id of OVERVIEWS) {
  for (const m of MODES) {
    test(`${id} ${m.name}`, async ({ page }) => {
      await open(page, id, `theme:light;${m.globals}`);
      await expect(page).toHaveScreenshot(`${id}--${m.name}.png`, { fullPage: true });
    });
  }
}

// 9.2: images and skeleton swaps reserve their space. Each story loads, its images decode
// and its skeletons resolve; nothing may move (CLS, excluding input) along the way.
const NO_SHIFT = [
  'components-avatar--default',
  'components-avatar--with-status',
  'components-avatargroup--default',
  'components-mediacard--default',
  'components-mediacard--linked',
  'components-mediacard--with-actions',
  'components-mediacard--ratios',
  'components-mediacard--image-only',
  'components-motion--skeleton-to-content',
  'components-skeleton--default',
  'components-skeleton--text',
];

for (const id of NO_SHIFT) {
  test(`${id} has no layout shift`, async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'layout-shift entries are Chromium-only');
    // Images arrive late on purpose, after measuring starts (the Storybook preview's own
    // font swap is excluded: counting begins once fonts are ready).
    await page.route(/\.(png|jpe?g|webp|avif|gif|svg)(\?|$)/, async (r) => {
      await new Promise((res) => setTimeout(res, 300));
      await r.continue();
    });
    await page.addInitScript(() => {
      const w = window as unknown as { __cls: number; __on: boolean };
      w.__cls = 0;
      w.__on = false;
      new PerformanceObserver((list) => {
        for (const e of list.getEntries() as unknown as { value: number; hadRecentInput: boolean }[]) {
          if (w.__on && !e.hadRecentInput) w.__cls += e.value;
        }
      }).observe({ type: 'layout-shift', buffered: true });
    });
    await open(page, id);
    // Load every font face now, so text that appears later (bold, after the swap) can't
    // trigger a font swap inside the measured window.
    await page.evaluate(() => Promise.all([...document.fonts].map((f) => f.load().catch(() => {}))));
    await page.evaluate(() => ((window as unknown as { __on: boolean }).__on = true));
    // The swap story finishes loading on a button; a script click isn't user input,
    // so a shift it causes still counts.
    if (/skeleton-to-content/.test(id)) {
      await page.locator('#storybook-root button').first().waitFor();
      await page.evaluate(() => (document.querySelector('#storybook-root button') as HTMLElement).click());
    }
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => Promise.all([...document.images].map((i) => i.decode().catch(() => {}))));
    await page.waitForTimeout(1000);
    expect(await page.evaluate(() => (window as unknown as { __cls: number }).__cls)).toBe(0);
  });
}
