import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import './define.js';
import { NxSelect } from './index.js';

const FRUIT = `<option value="apple">Apple</option>
  <option value="banana">Banana</option>
  <option value="blueberry" disabled>Blueberry</option>
  <option value="cherry">Cherry</option>
  <option value="coconut">Coconut</option>`;
const mount = (html: string) => {
  document.body.innerHTML = html;
  return document.querySelector('nx-select')!;
};
const trigger = (el: NxSelect) => el.shadowRoot!.querySelector<HTMLButtonElement>('button.trigger')!;
const listbox = (el: NxSelect) => el.shadowRoot!.querySelector<HTMLElement>('[role="listbox"]')!;
const popup = (el: NxSelect) => el.shadowRoot!.querySelector<HTMLElement>('.popup')!;
const options = (el: NxSelect) => [...el.shadowRoot!.querySelectorAll<HTMLElement>('[role="option"]')];
const active = (el: NxSelect) => {
  const id = trigger(el).getAttribute('aria-activedescendant');
  return id ? el.shadowRoot!.getElementById(id)!.textContent : null;
};
const key = (el: NxSelect, k: string, init: KeyboardEventInit = {}) => {
  const e = new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true, composed: true, ...init });
  trigger(el).dispatchEvent(e);
  return e;
};
const tick = () => new Promise((r) => setTimeout(r, 0));

let now = 1_000_000;
beforeEach(() => {
  document.body.innerHTML = '';
  // Type-ahead groups keys by time; each test moves the clock itself.
  now += 10_000;
  vi.spyOn(Date, 'now').mockImplementation(() => now);
});
afterEach(() => vi.restoreAllMocks());

describe('<nx-select>', () => {
  it('is registered and form-associated, a select-only combobox in a shadow root', () => {
    const el = mount(`<nx-select>${FRUIT}</nx-select>`);
    expect(customElements.get('nx-select')).toBe(NxSelect);
    expect(NxSelect.formAssociated).toBe(true);
    const t = trigger(el);
    expect(t).toHaveAttribute('role', 'combobox');
    expect(t).toHaveAttribute('aria-haspopup', 'listbox');
    expect(t).toHaveAttribute('aria-expanded', 'false');
    expect(t).toHaveAttribute('aria-controls', listbox(el).id);
    expect(t).toHaveAttribute('part', 'trigger');
    expect(popup(el).hidden).toBe(true);
    expect(el.shadowRoot!.adoptedStyleSheets.length).toBe(2);
  });

  it('reads child options and optgroups, and shows the placeholder when empty', () => {
    const el = mount(`<nx-select placeholder="Pick a fruit">
      <optgroup label="Red"><option value="cherry">Cherry</option><option label="Strawberry">berry</option></optgroup>
      <optgroup label="Old" disabled><option>Quince</option></optgroup>
      <option value="x">Loose</option>
    </nx-select>`);
    expect(el.options).toEqual([
      { value: 'cherry', label: 'Cherry', disabled: false, group: 'Red' },
      { value: 'berry', label: 'Strawberry', disabled: false, group: 'Red' },
      { value: 'Quince', label: 'Quince', disabled: true, group: 'Old' },
      { value: 'x', label: 'Loose', disabled: false, group: undefined },
    ]);
    expect(trigger(el).textContent).toBe('Pick a fruit');
    expect(trigger(el)).toHaveAttribute('data-placeholder');
    el.show();
    const groups = listbox(el).querySelectorAll('[role="group"]');
    expect(groups.length).toBe(2);
    expect(el.shadowRoot!.getElementById(groups[0]!.getAttribute('aria-labelledby')!)!.textContent).toBe('Red');
    expect(options(el).map((o) => o.textContent)).toEqual(['Cherry', 'Strawberry', 'Quince', 'Loose']);
    expect(options(el)[2]).toHaveAttribute('aria-disabled', 'true');
  });

  it('uses "Select…" from @nexub/core when there is no placeholder', () => {
    const el = mount(`<nx-select>${FRUIT}</nx-select>`);
    expect(trigger(el).textContent).toBe('Select…');
    el.placeholder = 'Fruit';
    expect(el.getAttribute('placeholder')).toBe('Fruit');
    expect(trigger(el).textContent).toBe('Fruit');
  });

  it('takes options from the property (with descriptions), and goes back to the children with null', async () => {
    const el = mount(`<nx-select value="apple">${FRUIT}</nx-select>`);
    el.options = [
      { value: 'apple', label: 'Apple', description: 'Red or green' },
      { value: 'pear', label: 'Pear' },
    ];
    expect(el.value).toBe('apple');
    el.show();
    const first = options(el)[0]!;
    expect(first).toHaveAttribute('aria-selected', 'true');
    expect(el.shadowRoot!.getElementById(first.getAttribute('aria-describedby')!)!.textContent).toBe('Red or green');
    el.value = 'banana'; // not in the property's options
    expect(el.value).toBe('');
    el.options = null;
    expect(el.options.map((o) => o.value)).toContain('banana');
    // Child changes are picked up.
    el.insertAdjacentHTML('beforeend', '<option value="date">Date</option>');
    await tick();
    expect(el.options.at(-1)).toMatchObject({ value: 'date', label: 'Date' });
    expect(options(el).at(-1)!.textContent).toBe('Date'); // open: redrawn
  });

  it('treats the value attribute (else <option selected>) as the default, and an unknown value as none', async () => {
    const el = mount(`<nx-select>${FRUIT.replace('value="cherry"', 'value="cherry" selected')}</nx-select>`);
    expect(el.value).toBe('cherry');
    expect(el.selectedOption?.label).toBe('Cherry');
    expect(trigger(el).textContent).toBe('Cherry');
    el.setAttribute('value', 'banana');
    expect(el.value).toBe('banana');
    el.removeAttribute('value');
    expect(el.value).toBe('cherry');
    el.value = 'kiwi';
    expect(el.value).toBe('');
    // No options yet (set later from script): the value waits for them.
    const late = document.createElement('nx-select');
    late.value = 'b';
    document.body.append(late);
    expect(late.value).toBe('b');
    late.options = [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }];
    expect(late.value).toBe('b');
    expect(trigger(late).textContent).toBe('B');
    await tick();
  });

  it('posts its value, resets, restores state and is valueMissing when required', () => {
    document.body.innerHTML = `<form>
      <nx-select name="fruit" value="apple" required>${FRUIT}</nx-select>
      <nx-select name="off" value="apple" disabled>${FRUIT}</nx-select>
    </form>`;
    const form = document.querySelector('form')!;
    const el = document.querySelector('nx-select')!;
    expect(new FormData(form).get('fruit')).toBe('apple');
    expect(new FormData(form).get('off')).toBeNull();
    el.value = '';
    expect(el.validity.valueMissing).toBe(true);
    expect(el.validationMessage).toBeTruthy();
    expect(trigger(el)).toHaveAttribute('aria-invalid', 'false'); // not shown until touched or submitted
    expect(form.checkValidity()).toBe(false);
    expect(trigger(el)).toHaveAttribute('aria-invalid', 'true');
    expect(trigger(el)).toHaveAttribute('aria-required', 'true');
    form.reset();
    expect(el.value).toBe('apple');
    expect(el.validity.valid).toBe(true);
    el.formStateRestoreCallback('cherry');
    expect(el.value).toBe('cherry');
  });

  it('opens with the keyboard on the picked option and picks with Enter', () => {
    const el = mount(`<nx-select value="banana">${FRUIT}</nx-select>`);
    const events: string[] = [];
    el.addEventListener('input', () => events.push(`input:${el.value}`));
    el.addEventListener('change', () => events.push(`change:${el.value}`));
    expect(key(el, 'ArrowDown').defaultPrevented).toBe(true);
    expect(el.open).toBe(true);
    expect(trigger(el)).toHaveAttribute('aria-expanded', 'true');
    expect(active(el)).toBe('Banana');
    key(el, 'ArrowDown'); // skips the disabled Blueberry
    expect(active(el)).toBe('Cherry');
    key(el, 'ArrowUp');
    expect(active(el)).toBe('Banana');
    key(el, 'End');
    expect(active(el)).toBe('Coconut');
    key(el, 'ArrowDown'); // stays at the end
    expect(active(el)).toBe('Coconut');
    key(el, 'Home');
    expect(active(el)).toBe('Apple');
    key(el, 'PageDown');
    expect(active(el)).toBe('Coconut');
    key(el, 'PageUp');
    expect(active(el)).toBe('Apple');
    key(el, 'Enter');
    expect(el.open).toBe(false);
    expect(trigger(el)).not.toHaveAttribute('aria-activedescendant');
    expect(el.value).toBe('apple');
    expect(events).toEqual(['input:apple', 'change:apple']);
    key(el, 'Enter'); // opens again
    key(el, 'Enter'); // the same option: no events
    expect(events.length).toBe(2);
  });

  it('opens on Home, End, Arrow Up and Space; Escape closes without picking', () => {
    const el = mount(`<nx-select>${FRUIT}</nx-select>`);
    key(el, 'End');
    expect(active(el)).toBe('Coconut');
    const esc = key(el, 'Escape');
    expect(esc.defaultPrevented).toBe(true);
    expect(el.open).toBe(false);
    expect(el.value).toBe('');
    key(el, 'Home');
    expect(active(el)).toBe('Apple');
    el.close();
    key(el, 'ArrowUp'); // nothing picked: the first
    expect(active(el)).toBe('Apple');
    el.close();
    key(el, ' ');
    expect(el.open).toBe(true);
    key(el, ' '); // Space picks when no type-ahead is running
    expect(el.value).toBe('apple');
    key(el, 'Escape'); // closed: left to the page
    key(el, 'Shift'); // not a select key
    expect(el.open).toBe(false);
  });

  it('picks by type-ahead while closed, as a native select, and moves by it while open', () => {
    const el = mount(`<nx-select>${FRUIT}</nx-select>`);
    const changes: string[] = [];
    el.addEventListener('change', () => changes.push(el.value));
    key(el, 'c');
    expect(el.value).toBe('cherry');
    expect(el.open).toBe(false);
    now += 100;
    key(el, 'c'); // the same key again: the next one starting with it
    expect(el.value).toBe('coconut');
    now += 100;
    key(el, 'c'); // wraps around
    expect(el.value).toBe('cherry');
    now += 1000;
    key(el, 'z'); // no match: nothing
    expect(el.value).toBe('cherry');
    expect(changes).toEqual(['cherry', 'coconut', 'cherry']);

    now += 1000;
    key(el, 'ArrowDown');
    key(el, 'b'); // Blueberry is disabled
    expect(active(el)).toBe('Banana');
    now += 100;
    key(el, 'a'); // "ba"
    expect(active(el)).toBe('Banana');
    now += 1000;
    key(el, 'q'); // nothing: stays
    expect(active(el)).toBe('Banana');
    now += 1000;
    key(el, 'C');
    now += 100;
    key(el, 'o');
    expect(active(el)).toBe('Coconut');
    key(el, 'ArrowUp', { altKey: true }); // picks
    expect(el.value).toBe('coconut');
    expect(el.open).toBe(false);
  });

  it('adds a space to a running type-ahead instead of picking', () => {
    const el = mount('<nx-select><option>New Delhi</option><option>New York</option><option>Newark</option></nx-select>');
    key(el, 'ArrowDown');
    for (const k of 'new y') {
      key(el, k);
      now += 50;
    }
    expect(active(el)).toBe('New York');
    expect(el.open).toBe(true);
    now += 1000;
    key(el, 'x', { ctrlKey: true }); // not printable
    expect(el.open).toBe(true);
  });

  it('picks the active option on Tab without stopping focus, and closes with nothing active', () => {
    const el = mount(`<nx-select>${FRUIT}</nx-select>`);
    key(el, 'ArrowDown');
    key(el, 'ArrowDown');
    const tab = key(el, 'Tab');
    expect(tab.defaultPrevented).toBe(false);
    expect(el.value).toBe('banana');
    el.options = [];
    el.show();
    key(el, 'Enter');
    expect(el.open).toBe(false);
  });

  it('opens and picks with the mouse, and closes on a press outside or on blur', async () => {
    const el = mount(`<nx-select>${FRUIT}</nx-select><button id="out">out</button>`);
    await userEvent.click(trigger(el));
    expect(el.open).toBe(true);
    expect(trigger(el)).toHaveAttribute('aria-activedescendant', options(el)[0]!.id);
    options(el)[3]!.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
    expect(active(el)).toBe('Cherry');
    options(el)[2]!.dispatchEvent(new MouseEvent('mousemove', { bubbles: true })); // disabled: not highlighted
    expect(active(el)).toBe('Cherry');
    await userEvent.click(options(el)[2]!); // disabled: nothing
    expect(el.open).toBe(true);
    await userEvent.click(options(el)[3]!);
    expect(el.value).toBe('cherry');
    expect(el.open).toBe(false);
    expect(el.shadowRoot!.activeElement).toBe(trigger(el)); // focus stayed on the field
    await userEvent.click(trigger(el));
    await userEvent.click(trigger(el)); // toggles shut
    expect(el.open).toBe(false);
    await userEvent.click(trigger(el));
    document.getElementById('out')!.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, composed: true }));
    expect(el.open).toBe(false);
    await userEvent.click(trigger(el));
    popup(el).dispatchEvent(new MouseEvent('mousedown', { bubbles: true, composed: true })); // inside: stays
    expect(el.open).toBe(true);
    trigger(el).blur();
    expect(el.open).toBe(false);
  });

  it('cannot open or change when read-only or disabled', async () => {
    const el = mount(`<nx-select value="apple" readonly>${FRUIT}</nx-select>`);
    expect(trigger(el)).toHaveAttribute('aria-readonly', 'true');
    expect(key(el, 'ArrowDown').defaultPrevented).toBe(true);
    key(el, 'b');
    expect(key(el, 'Tab').defaultPrevented).toBe(false);
    await userEvent.click(trigger(el));
    expect(el.open).toBe(false);
    expect(el.value).toBe('apple');
    el.readOnly = false;
    expect(trigger(el)).toHaveAttribute('aria-readonly', 'false');
    el.disabled = true;
    expect(trigger(el)).toBeDisabled();
    el.show();
    expect(el.open).toBe(false);
  });

  it('shows invalid when asked, and names the field and its list from the label', async () => {
    document.body.innerHTML = `<label for="f">Fruit</label><nx-select id="f" invalid>${FRUIT}</nx-select>`;
    await Promise.resolve();
    const el = document.querySelector('nx-select')!;
    expect(el.invalid).toBe(true);
    expect(trigger(el)).toHaveAttribute('aria-invalid', 'true');
    expect(trigger(el)).toHaveAttribute('aria-label', 'Fruit');
    el.show();
    expect(listbox(el)).toHaveAttribute('aria-label', 'Fruit');
    el.invalid = false;
    expect(trigger(el)).toHaveAttribute('aria-invalid', 'false');
    el.removeAttribute('id');
    el.setAttribute('aria-label', '');
    el.close();
    el.show();
    expect(listbox(el)).not.toHaveAttribute('aria-label');
    el.focus();
    expect(el.shadowRoot!.activeElement).toBe(trigger(el));
  });

  it('places the list under the field at its width, from the right in a right-to-left page', () => {
    document.body.innerHTML = `<div dir="rtl"><nx-select>${FRUIT}</nx-select></div>`;
    const el = document.querySelector('nx-select')!;
    el.shadowRoot!.querySelector<HTMLElement>('.field')!.getBoundingClientRect = () => ({ left: 20, right: 220, top: 10, bottom: 50 }) as DOMRect;
    el.show();
    const style = popup(el).style;
    expect(style.getPropertyValue('--nx-top')).toBe('54px');
    expect(style.getPropertyValue('--nx-width')).toBe('200px');
    expect(style.getPropertyValue('--nx-start')).toBe(`${innerWidth - 220}px`); // jsdom: 1024 wide
    // No room below: above the field.
    Object.defineProperty(popup(el), 'offsetHeight', { configurable: true, value: 300 });
    el.shadowRoot!.querySelector<HTMLElement>('.field')!.getBoundingClientRect = () => ({ left: 20, right: 220, top: 600, bottom: 640 }) as DOMRect;
    window.dispatchEvent(new Event('resize'));
    expect(style.getPropertyValue('--nx-top')).toBe('296px');
    el.closest('div')!.dir = 'ltr';
    window.dispatchEvent(new Event('scroll'));
    expect(style.getPropertyValue('--nx-start')).toBe('20px');
    el.close();
  });

  it('closes its list when it leaves the page', () => {
    const el = mount(`<nx-select>${FRUIT}</nx-select>`);
    el.show();
    el.remove();
    expect(el.open).toBe(false);
  });

  it('upgrades properties set before the tag was defined', () => {
    const el = document.createElement('x-select-late') as NxSelect;
    el.options = [{ value: 'a', label: 'A' }];
    el.value = 'a';
    document.body.append(el);
    customElements.define('x-select-late', class extends NxSelect {});
    expect(el.value).toBe('a');
    expect(trigger(el).textContent).toBe('A');
  });
});
