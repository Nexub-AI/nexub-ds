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

for (const { id, target } of STATES) {
  test(`${id} states`, async ({ page }) => {
    await open(page, id);
    const el = page.locator(`#storybook-root ${target}`).first();
    const root = page.locator('#storybook-root');

    await el.hover();
    await expect(root).toHaveScreenshot(`${id}--hover.png`);

    await page.mouse.move(0, 0);
    // Keyboard focus, so :focus-visible matches.
    await el.evaluate((node: HTMLElement) => node.blur());
    await el.focus();
    await expect(root).toHaveScreenshot(`${id}--focus.png`);

    await el.hover();
    await page.mouse.down();
    await expect(root).toHaveScreenshot(`${id}--pressed.png`);
    await page.mouse.up();
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
