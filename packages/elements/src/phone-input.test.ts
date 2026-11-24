import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import './define.js';
import { NxPhoneInput } from './index.js';

const mount = (html: string) => {
  document.body.innerHTML = html;
  return document.querySelector('nx-phone-input')!;
};
const input = (el: NxPhoneInput) => el.shadowRoot!.querySelector('input')!;
const country = (el: NxPhoneInput) => el.shadowRoot!.querySelector<HTMLButtonElement>('button.country')!;
const only = (el: NxPhoneInput) => el.shadowRoot!.querySelector<HTMLElement>('span.country')!;
const shown = (el: NxPhoneInput) => [...el.shadowRoot!.querySelectorAll<HTMLElement>('[role="option"]')].map((o) => o.textContent);
const active = (el: NxPhoneInput) => {
  const id = country(el).getAttribute('aria-activedescendant');
  return id ? el.shadowRoot!.getElementById(id)!.textContent : null;
};
const key = (target: HTMLElement, k: string, init: KeyboardEventInit = {}) => {
  const e = new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true, composed: true, ...init });
  target.dispatchEvent(e);
  return e;
};
/** Replaces the text as a paste or an edit would, caret at `caret` (default: the end). */
const edit = (el: NxPhoneInput, text: string, caret = text.length) => {
  const i = input(el);
  i.focus();
  i.value = text;
  i.setSelectionRange(caret, caret);
  i.dispatchEvent(new Event('input', { bubbles: true }));
};
/** Types at the end, a key at a time. */
const typeInto = (el: NxPhoneInput, text: string) => {
  for (const ch of text) edit(el, input(el).value + ch);
};

let now = 1_000_000;
beforeEach(() => {
  document.body.innerHTML = '';
  now += 10_000;
  vi.spyOn(Date, 'now').mockImplementation(() => now);
});
afterEach(() => vi.restoreAllMocks());

describe('<nx-phone-input>', () => {
  it('is a form-associated tel field with a country picker', () => {
    const el = mount('<nx-phone-input default-country="IN" locale="en"></nx-phone-input>');
    expect(customElements.get('nx-phone-input')).toBe(NxPhoneInput);
    expect(NxPhoneInput.formAssociated).toBe(true);
    expect(input(el).type).toBe('tel');
    expect(input(el)).toHaveAttribute('autocomplete', 'tel-national');
    expect(input(el)).toHaveAttribute('inputmode', 'tel');
    expect(country(el)).toHaveAttribute('role', 'combobox');
    expect(country(el)).toHaveAttribute('aria-haspopup', 'listbox');
    expect(country(el)).toHaveAttribute('aria-label', 'Country code, India +91');
    expect(country(el).textContent).toBe('+91');
    expect(only(el).hidden).toBe(true);
    expect(el.country).toBe('IN');
  });

  it('shows an E.164 value in national groups, in its own country, and posts E.164', () => {
    document.body.innerHTML = '<form><nx-phone-input name="tel" value="+919847012345" default-country="US"></nx-phone-input></form>';
    const el = document.querySelector('nx-phone-input')!;
    expect(el.country).toBe('IN');
    expect(input(el).value).toBe('98470 12345');
    expect(new FormData(document.querySelector('form')!).get('tel')).toBe('+919847012345');
    el.value = '(415) 555-0100'; // national digits in the current country
    expect(el.value).toBe('+914155550100');
    el.value = '';
    expect(input(el).value).toBe('');
  });

  it('groups national digits as you type, keeping the caret after the same digit', async () => {
    const el = mount('<nx-phone-input default-country="IN"></nx-phone-input>');
    const values: string[] = [];
    el.addEventListener('input', () => values.push(el.value));
    const changes = vi.fn();
    el.addEventListener('change', changes);
    typeInto(el, '9847012345');
    expect(input(el).value).toBe('98470 12345');
    expect(el.value).toBe('+919847012345');
    expect(values.at(-1)).toBe('+919847012345');
    expect(values.length).toBe(10);
    // A digit typed in the middle: the caret stays after it.
    edit(el, '984701 12345', 6);
    expect(input(el).value).toBe('98470 112345');
    expect(input(el).selectionStart).toBe(7);
    // A letter changes nothing.
    edit(el, '98470 112345a');
    expect(el.value).toBe('+9198470112345');
    expect(values.length).toBe(11);
    // A trunk 0 is dropped.
    edit(el, '09847012345', 3);
    expect(input(el).value).toBe('98470 12345');
    expect(input(el).selectionStart).toBe(2);
    input(el).blur();
    expect(changes).toHaveBeenCalledTimes(1);
  });

  it('takes the country from a typed or pasted international number', () => {
    const el = mount('<nx-phone-input default-country="US"></nx-phone-input>');
    const countries: string[] = [];
    el.addEventListener('countrychange', () => countries.push(el.country));
    typeInto(el, '+4');
    expect(input(el).value).toBe('+4'); // no calling code yet: kept as typed
    expect(el.value).toBe('');
    typeInto(el, '4');
    expect(input(el).value).toBe('+44');
    expect(el.country).toBe('US');
    typeInto(el, '2');
    expect(el.country).toBe('GB');
    expect(input(el).value).toBe('2');
    expect(el.value).toBe('+442');
    expect(countries).toEqual(['GB']);
    edit(el, '0091 98470 12345');
    expect(el.country).toBe('IN');
    expect(el.value).toBe('+919847012345');
    expect(input(el).value).toBe('98470 12345');
    expect(input(el).selectionStart).toBe(11);
  });

  it('is typeMismatch for a number of the wrong length, badInput for an unfinished prefix', () => {
    document.body.innerHTML = '<form><nx-phone-input name="t" default-country="IN" required></nx-phone-input></form>';
    const form = document.querySelector('form')!;
    const el = document.querySelector('nx-phone-input')!;
    expect(el.validity.valueMissing).toBe(true);
    expect(el.validationMessage).toBeTruthy();
    typeInto(el, '98470');
    expect(el.validity.typeMismatch).toBe(true);
    expect(el.validationMessage).toBe('Enter a valid phone number.');
    expect(input(el)).toHaveAttribute('aria-invalid', 'false'); // not while typing
    input(el).blur();
    expect(input(el)).toHaveAttribute('aria-invalid', 'true');
    typeInto(el, '12345');
    expect(el.validity.valid).toBe(true);
    edit(el, '+9');
    input(el).blur();
    expect(el.validity.badInput).toBe(true);
    expect(el.validationMessage).toBe('Enter a valid phone number.');
    expect(input(el).value).toBe('+9');
    expect(form.checkValidity()).toBe(false);
  });

  it('picks a country from the list by keyboard, keeping the national digits', () => {
    const el = mount('<nx-phone-input value="+919847012345" locale="en"></nx-phone-input>');
    const events: string[] = [];
    for (const type of ['input', 'change', 'countrychange']) el.addEventListener(type, () => events.push(type));
    const button = country(el);
    key(button, 'Enter');
    expect(el.open).toBe(true);
    expect(active(el)).toBe('India +91');
    const names = shown(el);
    expect(names.length).toBeGreaterThan(200);
    expect(names.indexOf('Germany +49')).toBeLessThan(names.indexOf('India +91')); // by name
    key(button, 'u');
    now += 50;
    key(button, 'n');
    now += 50;
    key(button, 'i');
    now += 50;
    key(button, 't');
    expect(active(el)).toMatch(/^United Arab Emirates/);
    now += 1000;
    key(button, '+'); // by calling code too
    now += 50;
    key(button, '4');
    now += 50;
    key(button, '4');
    expect(active(el)).toMatch(/\+44$/);
    key(button, 'Enter');
    expect(el.open).toBe(false);
    expect(['GB', 'GG', 'IM', 'JE']).toContain(el.country);
    expect(el.value).toBe('+449847012345');
    expect(events).toEqual(['countrychange', 'input', 'change']);
  });

  it('opens with a click and closes on blur, as a select', async () => {
    const el = mount('<nx-phone-input default-country="AE"></nx-phone-input>');
    await userEvent.click(country(el));
    expect(el.open).toBe(true);
    await userEvent.click(country(el));
    expect(el.open).toBe(false);
    await userEvent.click(country(el));
    country(el).blur();
    expect(el.open).toBe(false);
    await userEvent.click(country(el));
    el.remove(); // leaving the page closes it
    expect(el.open).toBe(false);
    document.body.append(el);
    // Picking the same country, or one for an empty field, changes no value.
    const input = vi.fn();
    el.addEventListener('input', input);
    await userEvent.click(country(el));
    key(country(el), 'Enter');
    expect(input).not.toHaveBeenCalled();
    key(country(el), ' ');
    key(country(el), 'Home');
    key(country(el), 'Enter');
    expect(el.country).not.toBe('AE');
    expect(el.value).toBe('');
    expect(input).not.toHaveBeenCalled();
  });

  it('limits the countries, in their order; one shows as text; numbers from elsewhere stay', () => {
    const el = mount('<nx-phone-input countries="ae, in, xx" locale="en"></nx-phone-input>');
    expect(el.country).toBe('AE'); // en → US is not allowed: the first
    el.shadowRoot!.querySelector<HTMLButtonElement>('button.country')!.click();
    expect(shown(el)).toEqual(['United Arab Emirates +971', 'India +91']);
    el.close();
    expect(el.open).toBe(false);
    edit(el, '+44 20 7946 0958');
    expect(el.country).toBe('AE');
    expect(el.value).toBe('+971442079460958');
    el.countries = 'IN';
    expect(el.country).toBe('IN');
    expect(country(el).hidden).toBe(true);
    expect(only(el).hidden).toBe(false);
    expect(only(el)).toHaveAttribute('aria-label', 'Country code, India +91');
    el.value = '+15555550100'; // not allowed
    expect(el.value).toBe('');
  });

  it('moves to the country attribute, keeping the digits', () => {
    const el = mount('<nx-phone-input value="+14155550100"></nx-phone-input>');
    el.country = 'ca';
    expect(el.country).toBe('CA');
    expect(el.value).toBe('+14155550100');
    el.setAttribute('country', 'IN');
    expect(el.value).toBe('+914155550100');
    el.setAttribute('country', 'nowhere'); // ignored
    expect(el.country).toBe('IN');
    el.value = '';
    el.country = 'GB';
    expect(el.value).toBe('');
    expect(el.country).toBe('GB');
  });

  it('starts on default-country, else the region of the nearest lang, and resets to it', () => {
    document.body.innerHTML = '<form lang="en-IN"><nx-phone-input name="p"></nx-phone-input><nx-phone-input name="q" default-country="SG" value="+6591234567"></nx-phone-input></form>';
    const [a, b] = document.querySelectorAll('nx-phone-input');
    expect(a!.country).toBe('IN');
    expect(b!.defaultCountry).toBe('SG');
    edit(a!, '+1 415 555 0100');
    expect(a!.country).toBe('US');
    edit(b!, '+44 2079460958');
    document.querySelector('form')!.reset();
    expect(a!.country).toBe('IN');
    expect(a!.value).toBe('');
    expect(b!.value).toBe('+6591234567');
    expect(b!.country).toBe('SG');
    b!.defaultCountry = 'MY';
    expect(b!.getAttribute('default-country')).toBe('MY');
    b!.formStateRestoreCallback('+919847012345');
    expect(b!.country).toBe('IN');
  });

  it('submits on Enter, and fires change once on blur', () => {
    document.body.innerHTML = '<form><nx-phone-input name="p" default-country="IN"></nx-phone-input></form>';
    const form = document.querySelector('form')!;
    const submit = vi.fn((e: Event) => e.preventDefault());
    form.addEventListener('submit', submit);
    const el = document.querySelector('nx-phone-input')!;
    const change = vi.fn();
    el.addEventListener('change', change);
    typeInto(el, '9847012345');
    key(input(el), 'Enter');
    expect(submit).toHaveBeenCalledTimes(1);
    expect(change).toHaveBeenCalledTimes(1);
    input(el).blur();
    expect(change).toHaveBeenCalledTimes(1);
    key(input(el), 'Enter', { isComposing: true });
    key(input(el), 'a');
    expect(submit).toHaveBeenCalledTimes(1);
  });

  it('reflects its attributes, and disables the picker when disabled or read-only', () => {
    const el = mount('<nx-phone-input default-country="US"></nx-phone-input>');
    el.placeholder = '98470 12345';
    el.locale = 'de';
    expect(el.getAttribute('locale')).toBe('de');
    expect(input(el).placeholder).toBe('98470 12345');
    expect(country(el).getAttribute('aria-label')).toBe('Country code, Vereinigte Staaten +1');
    el.readOnly = true;
    expect(country(el)).toBeDisabled();
    expect(input(el).readOnly).toBe(true);
    el.readOnly = false;
    el.disabled = true;
    expect(country(el)).toBeDisabled();
    el.locale = 'not a locale!';
    expect(country(el).getAttribute('aria-label')).toBe('Country code, United States +1'); // the runtime's language
  });
});
