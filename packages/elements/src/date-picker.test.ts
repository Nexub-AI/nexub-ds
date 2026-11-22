import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import './define.js';
import { NxDatePicker } from './index.js';
import { formatDisplay, formatHint, parseTypedDate } from './date-text.js';

const mount = (html: string) => {
  document.body.innerHTML = html;
  return document.querySelector('nx-date-picker')!;
};
const $ = <T extends Element = HTMLElement>(el: NxDatePicker, sel: string) => el.shadowRoot!.querySelector<T & Element>(sel)!;
const $$ = (el: NxDatePicker, sel: string) => Array.from(el.shadowRoot!.querySelectorAll<HTMLButtonElement>(sel));
const input = (el: NxDatePicker) => $<HTMLInputElement>(el, 'input') as HTMLInputElement;
const openButton = (el: NxDatePicker) => $<HTMLButtonElement>(el, 'button[part="button"]') as HTMLButtonElement;
const dialog = (el: NxDatePicker) => $<HTMLDialogElement>(el, 'dialog') as HTMLDialogElement;
const active = (el: NxDatePicker) => el.shadowRoot!.activeElement as HTMLButtonElement | null;
const key = (el: NxDatePicker, k: string, init: KeyboardEventInit = {}) =>
  active(el)!.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true, composed: true, ...init }));

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date(2026, 10, 22, 12));
  document.body.innerHTML = '';
});
afterEach(() => {
  vi.useRealTimers();
});

describe('<nx-date-picker>', () => {
  it('is registered and form-associated, with a field, a button and a dialog', () => {
    const el = mount('<nx-date-picker locale="en-US"></nx-date-picker>');
    expect(customElements.get('nx-date-picker')).toBe(NxDatePicker);
    expect(NxDatePicker.formAssociated).toBe(true);
    expect(input(el)).toHaveAttribute('part', 'input');
    expect(input(el).placeholder).toBe('mm/dd/yyyy');
    expect(openButton(el)).toHaveAttribute('aria-haspopup', 'dialog');
    expect(openButton(el)).toHaveAttribute('aria-label', 'Pick a date');
    expect(dialog(el)).toHaveAttribute('part', 'calendar');
    expect(el.shadowRoot!.adoptedStyleSheets.length).toBe(2);
  });

  it('reflects attributes and properties', () => {
    const el = mount('<nx-date-picker></nx-date-picker>');
    el.min = '2026-01-01';
    el.max = '2026-12-31';
    el.granularity = 'month';
    el.locale = 'de-DE';
    el.name = 'start';
    expect(el.getAttribute('min')).toBe('2026-01-01');
    expect(el.getAttribute('max')).toBe('2026-12-31');
    expect(el.getAttribute('granularity')).toBe('month');
    expect(el.getAttribute('locale')).toBe('de-DE');
    expect(el.min).toBe('2026-01-01');
    expect(el.max).toBe('2026-12-31');
    expect(el.locale).toBe('de-DE');
    el.setAttribute('granularity', 'week');
    expect(el.granularity).toBe('day');
  });

  it('shows the value in the locale and posts it as YYYY-MM-DD', () => {
    document.body.innerHTML = '<form><nx-date-picker name="d" value="2026-03-05" locale="de-DE"></nx-date-picker></form>';
    const el = document.querySelector('nx-date-picker')!;
    expect(input(el).value).toBe('05.03.2026');
    expect(input(el).placeholder).toBe('dd.mm.yyyy');
    expect(new FormData(document.querySelector('form')!).get('d')).toBe('2026-03-05');
  });

  it('follows the nearest lang when it has no locale', () => {
    document.body.innerHTML = '<div lang="en-GB"><nx-date-picker value="2026-03-05"></nx-date-picker></div>';
    expect(input(document.querySelector('nx-date-picker')!).value).toBe('05/03/2026');
    document.body.innerHTML = '<nx-date-picker locale="!!" value="2026-03-05"></nx-date-picker>';
    expect(input(document.querySelector('nx-date-picker')!).value).not.toBe('');
  });

  it('sanitises the value to the granularity', () => {
    const el = mount('<nx-date-picker value="2026-02-30"></nx-date-picker>');
    expect(el.value).toBe('');
    el.value = '2026-03-05';
    expect(el.value).toBe('2026-03-05');
    el.granularity = 'month';
    expect(el.value).toBe('2026-03');
    el.granularity = 'year';
    expect(el.value).toBe('2026');
    el.granularity = 'day';
    expect(el.value).toBe(''); // a year is no day
    const m = mount('<nx-date-picker granularity="month" value="2026-07-14"></nx-date-picker>');
    expect(m.value).toBe('2026-07');
  });

  it('opens a day grid on the selected date, picks with a click and fires change', async () => {
    const el = mount('<nx-date-picker locale="en-US" value="2026-03-05"></nx-date-picker>');
    const change = vi.fn(() => el.value);
    el.addEventListener('change', change);
    await userEvent.click(openButton(el));
    expect(el.open).toBe(true);
    expect(openButton(el)).toHaveAttribute('aria-expanded', 'true');
    expect($(el, '.title').textContent).toBe('March 2026');
    expect($(el, '[role="grid"]')).toHaveAttribute('aria-label', 'March 2026');
    const headers = Array.from(el.shadowRoot!.querySelectorAll('th')).map((th) => th.textContent);
    expect(headers).toEqual(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
    expect(active(el)).toHaveAttribute('data-value', '2026-03-05');
    expect(active(el)!.getAttribute('aria-label')).toBe('Thursday, March 5, 2026, selected');
    expect(active(el)!.parentElement).toHaveAttribute('aria-selected', 'true');
    // March 2026 starts on a Sunday: 5 rows, April's first days outside the month.
    expect($$(el, 'button.day')).toHaveLength(35);
    expect($(el, '[data-value="2026-04-01"]')).toHaveAttribute('data-outside');
    await userEvent.click($(el, '[data-value="2026-03-18"]'));
    expect(el.value).toBe('2026-03-18');
    expect(change).toHaveReturnedWith('2026-03-18');
    expect(el.open).toBe(false);
    expect(openButton(el)).toHaveAttribute('aria-expanded', 'false');
    expect(el.shadowRoot!.activeElement).toBe(input(el)); // focus back to the field
    expect(input(el).value).toBe('03/18/2026');
  });

  it('starts the week on the locale first day', async () => {
    const el = mount('<nx-date-picker locale="de-DE" value="2026-03-05"></nx-date-picker>');
    el.show();
    const headers = Array.from(el.shadowRoot!.querySelectorAll('th')).map((th) => th.getAttribute('abbr'));
    expect(headers[0]).toBe('Montag');
    // March 1 2026 is a Sunday: six leading February days on a Monday-first grid.
    expect($$(el, 'button.day')[0]).toHaveAttribute('data-value', '2026-02-23');
  });

  it('opens on today, marked as the current date, when empty', () => {
    const el = mount('<nx-date-picker locale="en-US"></nx-date-picker>');
    el.show();
    expect(active(el)).toHaveAttribute('data-value', '2026-11-22');
    expect(active(el)).toHaveAttribute('aria-current', 'date');
    expect(active(el)!.getAttribute('aria-label')).toBe('Today, Sunday, November 22, 2026');
  });

  it('moves with the React DatePicker keyboard map', () => {
    const el = mount('<nx-date-picker locale="en-US" value="2026-03-05"></nx-date-picker>');
    el.show();
    const at = () => active(el)!.dataset.value;
    key(el, 'ArrowRight');
    expect(at()).toBe('2026-03-06');
    key(el, 'ArrowLeft');
    key(el, 'ArrowLeft');
    expect(at()).toBe('2026-03-04');
    key(el, 'ArrowDown');
    expect(at()).toBe('2026-03-11');
    key(el, 'ArrowUp');
    expect(at()).toBe('2026-03-04');
    key(el, 'Home'); // Sunday-first week
    expect(at()).toBe('2026-03-01');
    key(el, 'End');
    expect(at()).toBe('2026-03-07');
    key(el, 'PageDown');
    expect(at()).toBe('2026-04-07');
    expect($(el, '.title').textContent).toBe('April 2026');
    key(el, 'PageUp');
    key(el, 'PageUp');
    expect(at()).toBe('2026-02-07');
    key(el, 'PageDown', { shiftKey: true });
    expect(at()).toBe('2027-02-07');
    key(el, 'PageUp', { shiftKey: true });
    expect(at()).toBe('2026-02-07');
    key(el, 'ArrowUp');
    key(el, 'ArrowUp');
    expect(at()).toBe('2026-01-24'); // across the month: the grid follows
    expect($(el, '.title').textContent).toBe('January 2026');
    key(el, 'x'); // not a grid key
    expect(at()).toBe('2026-01-24');
  });

  it('flips the arrows in a right-to-left page', () => {
    document.body.innerHTML = '<div dir="rtl"><nx-date-picker locale="en-US" value="2026-03-05"></nx-date-picker></div>';
    const el = document.querySelector('nx-date-picker')!;
    el.show();
    key(el, 'ArrowLeft');
    expect(active(el)).toHaveAttribute('data-value', '2026-03-06');
  });

  it('turns the page with the nav buttons, keeping focus on them', async () => {
    const el = mount('<nx-date-picker locale="en-US" value="2026-03-05"></nx-date-picker>');
    el.show();
    const [prev, next] = $$(el, '.nav');
    expect(prev).toHaveAttribute('aria-label', 'Go to previous month');
    await userEvent.click(next!);
    expect($(el, '.title').textContent).toBe('April 2026');
    await userEvent.click(prev!);
    await userEvent.click(prev!);
    expect($(el, '.title').textContent).toBe('February 2026');
    expect(el.open).toBe(true);
  });

  it('disables days outside min and max, and the pages wholly outside them', () => {
    const el = mount('<nx-date-picker locale="en-US" min="2026-03-10" max="2026-03-20" value="2026-03-15"></nx-date-picker>');
    el.show();
    expect($<HTMLButtonElement>(el, '[data-value="2026-03-09"]')).toBeDisabled();
    expect($<HTMLButtonElement>(el, '[data-value="2026-03-10"]')).not.toBeDisabled();
    expect($<HTMLButtonElement>(el, '[data-value="2026-03-21"]')).toBeDisabled();
    const [prev, next] = $$(el, '.nav');
    expect(prev).toBeDisabled();
    expect(next).toBeDisabled();
    // Keys stop at the bounds.
    key(el, 'PageUp');
    expect(active(el)).toHaveAttribute('data-value', '2026-03-10');
    key(el, 'ArrowDown');
    key(el, 'ArrowDown');
    expect(active(el)).toHaveAttribute('data-value', '2026-03-20');
    // A disabled day can't be picked.
    $<HTMLButtonElement>(el, '[data-value="2026-03-21"]').click();
    expect(el.value).toBe('2026-03-15');
  });

  it('treats a coarse max as its whole period', () => {
    const el = mount('<nx-date-picker locale="en-US" max="2026" value="2026-12-30"></nx-date-picker>');
    el.show();
    key(el, 'PageDown');
    expect(active(el)).toHaveAttribute('data-value', '2026-12-31');
    expect(el.validity.valid).toBe(true);
  });

  it('closes with Escape (the dialog cancel) and returns focus to the field', () => {
    const el = mount('<nx-date-picker></nx-date-picker>');
    el.show();
    el.show(); // already open: nothing
    dialog(el).close(); // what Escape does on a modal dialog
    expect(el.open).toBe(false);
    expect(el.shadowRoot!.activeElement).toBe(input(el));
    el.close(); // already closed: nothing
  });

  it('closes on a press outside the dialog box', () => {
    const el = mount('<nx-date-picker></nx-date-picker>');
    el.show();
    dialog(el).getBoundingClientRect = () => ({ left: 10, right: 100, top: 10, bottom: 100 }) as DOMRect;
    dialog(el).dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 50, clientY: 50 }));
    expect(el.open).toBe(true);
    $(el, '.head').dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 500, clientY: 500 }));
    expect(el.open).toBe(true);
    dialog(el).dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 500, clientY: 500 }));
    expect(el.open).toBe(false);
  });

  it('places the popover under the field, or above it without room below', () => {
    const el = mount('<nx-date-picker></nx-date-picker>');
    const box = $(el, '.field');
    box.getBoundingClientRect = () => ({ left: 20, right: 220, top: 600, bottom: 640 }) as DOMRect;
    Object.defineProperty(dialog(el), 'offsetHeight', { configurable: true, value: 300 });
    Object.defineProperty(dialog(el), 'offsetWidth', { configurable: true, value: 280 });
    el.show();
    expect(dialog(el).style.getPropertyValue('--nx-start')).toBe('20px');
    expect(dialog(el).style.getPropertyValue('--nx-top')).toBe('296px'); // 768 tall: above
    box.getBoundingClientRect = () => ({ left: 20, right: 220, top: 10, bottom: 50 }) as DOMRect;
    window.dispatchEvent(new Event('resize'));
    expect(dialog(el).style.getPropertyValue('--nx-top')).toBe('54px');
  });

  it('does not open when disabled or read-only', async () => {
    const el = mount('<nx-date-picker disabled></nx-date-picker>');
    expect(openButton(el)).toBeDisabled();
    el.show();
    expect(el.open).toBe(false);
    el.disabled = false;
    el.readOnly = true;
    expect(openButton(el)).toBeDisabled();
    expect(input(el).readOnly).toBe(true);
    el.show();
    expect(el.open).toBe(false);
  });

  it('accepts a typed date and normalises it on blur', async () => {
    const el = mount('<nx-date-picker locale="en-US"></nx-date-picker>');
    const change = vi.fn(() => el.value);
    el.addEventListener('change', change);
    const outer = vi.fn();
    el.addEventListener('input', outer);
    await userEvent.type(input(el), '3/5/26');
    expect(outer).not.toHaveBeenCalled(); // the inner input event stays inside
    await userEvent.tab();
    expect(el.value).toBe('2026-03-05');
    expect(input(el).value).toBe('03/05/2026');
    expect(change).toHaveReturnedWith('2026-03-05');
  });

  it('keeps an unreadable typed date as typed, invalid, value unchanged', async () => {
    document.body.innerHTML = '<form><nx-date-picker name="d" locale="en-US" value="2026-03-05"></nx-date-picker></form>';
    const el = document.querySelector('nx-date-picker')!;
    const form = document.querySelector('form')!;
    const submit = vi.fn((e: Event) => e.preventDefault());
    form.addEventListener('submit', submit);
    await userEvent.type(input(el), 'x{Enter}');
    expect(input(el).value).toBe('03/05/2026x');
    expect(el.value).toBe('2026-03-05');
    expect(el.validity.badInput).toBe(true);
    expect(input(el)).toHaveAttribute('aria-invalid', 'true');
    expect(submit).not.toHaveBeenCalled();
    // Clearing the field empties the value.
    el.value = '2026-03-05';
    expect(el.validity.valid).toBe(true);
    input(el).focus();
    input(el).value = '';
    input(el).dispatchEvent(new Event('input', { bubbles: true }));
    input(el).dispatchEvent(new Event('blur'));
    expect(el.value).toBe('');
  });

  it('keeps a typed date outside min or max as typed, with a range error', async () => {
    const el = mount('<nx-date-picker locale="en-US" min="2026-03-10" max="2026-03-20"></nx-date-picker>');
    await userEvent.type(input(el), '2026-03-01');
    await userEvent.tab();
    expect(el.value).toBe('');
    expect(el.validity.rangeUnderflow).toBe(true);
    el.value = '2026-03-25';
    expect(el.validity.rangeOverflow).toBe(true);
    expect(el.validationMessage).not.toBe('');
  });

  it('submits on Enter after a typed date', async () => {
    document.body.innerHTML = '<form><nx-date-picker name="d" locale="en-US"></nx-date-picker></form>';
    const el = document.querySelector('nx-date-picker')!;
    const form = document.querySelector('form')!;
    const posted: unknown[] = [];
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      posted.push(new FormData(form).get('d'));
    });
    await userEvent.type(input(el), '12/24/2026{Enter}');
    expect(posted).toEqual(['2026-12-24']);
  });

  it('is required, resets to the value attribute and restores state', async () => {
    document.body.innerHTML = '<form><nx-date-picker name="d" required value="2026-01-02" locale="en-US"></nx-date-picker></form>';
    const el = document.querySelector('nx-date-picker')!;
    const form = document.querySelector('form')!;
    expect(el.validity.valid).toBe(true);
    el.value = '';
    expect(el.validity.valueMissing).toBe(true);
    expect(form.checkValidity()).toBe(false);
    expect(input(el)).toHaveAttribute('aria-required', 'true');
    expect(input(el)).toHaveAttribute('aria-invalid', 'true');
    el.show();
    form.reset();
    expect(el.open).toBe(false);
    expect(el.value).toBe('2026-01-02');
    expect(input(el).value).toBe('01/02/2026');
    expect(input(el)).toHaveAttribute('aria-invalid', 'false');
    el.formStateRestoreCallback('2026-05-06');
    expect(el.value).toBe('2026-05-06');
  });

  it('picks a month from a month grid', async () => {
    const el = mount('<nx-date-picker granularity="month" locale="en-US" value="2026-03" min="2026-02" max="2027-06"></nx-date-picker>');
    expect(input(el).value).toBe('March 2026');
    expect(input(el).placeholder).toBe('mm/yyyy');
    expect(openButton(el)).toHaveAttribute('aria-label', 'Pick a month');
    el.show();
    expect($(el, '.title').textContent).toBe('2026');
    expect($(el, '[role="group"]')).toBeInTheDocument();
    const cells = $$(el, 'button.cell');
    expect(cells.map((c) => c.textContent)).toEqual(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
    expect(cells[0]).toBeDisabled();
    expect(cells[2]).toHaveAttribute('aria-pressed', 'true');
    expect(cells[2]).toHaveAttribute('aria-label', 'March 2026');
    expect(cells[10]).toHaveAttribute('aria-current', 'date');
    const [prev, next] = $$(el, '.nav');
    expect(prev).toHaveAttribute('aria-label', 'Go to previous year');
    expect(prev).toBeDisabled();
    expect(next).not.toBeDisabled();
    const at = () => active(el)!.dataset.value;
    expect(at()).toBe('2026-03');
    key(el, 'ArrowRight');
    expect(at()).toBe('2026-04');
    key(el, 'ArrowDown');
    expect(at()).toBe('2026-07');
    key(el, 'ArrowUp');
    key(el, 'ArrowUp');
    expect(at()).toBe('2026-02'); // stops at min
    key(el, 'End');
    expect(at()).toBe('2026-12');
    key(el, 'Home');
    expect(at()).toBe('2026-02');
    key(el, 'PageDown');
    expect(at()).toBe('2027-02');
    expect($(el, '.title').textContent).toBe('2027');
    key(el, 'End');
    expect(at()).toBe('2027-06'); // stops at max
    await userEvent.click($(el, '[data-value="2027-04"]'));
    expect(el.value).toBe('2027-04');
    expect(input(el).value).toBe('April 2027');
  });

  it('picks a year from a twelve-year grid', async () => {
    const el = mount('<nx-date-picker granularity="year" value="2026"></nx-date-picker>');
    expect(input(el).value).toBe('2026');
    expect(input(el).placeholder).toBe('yyyy');
    el.show();
    expect($(el, '.title').textContent).toBe('2016 – 2027');
    expect($$(el, 'button.cell')).toHaveLength(12);
    const [prev, next] = $$(el, '.nav');
    expect(next).toHaveAttribute('aria-label', 'Go to next years');
    const at = () => active(el)!.dataset.value;
    expect(at()).toBe('2026');
    key(el, 'ArrowDown');
    expect(at()).toBe('2029');
    expect($(el, '.title').textContent).toBe('2028 – 2039');
    key(el, 'Home');
    expect(at()).toBe('2028');
    key(el, 'End');
    expect(at()).toBe('2039');
    key(el, 'PageUp');
    expect(at()).toBe('2027');
    key(el, 'ArrowLeft');
    expect(at()).toBe('2026');
    await userEvent.click(prev!);
    expect($(el, '.title').textContent).toBe('2004 – 2015');
    await userEvent.click($(el, '[data-value="2010"]'));
    expect(el.value).toBe('2010');
  });

  it('accepts typed months and years', async () => {
    const el = mount('<nx-date-picker granularity="month" locale="en-US"></nx-date-picker>');
    await userEvent.type(input(el), 'sep 2026');
    await userEvent.tab();
    expect(el.value).toBe('2026-09');
    expect(input(el).value).toBe('September 2026');
  });

  it('names the field from its label', async () => {
    document.body.innerHTML = '<label for="s">Start date</label><nx-date-picker id="s"></nx-date-picker>';
    await Promise.resolve();
    const el = document.querySelector('nx-date-picker')!;
    expect(input(el)).toHaveAttribute('aria-label', 'Start date');
    el.focus();
    expect(el.shadowRoot!.activeElement).toBe(input(el));
  });

  it('can be imported where there is no DOM', async () => {
    // index.ts guards the HTMLElement base; covered by the build running in Node too.
    const mod = await import('./index.js');
    expect(typeof mod.NxDatePicker).toBe('function');
  });
});

describe('typed dates', () => {
  it('reads ISO, locale order, month names and two-digit years', () => {
    expect(parseTypedDate('2026-03-05', 'day', 'en-US')).toEqual({ year: 2026, month: 2, day: 5 });
    expect(parseTypedDate('2026-03', 'day', 'en-US')).toBeUndefined();
    expect(parseTypedDate('2026-03-05', 'month', 'en-US')).toEqual({ year: 2026, month: 2, day: 5 });
    expect(parseTypedDate('3/5/2026', 'day', 'en-US')).toEqual({ year: 2026, month: 2, day: 5 });
    expect(parseTypedDate('5.3.2026', 'day', 'de-DE')).toEqual({ year: 2026, month: 2, day: 5 });
    expect(parseTypedDate('5 March 2026', 'day', 'en-GB')).toEqual({ year: 2026, month: 2, day: 5 });
    expect(parseTypedDate('5. März 2026', 'day', 'de-DE')).toEqual({ year: 2026, month: 2, day: 5 });
    expect(parseTypedDate('Mar 5 26', 'day', 'en-US')).toEqual({ year: 2026, month: 2, day: 5 });
    expect(parseTypedDate('03/2026', 'month', 'en-US')).toEqual({ year: 2026, month: 2, day: 1 });
    expect(parseTypedDate('26', 'year', 'en-US')).toEqual({ year: 2026, month: 0, day: 1 });
    expect(parseTypedDate('٥/٣/٢٠٢٦', 'day', 'ar-EG')).toEqual({ year: 2026, month: 2, day: 5 });
  });

  it('rejects what is not a real date', () => {
    expect(parseTypedDate('', 'day')).toBeUndefined();
    expect(parseTypedDate('2/30/2026', 'day', 'en-US')).toBeUndefined();
    expect(parseTypedDate('13/2026', 'month', 'en-US')).toBeUndefined();
    expect(parseTypedDate('3/5', 'day', 'en-US')).toBeUndefined();
    expect(parseTypedDate('March April 2026', 'month', 'en-US')).toBeUndefined();
    expect(parseTypedDate('Smarch 2026', 'month', 'en-US')).toBeUndefined();
  });

  it('formats and hints in the locale', () => {
    expect(formatDisplay({ year: 2026, month: 2, day: 5 }, 'day', 'en-US')).toBe('03/05/2026');
    expect(formatDisplay({ year: 2026, month: 2, day: 5 }, 'month', 'de-DE')).toBe('März 2026');
    expect(formatDisplay({ year: 2026, month: 2, day: 5 }, 'year')).toBe('2026');
    expect(formatHint('day', 'en-GB')).toBe('dd/mm/yyyy');
    expect(formatHint('year', 'de-DE')).toBe('yyyy');
  });
});
