import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import './define.js';
import { NxNumberInput } from './index.js';

const mount = (html: string) => {
  document.body.innerHTML = html;
  return document.querySelector('nx-number-input')!;
};
const inner = (el: NxNumberInput) => el.shadowRoot!.querySelector('input')!;

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('<nx-number-input>', () => {
  it('is registered once and is form-associated', async () => {
    expect(customElements.get('nx-number-input')).toBe(NxNumberInput);
    expect(NxNumberInput.formAssociated).toBe(true);
    await import('./define.js'); // a second load doesn't throw
  });

  it('renders a spinbutton with the value range in a shadow root with adopted styles', () => {
    const el = mount('<nx-number-input value="5" min="0" max="10"></nx-number-input>');
    const input = inner(el);
    expect(input).toHaveAttribute('role', 'spinbutton');
    expect(input).toHaveAttribute('inputmode', 'decimal');
    expect(input).toHaveAttribute('part', 'input');
    expect(input).toHaveAttribute('aria-valuenow', '5');
    expect(input).toHaveAttribute('aria-valuemin', '0');
    expect(input).toHaveAttribute('aria-valuemax', '10');
    expect(input.value).toBe('5');
    expect(el.shadowRoot!.adoptedStyleSheets.length).toBe(1);
  });

  it('reflects attributes and properties both ways', () => {
    const el = mount('<nx-number-input></nx-number-input>');
    el.name = 'age';
    el.min = '1';
    el.max = '9';
    el.step = 'any';
    el.placeholder = 'Age';
    el.size = 'lg';
    el.required = true;
    el.disabled = true;
    el.readOnly = true;
    expect(el.getAttribute('name')).toBe('age');
    expect(el.getAttribute('min')).toBe('1');
    expect(el.getAttribute('max')).toBe('9');
    expect(el.getAttribute('step')).toBe('any');
    expect(el.getAttribute('size')).toBe('lg');
    expect(el.hasAttribute('required')).toBe(true);
    expect(el.hasAttribute('disabled')).toBe(true);
    expect(el.hasAttribute('readonly')).toBe(true);
    expect(inner(el).placeholder).toBe('Age');
    expect(inner(el).disabled).toBe(true);
    expect(inner(el).readOnly).toBe(true);
    expect(inner(el)).toHaveAttribute('aria-required', 'true');
    el.required = false;
    el.disabled = false;
    el.readOnly = false;
    expect(el.hasAttribute('required')).toBe(false);
    expect(el.disabled).toBe(false);
    expect(el.readOnly).toBe(false);
    el.setAttribute('size', 'sm');
    expect(el.size).toBe('sm');
    el.setAttribute('size', 'huge');
    expect(el.size).toBe('md');
    expect(el.min).toBe('1');
    expect(el.max).toBe('9');
    expect(el.step).toBe('any');
    expect(el.placeholder).toBe('Age');
    expect(el.name).toBe('age');
  });

  it('treats the value attribute as the default and the property as the current value', () => {
    const el = mount('<nx-number-input value="3"></nx-number-input>');
    expect(el.value).toBe('3');
    expect(el.defaultValue).toBe('3');
    el.setAttribute('value', '4');
    expect(el.value).toBe('4'); // not dirty yet: follows the attribute
    el.value = '7';
    el.setAttribute('value', '8');
    expect(el.value).toBe('7');
    el.defaultValue = '9';
    expect(el.getAttribute('value')).toBe('9');
    expect(el.valueAsNumber).toBe(7);
    el.valueAsNumber = 2.5;
    expect(el.value).toBe('2.5');
    el.valueAsNumber = NaN;
    expect(el.value).toBe('');
    expect(el.valueAsNumber).toBeNaN();
  });

  it('sanitises a value that is not a number to empty', () => {
    const el = mount('<nx-number-input value="abc"></nx-number-input>');
    expect(el.value).toBe('');
    el.value = '1,5';
    expect(el.value).toBe('1.5');
  });

  it('posts its value with the form, and nothing for an empty name or when disabled', () => {
    document.body.innerHTML = `<form>
      <nx-number-input name="age" value="42"></nx-number-input>
      <nx-number-input value="1"></nx-number-input>
      <nx-number-input name="off" value="2" disabled></nx-number-input>
      <nx-number-input name="empty"></nx-number-input>
    </form>`;
    const data = new FormData(document.querySelector('form')!);
    expect(data.get('age')).toBe('42');
    expect(data.get('off')).toBeNull();
    expect(data.get('empty')).toBe('');
    expect([...data.keys()]).toEqual(['age', 'empty']);
  });

  it('resets to the value attribute on form.reset()', async () => {
    document.body.innerHTML = '<form><nx-number-input name="n" value="5"></nx-number-input></form>';
    const el = document.querySelector('nx-number-input')!;
    await userEvent.type(inner(el), '{Backspace}12');
    expect(el.value).toBe('12');
    document.querySelector('form')!.reset();
    expect(el.value).toBe('5');
    expect(inner(el).value).toBe('5');
    expect(new FormData(document.querySelector('form')!).get('n')).toBe('5');
  });

  it('keeps a half-typed value while focused and rejects letters', async () => {
    const el = mount('<nx-number-input></nx-number-input>');
    const input = inner(el);
    await userEvent.type(input, '-');
    expect(input.value).toBe('-');
    expect(el.value).toBe('');
    expect(el.validity.badInput).toBe(true);
    await userEvent.type(input, '2.');
    expect(input.value).toBe('-2.');
    expect(el.value).toBe('-2');
    await userEvent.type(input, '5');
    expect(el.value).toBe('-2.5');
    await userEvent.tab();
    expect(input.value).toBe('-2.5');
    expect(el.validity.valid).toBe(true);
  });

  it('puts back what was there when a letter or a second point is typed', () => {
    const el = mount('<nx-number-input value="1.5"></nx-number-input>');
    const input = inner(el);
    const events = vi.fn();
    el.addEventListener('input', events);
    input.focus();
    input.value = '1.x5';
    input.setSelectionRange(3, 3);
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    expect(input.value).toBe('1.5');
    expect(input.selectionStart).toBe(2);
    expect(el.value).toBe('1.5');
    expect(events).not.toHaveBeenCalled();
  });

  it('can be emptied: value is "" and the change event says so', async () => {
    const el = mount('<nx-number-input value="8"></nx-number-input>');
    const change = vi.fn();
    const input = vi.fn();
    el.addEventListener('change', () => change(el.value));
    el.addEventListener('input', () => input(el.value));
    await userEvent.type(inner(el), '{Backspace}');
    await userEvent.tab();
    expect(el.value).toBe('');
    expect(input).toHaveBeenLastCalledWith('');
    expect(change).toHaveBeenCalledWith('');
    expect(change).toHaveBeenCalledTimes(1);
  });

  it('applies min and max on blur, never while typing', async () => {
    const el = mount('<nx-number-input min="15" max="40"></nx-number-input>');
    const input = inner(el);
    await userEvent.type(input, '3');
    expect(el.value).toBe('3'); // on its way to 30
    expect(el.validity.rangeUnderflow).toBe(true);
    expect(input).toHaveAttribute('aria-invalid', 'false'); // not shown while typing
    await userEvent.type(input, '0');
    expect(el.value).toBe('30');
    await userEvent.type(input, '0');
    await userEvent.tab();
    expect(el.value).toBe('40');
    expect(input.value).toBe('40');
  });

  it('steps with the keyboard like the React field', async () => {
    const el = mount('<nx-number-input value="10" min="0" max="100" step="5"></nx-number-input>');
    const change = vi.fn();
    el.addEventListener('change', () => change(el.value));
    inner(el).focus();
    await userEvent.keyboard('{ArrowUp}');
    expect(el.value).toBe('15');
    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    expect(el.value).toBe('5');
    await userEvent.keyboard('{PageUp}');
    expect(el.value).toBe('55');
    await userEvent.keyboard('{PageDown}');
    expect(el.value).toBe('5');
    await userEvent.keyboard('{End}');
    expect(el.value).toBe('100');
    expect(inner(el).value).toBe('100');
    await userEvent.keyboard('{ArrowUp}'); // at max: no change, no event
    await userEvent.keyboard('{Home}');
    expect(el.value).toBe('0');
    expect(change.mock.calls.map((c) => c[0])).toEqual(['15', '10', '5', '55', '5', '100', '0']);
    await userEvent.tab();
    expect(change).toHaveBeenCalledTimes(7); // the blur doesn't fire it again
  });

  it('steps an empty field to 0, or to min, and "any" by 1', async () => {
    const el = mount('<nx-number-input step="any"></nx-number-input>');
    inner(el).focus();
    await userEvent.keyboard('{ArrowUp}');
    expect(el.value).toBe('0');
    await userEvent.keyboard('{ArrowUp}');
    expect(el.value).toBe('1');
    el.value = '';
    el.min = '3';
    await userEvent.keyboard('{ArrowDown}');
    expect(el.value).toBe('3');
    el.step = 'nonsense';
    await userEvent.keyboard('{ArrowUp}');
    expect(el.value).toBe('4');
  });

  it('does not step when read-only or disabled', async () => {
    const el = mount('<nx-number-input value="1" readonly></nx-number-input>');
    inner(el).focus();
    await userEvent.keyboard('{ArrowUp}{PageUp}');
    expect(el.value).toBe('1');
    el.readOnly = false;
    el.formDisabledCallback(true);
    expect(inner(el).disabled).toBe(true);
    inner(el).dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    expect(el.value).toBe('1');
    el.formDisabledCallback(false);
    expect(inner(el).disabled).toBe(false);
  });

  it('is valueMissing when required and empty, and shows it after a failed submit', () => {
    document.body.innerHTML = '<form><nx-number-input name="n" required></nx-number-input></form>';
    const el = document.querySelector('nx-number-input')!;
    const form = document.querySelector('form')!;
    const submit = vi.fn((e: Event) => e.preventDefault());
    form.addEventListener('submit', submit);
    expect(el.validity.valueMissing).toBe(true);
    expect(el.validationMessage).not.toBe('');
    expect(el.willValidate).toBe(true);
    expect(el.checkValidity()).toBe(false);
    expect(inner(el)).toHaveAttribute('aria-invalid', 'true');
    expect(el.shadowRoot!.querySelector('.field')).toHaveAttribute('data-invalid');
    form.requestSubmit();
    expect(submit).not.toHaveBeenCalled();
    el.value = '3';
    expect(el.reportValidity()).toBe(true);
    form.requestSubmit();
    expect(submit).toHaveBeenCalledTimes(1);
  });

  it('reports range errors for a value set out of range, but not when read-only', () => {
    const el = mount('<nx-number-input min="10" max="20" value="5"></nx-number-input>');
    expect(el.validity.rangeUnderflow).toBe(true);
    expect(el.validationMessage).not.toBe('');
    el.value = '25';
    expect(el.validity.rangeOverflow).toBe(true);
    el.readOnly = true;
    expect(el.validity.valid).toBe(true);
  });

  it('falls back to English messages where the browser has none', () => {
    const spy = vi.spyOn(HTMLInputElement.prototype, 'validationMessage', 'get').mockReturnValue('');
    try {
      const el = mount('<nx-number-input min="10" max="20" value="5" required></nx-number-input>');
      expect(el.validationMessage).toBe('Value must be 10 or more.');
      el.value = '25';
      expect(el.validationMessage).toBe('Value must be 20 or less.');
      el.value = '';
      expect(el.validationMessage).toBe('Fill out this field.');
    } finally {
      spy.mockRestore();
    }
  });

  it('submits the form on Enter, after applying min and max', async () => {
    document.body.innerHTML = '<form><nx-number-input name="n" max="10"></nx-number-input></form>';
    const el = document.querySelector('nx-number-input')!;
    const form = document.querySelector('form')!;
    const values: (string | null)[] = [];
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      values.push(new FormData(form).get('n') as string);
    });
    await userEvent.type(inner(el), '50{Enter}');
    expect(values).toEqual(['10']);
    expect(inner(el).value).toBe('10');
  });

  it('names the inner input from its label or aria-label, and focus() reaches it', async () => {
    document.body.innerHTML = '<label for="age">Age</label><nx-number-input id="age"></nx-number-input>';
    const el = document.querySelector('nx-number-input')!;
    await Promise.resolve();
    expect(inner(el)).toHaveAttribute('aria-label', 'Age');
    el.setAttribute('aria-label', 'Your age');
    expect(inner(el)).toHaveAttribute('aria-label', 'Your age');
    el.focus();
    expect(el.shadowRoot!.activeElement).toBe(inner(el));
    el.blur();
    expect(el.shadowRoot!.activeElement).toBeNull();
    document.body.innerHTML = '<label>Count <nx-number-input></nx-number-input></label>';
    await Promise.resolve();
    expect(inner(document.querySelector('nx-number-input')!)).toHaveAttribute('aria-label', 'Count');
    document.body.innerHTML = '<nx-number-input></nx-number-input>';
    await Promise.resolve();
    expect(inner(document.querySelector('nx-number-input')!)).not.toHaveAttribute('aria-label');
  });

  it('restores state from the browser', () => {
    const el = mount('<nx-number-input></nx-number-input>');
    el.formStateRestoreCallback('12');
    expect(el.value).toBe('12');
    el.formStateRestoreCallback(null);
    expect(el.value).toBe('12');
  });

  it('does not let the inner input event escape unless the value changed', async () => {
    const el = mount('<nx-number-input></nx-number-input>');
    const input = vi.fn();
    el.addEventListener('input', input);
    await userEvent.type(inner(el), '-');
    expect(input).not.toHaveBeenCalled();
    await userEvent.type(inner(el), '1');
    expect(input).toHaveBeenCalledTimes(1);
  });
});
