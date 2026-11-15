import { expect, test, type Page } from '@playwright/test';

// 9.3: the interaction contract every overlay keeps, in a real browser (and in WebKit and
// Firefox through the engine projects): keyboard, pointer and touch all open it, focus goes
// in and comes back, rapid and double activation end in one consistent state, and a modal's
// scroll lock doesn't move the page under it.
const OVERLAYS = [
  { id: 'overlays-dialog--default', role: 'dialog', modal: true },
  { id: 'overlays-alertdialog--default', role: 'alertdialog', modal: true },
  { id: 'components-drawer--default', role: 'dialog', modal: true },
  { id: 'overlays-popover--default', role: 'dialog', modal: false },
  { id: 'navigation-dropdownmenu--default', role: 'menu', modal: false },
  { id: 'navigation-menubar--default', role: 'menu', modal: false },
  { id: 'components-select--default', role: 'listbox', modal: false },
  { id: 'forms-datepicker--default', role: 'dialog', modal: false },
  { id: 'components-datetimepicker--default', role: 'dialog', modal: false },
] as const;

async function open(page: Page, id: string) {
  await page.goto(`/iframe.html?id=${id}&viewMode=story&globals=theme:light`);
  await page.waitForFunction(() => document.body.classList.contains('sb-show-main'));
  const trigger = page.locator('#storybook-root').locator('button, [role=combobox]').first();
  await trigger.waitFor();
  return trigger;
}

for (const { id, role, modal } of OVERLAYS) {
  test.describe(id, () => {
    test('keyboard: opens, focus goes in, Escape closes, focus comes back', async ({ page }) => {
      const trigger = await open(page, id);
      const overlay = page.getByRole(role);
      await trigger.focus();
      await page.keyboard.press('Enter');
      await expect(overlay).toBeVisible();
      await expect.poll(() => overlay.evaluate((el) => el.contains(document.activeElement))).toBe(true);
      await page.keyboard.press('Escape');
      await expect(overlay).toBeHidden();
      await expect(trigger).toBeFocused();
    });

    test('rapid open and close ends closed, and it still opens after', async ({ page }) => {
      const trigger = await open(page, id);
      const overlay = page.getByRole(role);
      await trigger.focus();
      // No waiting between keys: each lands mid-animation of the one before.
      for (let i = 0; i < 4; i++) {
        await page.keyboard.press('Enter');
        await page.keyboard.press('Escape');
      }
      await expect(overlay).toBeHidden();
      await expect(page.locator(`[role=${role}]`)).toHaveCount(0);
      await trigger.focus();
      await page.keyboard.press('Enter');
      await expect(overlay).toBeVisible();
    });

    test('double-click leaves one consistent state', async ({ page }) => {
      const trigger = await open(page, id);
      // A modal's scrim takes the second click; force it at the same point either way.
      await trigger.dblclick({ force: true });
      // Settled means: at most one overlay, and aria-expanded (where the trigger has it)
      // agrees with what is on screen. Poll, since exit animations run long on slow runners.
      await expect
        .poll(async () => {
          const count = await page.locator(`[role=${role}]`).count();
          const expanded = await trigger.getAttribute('aria-expanded');
          return count <= 1 && (expanded === null || expanded === String(count === 1));
        })
        .toBe(true);
    });

    test('pointer opens it', async ({ page }) => {
      const trigger = await open(page, id);
      await trigger.click();
      await expect(page.getByRole(role)).toBeVisible();
    });

    if (modal) {
      test('scroll lock does not move the page', async ({ page }) => {
        const trigger = await open(page, id);
        // Make the story page scroll, so the lock has a scrollbar to remove.
        await page.addStyleTag({ content: 'body { min-height: 200vh; }' });
        const x = () => trigger.evaluate((el) => el.getBoundingClientRect().x);
        const before = await x();
        await trigger.click();
        await expect(page.getByRole(role)).toBeVisible();
        expect(await x()).toBe(before);
        await page.keyboard.press('Escape');
        await expect(page.getByRole(role)).toBeHidden();
        expect(await x()).toBe(before);
      });
    }
  });
}

test.describe('touch', () => {
  test.use({ hasTouch: true });
  for (const { id, role } of OVERLAYS) {
    test(`${id}: a tap opens it`, async ({ page }) => {
      const trigger = await open(page, id);
      await trigger.tap();
      await expect(page.getByRole(role)).toBeVisible();
    });
  }
});
