import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import './define.js';
import { NxCombobox, type NxOption } from './index.js';

const CITIES = `<option value="ber">Berlin</option>
  <option value="bog">Bogotá</option>
  <option value="lis" disabled>Lisbon</option>
  <option value="mad">Madrid</option>
  <option value="mal">Malmö</option>`;
const mount = (html: string) => {
  document.body.innerHTML = html;
  return document.querySelector('nx-combobox')!;
};
const input = (el: NxCombobox) => el.shadowRoot!.querySelector('input')!;
const toggle = (el: NxCombobox) => el.shadowRoot!.querySelector<HTMLButtonElement>('button.toggle')!;
const listbox = (el: NxCombobox) => el.shadowRoot!.querySelector<HTMLElement>('[role="listbox"]')!;
const status = (el: NxCombobox) => el.shadowRoot!.querySelector<HTMLElement>('[role="status"]')!;
const shown = (el: NxCombobox) => [...el.shadowRoot!.querySelectorAll<HTMLElement>('[role="option"]')].map((o) => o.textContent);
const active = (el: NxCombobox) => {
  const id = input(el).getAttribute('aria-activedescendant');
  return id ? el.shadowRoot!.getElementById(id)!.textContent : null;
};
const key = (el: NxCombobox, k: string, init: KeyboardEventInit = {}) => {
  const e = new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true, composed: true, ...init });
  input(el).dispatchEvent(e);
  return e;
};
/** Empties the field as select-all + Delete would (user-event's clear() can't see focus in a shadow root). */
const clear = (el: NxCombobox) => {
  input(el).focus();
  input(el).value = '';
  input(el).dispatchEvent(new Event('input', { bubbles: true }));
};
/** Types at the end of the field, a key at a time (user-event loses track of a value set from script in a shadow root). */
const typeInto = (el: NxCombobox, text: string) => {
  input(el).focus();
  for (const ch of text) {
    input(el).value += ch;
    input(el).dispatchEvent(new Event('input', { bubbles: true }));
  }
};
const flush = () => new Promise((r) => setTimeout(r, 0));
/** A search whose answers the test releases one by one, in any order. */
const deferredSearch = () => {
  const calls: { query: string; signal: AbortSignal; resolve: (o: NxOption[]) => void; reject: (e: unknown) => void }[] = [];
  const fn = vi.fn((query: string, signal: AbortSignal) => new Promise<NxOption[]>((resolve, reject) => calls.push({ query, signal, resolve, reject })));
  return { fn, calls };
};

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('<nx-combobox>', () => {
  it('is an editable combobox with list autocomplete in a shadow root', () => {
    const el = mount(`<nx-combobox>${CITIES}</nx-combobox>`);
    expect(customElements.get('nx-combobox')).toBe(NxCombobox);
    expect(NxCombobox.formAssociated).toBe(true);
    expect(input(el)).toHaveAttribute('role', 'combobox');
    expect(input(el)).toHaveAttribute('aria-autocomplete', 'list');
    expect(input(el)).toHaveAttribute('aria-expanded', 'false');
    expect(input(el)).toHaveAttribute('aria-controls', listbox(el).id);
    expect(toggle(el)).toHaveAttribute('aria-hidden', 'true');
    expect(toggle(el)).toHaveAttribute('tabindex', '-1');
  });

  it('filters as you type, ignoring case and accents, and says when nothing matches', async () => {
    const el = mount(`<nx-combobox placeholder="City">${CITIES}</nx-combobox>`);
    expect(input(el).placeholder).toBe('City');
    typeInto(el, 'MAL');
    expect(el.open).toBe(true);
    expect(shown(el)).toEqual(['Malmö']);
    clear(el);
    typeInto(el, 'bogota');
    expect(shown(el)).toEqual(['Bogotá']);
    expect(status(el).textContent).toBe('');
    typeInto(el, 'x');
    expect(shown(el)).toEqual([]);
    expect(status(el).textContent).toBe('No results found.');
    expect(el.value).toBe(''); // typing alone doesn't pick
  });

  it('moves with the arrows (aria-activedescendant) and picks with Enter', async () => {
    const el = mount(`<nx-combobox name="city">${CITIES}</nx-combobox>`);
    const events: string[] = [];
    el.addEventListener('input', () => events.push(`input:${el.value}`));
    el.addEventListener('change', () => events.push(`change:${el.value}`));
    input(el).focus();
    key(el, 'ArrowDown');
    expect(el.open).toBe(true);
    expect(active(el)).toBe('Berlin');
    key(el, 'ArrowDown');
    key(el, 'ArrowDown'); // skips the disabled Lisbon
    expect(active(el)).toBe('Madrid');
    key(el, 'ArrowUp');
    expect(active(el)).toBe('Bogotá');
    expect(key(el, 'Enter').defaultPrevented).toBe(true);
    expect(el.value).toBe('bog');
    expect(input(el).value).toBe('Bogotá');
    expect(el.open).toBe(false);
    expect(events).toEqual(['input:bog', 'change:bog']);
    key(el, 'ArrowUp'); // opens on the last
    expect(active(el)).toBe('Malmö');
    key(el, 'ArrowUp', { altKey: true }); // closes
    expect(el.open).toBe(false);
    key(el, 'ArrowDown', { altKey: true }); // opens, nothing active
    expect(el.open).toBe(true);
    expect(active(el)).toBeNull();
    key(el, 'ArrowDown', { altKey: true }); // open: nothing more
    key(el, 'ArrowUp');
    expect(active(el)).toBe('Malmö');
    key(el, 'ArrowDown');
    expect(active(el)).toBe('Malmö'); // stays at the end
    el.close();
    key(el, 'ArrowDown', { altKey: true });
    key(el, 'ArrowDown');
    expect(active(el)).toBe('Berlin');
  });

  it('closes with Escape, then clears the field', async () => {
    const el = mount(`<nx-combobox value="ber">${CITIES}</nx-combobox>`);
    const changes: string[] = [];
    el.addEventListener('change', () => changes.push(el.value));
    input(el).focus();
    key(el, 'ArrowDown');
    expect(key(el, 'Escape').defaultPrevented).toBe(true);
    expect(el.open).toBe(false);
    expect(el.value).toBe('ber');
    expect(key(el, 'Escape').defaultPrevented).toBe(true);
    expect(el.value).toBe('');
    expect(input(el).value).toBe('');
    expect(changes).toEqual(['']);
    expect(key(el, 'Escape').defaultPrevented).toBe(false); // empty: left to the page
    key(el, 'Tab'); // not a combobox key
  });

  it('on blur, picks the option the text names, clears on empty text, else goes back', async () => {
    const el = mount(`<nx-combobox value="ber">${CITIES}</nx-combobox><button>out</button>`);
    await userEvent.click(input(el));
    clear(el);
    typeInto(el, 'madrid ');
    await userEvent.tab();
    expect(el.value).toBe('mad');
    expect(input(el).value).toBe('Madrid');
    await userEvent.click(input(el));
    typeInto(el, 'xyz');
    await userEvent.tab();
    expect(el.value).toBe('mad');
    expect(input(el).value).toBe('Madrid');
    await userEvent.click(input(el));
    clear(el);
    await userEvent.tab();
    expect(el.value).toBe('');
    await userEvent.click(input(el));
    typeInto(el, 'lisbon'); // disabled: not picked by its text
    await userEvent.tab();
    expect(el.value).toBe('');
    expect(input(el).value).toBe('');
  });

  it('picks with the mouse and opens with the toggle button', async () => {
    const el = mount(`<nx-combobox>${CITIES}</nx-combobox>`);
    await userEvent.click(toggle(el));
    expect(el.open).toBe(true);
    expect(el.shadowRoot!.activeElement).toBe(input(el));
    await userEvent.click(el.shadowRoot!.querySelectorAll<HTMLElement>('[role="option"]')[3]!);
    expect(el.value).toBe('mad');
    await userEvent.click(toggle(el));
    await userEvent.click(toggle(el));
    expect(el.open).toBe(false);
  });

  it('allow-custom: the typed text is the value, and posts with the form', async () => {
    document.body.innerHTML = `<form><nx-combobox name="city" allow-custom>${CITIES}</nx-combobox></form>`;
    const el = document.querySelector('nx-combobox')!;
    expect(el.allowCustom).toBe(true);
    const events: string[] = [];
    el.addEventListener('input', () => events.push('input'));
    el.addEventListener('change', () => events.push(`change:${el.value}`));
    typeInto(el, 'Oslo');
    expect(el.value).toBe('Oslo');
    expect(events.filter((e) => e === 'input').length).toBe(4);
    await userEvent.tab();
    expect(events.at(-1)).toBe('change:Oslo');
    expect(new FormData(document.querySelector('form')!).get('city')).toBe('Oslo');
    el.value = 'Anything';
    expect(el.value).toBe('Anything');
    el.allowCustom = false;
    expect(el.hasAttribute('allow-custom')).toBe(false);
    expect(el.value).toBe(''); // not an option
    await userEvent.click(input(el));
    typeInto(el, 'berlin');
    await userEvent.tab(); // an exact label picks the option even with free text off
    expect(el.value).toBe('ber');
  });

  it('submits the form on Enter when the list is closed', async () => {
    document.body.innerHTML = `<form><nx-combobox name="city" allow-custom>${CITIES}</nx-combobox></form>`;
    const form = document.querySelector('form')!;
    const submit = vi.fn((e: Event) => e.preventDefault());
    form.addEventListener('submit', submit);
    const el = document.querySelector('nx-combobox')!;
    input(el).focus();
    key(el, 'Enter');
    expect(submit).toHaveBeenCalledTimes(1);
    typeInto(el, 'Rome'); // opens the list (no matches)
    key(el, 'Enter'); // open: commits, doesn't submit
    expect(submit).toHaveBeenCalledTimes(1);
    expect(el.value).toBe('Rome');
  });

  it('runs an async search, shows only the latest answer and announces its state', async () => {
    const el = mount('<nx-combobox></nx-combobox>');
    const { fn, calls } = deferredSearch();
    el.onsearch = fn;
    expect(el.onsearch).toBe(fn);
    input(el).focus();
    key(el, 'ArrowDown'); // opening searches the empty text
    expect(fn).toHaveBeenLastCalledWith('', expect.any(AbortSignal));
    expect(status(el).textContent).toBe('Searching…');
    expect(listbox(el)).toHaveAttribute('aria-busy', 'true');
    calls[0]!.resolve([{ value: 'a', label: 'Alpha' }]);
    await flush();
    expect(shown(el)).toEqual(['Alpha']);
    expect(listbox(el)).toHaveAttribute('aria-busy', 'false');
    expect(status(el).textContent).toBe('');

    typeInto(el, 'b');
    typeInto(el, 'e');
    expect(calls.map((c) => c.query)).toEqual(['', 'b', 'be']);
    expect(calls[1]!.signal.aborted).toBe(true); // superseded
    // The newer answer first, then the stale one: the stale one is dropped.
    calls[2]!.resolve([{ value: 'ber', label: 'Berlin' }]);
    await flush();
    calls[1]!.resolve([{ value: 'bog', label: 'Bogotá' }]);
    await flush();
    expect(shown(el)).toEqual(['Berlin']);
    key(el, 'ArrowDown');
    key(el, 'Enter');
    expect(el.value).toBe('ber');
    expect(el.selectedOption).toEqual({ value: 'ber', label: 'Berlin' });

    // A later search that no longer lists it keeps the label.
    typeInto(el, 'x');
    calls[3]!.resolve([]);
    await flush();
    expect(status(el).textContent).toBe('No results found.');
    calls.length = 0;
    key(el, 'Escape');
    await userEvent.tab();
    expect(input(el).value).toBe('Berlin');

    // A failed search says so.
    input(el).focus();
    typeInto(el, 'z');
    calls.at(-1)!.reject(new Error('offline'));
    await flush();
    expect(status(el).textContent).toBe('Search failed. Try again.');
    expect(shown(el)).toEqual([]);
  });

  it('keeps any value while a search is set, and shows the value itself until its label is known', () => {
    const el = mount('<nx-combobox value="u-42"></nx-combobox>');
    el.onsearch = async () => [];
    el.value = 'u-7';
    expect(el.value).toBe('u-7');
    expect(input(el).value).toBe('u-7');
    el.onsearch = null;
    expect(el.onsearch).toBeNull();
  });

  it('does not open or edit when read-only or disabled', async () => {
    const el = mount(`<nx-combobox value="ber" readonly>${CITIES}</nx-combobox>`);
    expect(input(el).readOnly).toBe(true);
    key(el, 'ArrowDown');
    expect(el.open).toBe(false);
    expect(key(el, 'Escape').defaultPrevented).toBe(false);
    expect(el.value).toBe('ber');
    expect(toggle(el)).toBeDisabled();
    el.readOnly = false;
    el.disabled = true;
    expect(input(el)).toBeDisabled();
    el.show();
    expect(el.open).toBe(false);
  });

  it('is required, resets to the value attribute, and restores state', async () => {
    document.body.innerHTML = `<form><nx-combobox name="c" value="mad" required>${CITIES}</nx-combobox></form>`;
    const form = document.querySelector('form')!;
    const el = document.querySelector('nx-combobox')!;
    expect(input(el).value).toBe('Madrid');
    await userEvent.click(input(el));
    clear(el);
    expect(el.open).toBe(true);
    form.reset();
    expect(el.open).toBe(false);
    expect(el.value).toBe('mad');
    expect(input(el).value).toBe('Madrid');
    el.value = '';
    expect(el.validity.valueMissing).toBe(true);
    expect(form.checkValidity()).toBe(false);
    expect(input(el)).toHaveAttribute('aria-invalid', 'true');
    el.formStateRestoreCallback('ber');
    expect(input(el).value).toBe('Berlin');
  });

  it('ignores keys while composing text (IME)', () => {
    const el = mount(`<nx-combobox>${CITIES}</nx-combobox>`);
    key(el, 'ArrowDown', { isComposing: true });
    expect(el.open).toBe(false);
  });
});
