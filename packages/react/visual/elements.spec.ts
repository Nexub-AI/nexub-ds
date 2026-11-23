import { createRequire } from 'node:module';
import { expect, test, type Page } from '@playwright/test';

// 11.6: @nexub/elements in real engines (project "storybook" for Chromium, and the "webkit" and
// "firefox" engine projects). jsdom has no form-associated custom elements, so this is where the
// form side is checked: FormData, reset, constraint validation, <label for>, fieldset disabled;
// plus the keyboard maps, the calendar dialog and its bottom sheet, and axe in every engine.
// Stories: packages/elements/stories/*.stories.tsx.
const NUMBER = 'components-numberinputelement';
const DATE = 'components-datepickerelement';
const FORM = 'components-elements--form';
const axePath = createRequire(import.meta.url).resolve('axe-core');

async function open(page: Page, id: string, theme = 'light') {
  await page.goto(`/iframe.html?id=${id}&viewMode=story&globals=theme:${theme}`);
  await page.waitForFunction(() => document.body.classList.contains('sb-show-main'));
  await page.locator('#storybook-root :is(nx-number-input, nx-date-picker)').first().waitFor();
}

/** The focused element, through shadow roots: a grid cell's `data-value`, else its tag. */
const focused = (page: Page) =>
  page.evaluate(() => {
    let a = document.activeElement;
    while (a?.shadowRoot?.activeElement) a = a.shadowRoot.activeElement;
    return (a as HTMLElement | null)?.dataset.value ?? a?.localName ?? null;
  });
/** The host's `value` property. */
const valueOf = (page: Page, selector: string) => page.locator(selector).evaluate((el) => (el as HTMLInputElement).value);

test.beforeEach(async ({ page }) => {
  // "Today" decides where an empty date picker opens; freeze it.
  await page.clock.setFixedTime(new Date('2026-03-10T10:00:00Z'));
});

test.describe('form', () => {
  test('submit posts both values through FormData', async ({ page }) => {
    await open(page, FORM);
    await page.getByRole('spinbutton', { name: 'Age' }).pressSequentially('30');
    await page.getByRole('button', { name: 'Pick a date' }).click();
    await expect(page.getByRole('dialog', { name: 'Pick a date' })).toBeVisible();
    expect(await focused(page)).toBe('2026-03-10');
    await page.keyboard.press('Enter');
    await page.getByRole('button', { name: 'Send' }).click();
    await expect(page.getByTestId('result')).toHaveText(JSON.stringify({ age: '30', start: '2026-03-10', month: '2026-11', seats: '2' }));
    // The same through the API, without the story's handler.
    const data = await page.getByTestId('form').evaluate((f) => Object.fromEntries(new FormData(f as HTMLFormElement)));
    expect(data).toEqual({ age: '30', start: '2026-03-10', month: '2026-11', seats: '2' });
  });

  test('form.reset() goes back to the value attribute', async ({ page }) => {
    await open(page, FORM);
    await expect(page.locator('#month')).toHaveAttribute('value', '2026-11');
    await expect(page.locator('#seats')).toHaveAttribute('value', '2');
    await page.getByRole('spinbutton', { name: 'Age' }).pressSequentially('44');
    await page.getByRole('spinbutton', { name: 'Seats' }).press('ArrowUp');
    await page.getByRole('button', { name: 'Pick a month' }).click();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Enter');
    expect([await valueOf(page, '#age'), await valueOf(page, '#seats'), await valueOf(page, '#month')]).toEqual(['44', '3', '2026-12']);

    await page.getByTestId('form').evaluate((f) => (f as HTMLFormElement).reset());
    expect([await valueOf(page, '#age'), await valueOf(page, '#seats'), await valueOf(page, '#month')]).toEqual(['', '2', '2026-11']);
    await expect(page.getByRole('spinbutton', { name: 'Seats' })).toHaveValue('2');
    await expect(page.getByRole('spinbutton', { name: 'Age' })).toHaveValue('');
    await expect(page.getByRole('textbox', { name: 'Billing month' })).not.toHaveValue('');
    // The reset button does the same.
    await page.getByRole('spinbutton', { name: 'Seats' }).press('ArrowUp');
    await page.getByRole('button', { name: 'Reset' }).click();
    expect(await valueOf(page, '#seats')).toBe('2');
  });

  test('required and empty blocks submit; checkValidity() is false', async ({ page }) => {
    await open(page, FORM);
    const form = page.getByTestId('form');
    expect(await form.evaluate((f) => (f as HTMLFormElement).checkValidity())).toBe(false);
    expect(await page.locator('#age').evaluate((el) => [(el as HTMLInputElement).checkValidity(), (el as HTMLInputElement).validity.valueMissing])).toEqual([false, true]);
    expect(await page.locator('#start').evaluate((el) => (el as HTMLInputElement).validity.valueMissing)).toBe(true);
    // :invalid matches the host, as on a native field.
    expect(await page.locator('#age').evaluate((el) => el.matches(':invalid'))).toBe(true);

    await page.getByRole('button', { name: 'Send' }).click();
    await expect(page.getByTestId('result')).toHaveText('');
    // The failed submit shows the invalid state.
    await expect(page.getByRole('spinbutton', { name: 'Age' })).toHaveAttribute('aria-invalid', 'true');
    await expect(page.getByRole('spinbutton', { name: 'Age' })).toHaveAttribute('aria-required', 'true');

    // Filled in, it submits.
    await page.getByRole('spinbutton', { name: 'Age' }).pressSequentially('30');
    await page.getByRole('button', { name: 'Pick a date' }).click();
    await page.keyboard.press('Enter');
    expect(await form.evaluate((f) => (f as HTMLFormElement).checkValidity())).toBe(true);
    await page.getByRole('button', { name: 'Send' }).click();
    await expect(page.getByTestId('result')).not.toHaveText('');
  });

  test('<label for> focuses the inner control and names it', async ({ page }) => {
    await open(page, FORM);
    await expect(page.getByRole('spinbutton', { name: 'Age', exact: true })).toHaveCount(1);
    await expect(page.getByRole('textbox', { name: 'Start date', exact: true })).toHaveCount(1);
    await expect(page.getByRole('spinbutton', { name: 'Age' })).toHaveAccessibleName('Age');

    await page.locator('label[for="age"]').click();
    await expect(page.getByRole('spinbutton', { name: 'Age' })).toBeFocused();
    expect(await focused(page)).toBe('input');
    await page.locator('label[for="start"]').click();
    await expect(page.getByRole('textbox', { name: 'Start date' })).toBeFocused();
    // The label reaches the element through ElementInternals.
    expect(await page.locator('#start').evaluate((el) => (el as HTMLInputElement).labels?.length)).toBe(1);
  });

  test('a disabled fieldset disables them and leaves them out of FormData', async ({ page }) => {
    await open(page, FORM);
    const seats = page.getByRole('spinbutton', { name: 'Seats' });
    await expect(seats).toBeEnabled();
    await page.getByTestId('extra').evaluate((f) => ((f as HTMLFieldSetElement).disabled = true));
    await expect(seats).toBeDisabled();
    expect(await page.locator('#seats').evaluate((el) => el.matches(':disabled'))).toBe(true);
    expect(await page.getByTestId('form').evaluate((f) => new FormData(f as HTMLFormElement).has('seats'))).toBe(false);
    await page.getByTestId('extra').evaluate((f) => ((f as HTMLFieldSetElement).disabled = false));
    await expect(seats).toBeEnabled();
    expect(await page.getByTestId('form').evaluate((f) => new FormData(f as HTMLFormElement).get('seats'))).toBe('2');
  });
});

test.describe('nx-number-input', () => {
  test('min and max apply on blur; a half-typed "2." stays while focused', async ({ page }) => {
    await open(page, FORM);
    const age = page.getByRole('spinbutton', { name: 'Age' });
    await age.pressSequentially('200');
    // Not clamped while typing.
    expect(await valueOf(page, '#age')).toBe('200');
    await age.press('Tab');
    expect(await valueOf(page, '#age')).toBe('120');
    await expect(age).toHaveValue('120');

    await age.fill('');
    await age.pressSequentially('5');
    await age.blur();
    expect(await valueOf(page, '#age')).toBe('18');

    await age.fill('');
    await age.pressSequentially('2.');
    await expect(age).toHaveValue('2.');
    expect(await valueOf(page, '#age')).toBe('2');
    await expect(age).toBeFocused();
    // A letter is refused, the draft kept.
    await age.press('x');
    await expect(age).toHaveValue('2.');
    await age.blur();
    await expect(age).toHaveValue('18');
  });

  test('Arrow, Page Up/Down, Home and End keys', async ({ page }) => {
    await open(page, `${NUMBER}--default`);
    const field = page.getByRole('spinbutton', { name: 'Quantity' });
    await expect(field).toHaveAttribute('aria-valuemin', '0');
    await expect(field).toHaveAttribute('aria-valuemax', '100');
    await field.focus();
    const steps: [string, string][] = [
      ['ArrowUp', '6'],
      ['ArrowDown', '5'],
      ['PageUp', '15'],
      ['PageDown', '5'],
      ['End', '100'],
      ['ArrowUp', '100'],
      ['Home', '0'],
      ['ArrowDown', '0'],
    ];
    for (const [key, value] of steps) {
      await page.keyboard.press(key);
      await expect(field, key).toHaveValue(value);
      expect(await valueOf(page, '#quantity')).toBe(value);
      await expect(field).toHaveAttribute('aria-valuenow', value);
    }
  });

  test('disabled: the inner field is disabled and keys do nothing', async ({ page }) => {
    await open(page, `${NUMBER}--disabled`);
    await expect(page.getByRole('spinbutton', { name: 'Seats' })).toBeDisabled();
  });
});

test.describe('nx-date-picker', () => {
  test('the button opens it; arrows move; Enter picks, closes and focus returns to the field', async ({ page }) => {
    await open(page, `${DATE}--default`);
    const button = page.getByRole('button', { name: 'Pick a date' });
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await button.click();
    const dialog = page.getByRole('dialog', { name: 'Pick a date' });
    await expect(dialog).toBeVisible();
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await expect(dialog.getByRole('grid', { name: 'March 2024' })).toBeVisible();
    expect(await focused(page)).toBe('2024-03-14');
    const keys: [string, string][] = [
      ['ArrowRight', '2024-03-15'],
      ['ArrowDown', '2024-03-22'],
      ['ArrowLeft', '2024-03-21'],
      ['ArrowUp', '2024-03-14'],
      ['PageDown', '2024-04-14'],
      ['PageUp', '2024-03-14'],
      ['Shift+PageDown', '2025-03-14'],
      ['Shift+PageUp', '2024-03-14'],
      ['Home', '2024-03-10'],
      ['End', '2024-03-16'],
    ];
    for (const [key, value] of keys) {
      await page.keyboard.press(key);
      expect(await focused(page), key).toBe(value);
    }
    await page.keyboard.press('Enter');
    await expect(dialog).toBeHidden();
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(await valueOf(page, '#due')).toBe('2024-03-16');
    await expect(page.getByRole('textbox', { name: 'Due date' })).toBeFocused();
  });

  test('Escape closes without picking; focus returns to the field', async ({ page }) => {
    await open(page, `${DATE}--default`);
    await page.getByRole('button', { name: 'Pick a date' }).click();
    const dialog = page.getByRole('dialog', { name: 'Pick a date' });
    await expect(dialog).toBeVisible();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    expect(await valueOf(page, '#due')).toBe('2024-03-14');
    await expect(page.getByRole('textbox', { name: 'Due date' })).toBeFocused();
  });

  test('a click on a day picks it', async ({ page }) => {
    await open(page, `${DATE}--default`);
    await page.getByRole('button', { name: 'Pick a date' }).click();
    await page.locator('#due button[data-value="2024-03-20"]').click();
    await expect(page.getByRole('dialog', { name: 'Pick a date' })).toBeHidden();
    expect(await valueOf(page, '#due')).toBe('2024-03-20');
  });

  test('days outside min and max are disabled', async ({ page }) => {
    await open(page, `${DATE}--min-max`);
    await page.getByRole('button', { name: 'Pick a date' }).click();
    await expect(page.getByRole('dialog', { name: 'Pick a date' })).toBeVisible();
    const day = (v: string) => page.locator(`#window button[data-value="${v}"]`);
    await expect(day('2024-03-04')).toBeDisabled();
    await expect(day('2024-03-05')).toBeEnabled();
    await expect(day('2024-03-25')).toBeEnabled();
    await expect(day('2024-03-26')).toBeDisabled();
    // min and max are in this month: neither neighbour is reachable.
    await expect(page.getByRole('button', { name: 'Go to previous month' })).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Go to next month' })).toBeDisabled();
    // Keys stop at the bounds.
    await page.keyboard.press('PageDown');
    expect(await focused(page)).toBe('2024-03-25');
    await page.keyboard.press('ArrowRight');
    expect(await focused(page)).toBe('2024-03-25');
    await page.keyboard.press('PageUp');
    expect(await focused(page)).toBe('2024-03-05');
  });

  test('month granularity picks YYYY-MM', async ({ page }) => {
    await open(page, `${DATE}--month-granularity`);
    expect(await valueOf(page, '#billing')).toBe('2024-03');
    await page.getByRole('button', { name: 'Pick a month' }).click();
    await expect(page.getByRole('dialog', { name: 'Pick a month' })).toBeVisible();
    expect(await focused(page)).toBe('2024-03');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowDown');
    expect(await focused(page)).toBe('2024-07');
    await page.keyboard.press('Enter');
    await expect(page.getByRole('dialog', { name: 'Pick a month' })).toBeHidden();
    expect(await valueOf(page, '#billing')).toBe('2024-07');
  });

  test('year granularity picks YYYY, inside min and max', async ({ page }) => {
    await open(page, `${DATE}--year-granularity`);
    await page.getByRole('button', { name: 'Pick a year' }).click();
    await expect(page.getByRole('dialog', { name: 'Pick a year' })).toBeVisible();
    expect(await focused(page)).toBe('2024');
    await expect(page.locator('#founded button[data-value="2026"]')).toBeDisabled();
    await expect(page.locator('#founded button[data-value="2016"]')).toBeEnabled();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    expect(await focused(page)).toBe('2025');
    await page.keyboard.press('Enter');
    expect(await valueOf(page, '#founded')).toBe('2025');
  });

  test('below 768px the calendar is a bottom sheet', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await open(page, `${DATE}--default`);
    await page.getByRole('button', { name: 'Pick a date' }).click();
    const dialog = page.getByRole('dialog', { name: 'Pick a date' });
    await expect(dialog).toBeVisible();
    const box = (await dialog.boundingBox())!;
    expect(box.x).toBe(0);
    expect(Math.round(box.width)).toBe(375);
    expect(Math.round(box.y + box.height)).toBe(812);
    // Day cells grow to 44px touch targets in the sheet.
    const cell = (await page.locator('#due button[data-value="2024-03-14"]').boundingBox())!;
    expect(Math.round(cell.width)).toBe(44);
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });

  test('at 768px and wider it is a popover under the field', async ({ page }) => {
    await open(page, `${DATE}--default`);
    await page.getByRole('button', { name: 'Pick a date' }).click();
    const dialog = page.getByRole('dialog', { name: 'Pick a date' });
    await expect(dialog).toBeVisible();
    const field = (await page.locator('#due').boundingBox())!;
    const box = (await dialog.boundingBox())!;
    expect(box.width).toBeLessThan(500);
    expect(Math.round(box.y)).toBe(Math.round(field.y + field.height + 4));
  });

  test('the popover follows the field when the page scrolls', async ({ page }) => {
    await open(page, `${DATE}--default`);
    await page.addStyleTag({ content: 'body { min-height: 300vh; }' });
    await page.getByRole('button', { name: 'Pick a date' }).click();
    const dialog = page.getByRole('dialog', { name: 'Pick a date' });
    await expect(dialog).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 40));
    await expect
      .poll(async () => {
        const field = (await page.locator('#due').boundingBox())!;
        const box = (await dialog.boundingBox())!;
        return Math.round(box.y - (field.y + field.height));
      })
      .toBe(4);
  });
});

// axe on every element story in every engine (the Chromium per-story scan in
// a11y.visual.spec.ts covers them too; the RFC asks for all three engines).
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const STORIES = [
  `${NUMBER}--default`,
  `${NUMBER}--sizes`,
  `${NUMBER}--disabled`,
  `${NUMBER}--invalid-required`,
  `${DATE}--default`,
  `${DATE}--month-granularity`,
  `${DATE}--year-granularity`,
  `${DATE}--min-max`,
  `${DATE}--open`,
  FORM,
];
for (const id of STORIES) {
  for (const theme of ['light', 'dark']) {
    test(`axe ${id} ${theme}`, async ({ page }) => {
      // The OS preference stays light (the config's), so dark is the page's own data-theme: the
      // harder case. 11.7: the story's plain buttons set their own surface, since WebKit keeps a
      // native button's face light grey under color-scheme: dark.
      await open(page, id, theme);
      await page.waitForFunction((t) => document.documentElement.dataset.theme === t, theme);
      await page.evaluate(() => document.fonts.ready);
      await page.addScriptTag({ path: axePath });
      const violations = await page.evaluate(async (tags) => {
        // @ts-expect-error injected global
        const r = await window.axe.run('#storybook-root', { runOnly: { type: 'tag', values: tags } });
        return (r.violations as { id: string; nodes: { target: string[]; failureSummary: string }[] }[]).map((v) => ({
          id: v.id,
          nodes: v.nodes.slice(0, 3).map((n) => `${n.target.join(' ')}: ${n.failureSummary}`),
        }));
      }, TAGS);
      expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
    });
  }
}

// The same scan with the calendar open in the month and year grids.
for (const [id, name] of [
  [`${DATE}--month-granularity`, 'Pick a month'],
  [`${DATE}--year-granularity`, 'Pick a year'],
] as const) {
  test(`axe ${id} open`, async ({ page }) => {
    await open(page, id);
    await page.getByRole('button', { name }).click();
    await expect(page.getByRole('dialog', { name })).toBeVisible();
    await page.addScriptTag({ path: axePath });
    const violations = await page.evaluate(async (tags) => {
      // @ts-expect-error injected global
      const r = await window.axe.run('#storybook-root', { runOnly: { type: 'tag', values: tags } });
      return (r.violations as { id: string }[]).map((v) => v.id);
    }, TAGS);
    expect(violations).toEqual([]);
  });
}
