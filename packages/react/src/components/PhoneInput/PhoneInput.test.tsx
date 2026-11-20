import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { COUNTRIES, formatNational, isValidPhone, parsePhone, toE164 } from '@nexub/core';
import { PhoneInput } from './PhoneInput.js';
import { FormField } from '../FormField/FormField.js';

const field = () => screen.getByRole('textbox') as HTMLInputElement;
// No pause between keystrokes: under a loaded full-suite run the default delay let a long
// type() outlive the 5s timeout and leak keys into the next test.
const type = (el: HTMLElement, text: string) => userEvent.setup({ delay: null }).type(el, text);

describe('phone helpers', () => {
  it('knows the calling codes, each country once', () => {
    expect(Object.keys(COUNTRIES).length).toBeGreaterThan(235);
    expect([COUNTRIES.IN, COUNTRIES.AE, COUNTRIES.SA, COUNTRIES.QA, COUNTRIES.US, COUNTRIES.CA, COUNTRIES.GB, COUNTRIES.SG]).toEqual(['91', '971', '966', '974', '1', '1', '44', '65']);
    // Prefix-free, so a number has one possible calling code.
    const codes = [...new Set(Object.values(COUNTRIES))];
    expect(codes.filter((a) => codes.some((b) => a !== b && b.startsWith(a)))).toEqual([]);
  });

  it('groups partial input without throwing', () => {
    expect(formatNational('9847012345', 'IN')).toBe('98470 12345');
    expect(formatNational('98470', 'IN')).toBe('98470');
    expect(formatNational('4155550132', 'US')).toBe('415 555 0132');
    expect(formatNational('1234567', 'BR')).toBe('123 4567');
    expect(formatNational('', 'IN')).toBe('');
    expect(formatNational('12ab', '??')).toBe('12');
  });

  it('parses pasted forms', () => {
    expect(parsePhone('+971 50 123 4567', 'IN')).toEqual({ country: 'AE', national: '501234567', e164: '+971501234567', valid: true });
    expect(parsePhone('0091 98470-12345', 'US').e164).toBe('+919847012345');
    expect(parsePhone('098470 12345', 'IN').national).toBe('9847012345');
    // Shared calling code: the current country stays.
    expect(parsePhone('+1 (415) 555-0132', 'CA').country).toBe('CA');
    expect(parsePhone('+1 (415) 555-0132', 'IN').country).toBe('US');
    expect(parsePhone('', 'IN')).toEqual({ country: 'IN', national: '', e164: '', valid: false });
  });

  it('checks plausibility only', () => {
    expect(toE164('', 'IN')).toBe('');
    expect(isValidPhone('+919847012345')).toBe(true);
    expect(isValidPhone('+91984')).toBe(false);
    expect(isValidPhone('+5511987654321')).toBe(true);
    expect(isValidPhone('9847012345')).toBe(false);
  });
});

describe('PhoneInput', () => {
  it('groups as you type and reports E.164 with the valid flag', async () => {
    const onValueChange = vi.fn();
    render(<PhoneInput aria-label="Phone" defaultCountry="IN" onValueChange={onValueChange} />);
    await type(field(), '984701234');
    expect(field()).toHaveValue('98470 1234');
    expect(onValueChange).toHaveBeenLastCalledWith('+91984701234', { country: 'IN', national: '984701234', valid: false });
    await type(field(), '5');
    expect(field()).toHaveValue('98470 12345');
    expect(onValueChange).toHaveBeenLastCalledWith('+919847012345', { country: 'IN', national: '9847012345', valid: true });
  });

  it('formats US and generic countries', async () => {
    const { unmount } = render(<PhoneInput aria-label="Phone" defaultCountry="US" />);
    await type(field(), '4155550132');
    expect(field()).toHaveValue('415 555 0132');
    unmount();
    render(<PhoneInput aria-label="Phone" defaultCountry="BR" />);
    await type(field(), '11987x65');
    expect(field()).toHaveValue('119 8765');
  });

  it('renders without console noise while the country list loads', async () => {
    const error = vi.spyOn(console, 'error');
    render(<PhoneInput aria-label="Phone" />);
    await screen.findByRole('combobox');
    expect(error.mock.calls).toEqual([]);
    error.mockRestore();
  });

  it('defaults the country from the locale, else US', async () => {
    render(<PhoneInput aria-label="Phone" />);
    expect(await screen.findByRole('combobox')).toHaveAccessibleName('Country code, United States +1');
  });

  it('keeps the caret in place when editing in the middle', async () => {
    const user = userEvent.setup();
    render(<PhoneInput aria-label="Phone" defaultCountry="IN" defaultValue="+919847012345" />);
    const el = field();
    await user.click(el);
    el.setSelectionRange(2, 2);
    await user.keyboard('7');
    expect(el).toHaveValue('98747 012345');
    expect(el.selectionStart).toBe(3);
    // A letter changes nothing and does not move the caret either.
    await user.keyboard('x');
    expect(el).toHaveValue('98747 012345');
    expect(el.selectionStart).toBe(3);
  });

  it('switches country when a full international number is pasted', async () => {
    const onValueChange = vi.fn();
    const onCountryChange = vi.fn();
    const user = userEvent.setup();
    render(<PhoneInput aria-label="Phone" defaultCountry="IN" onValueChange={onValueChange} onCountryChange={onCountryChange} />);
    await user.click(field());
    await user.paste('+971 (50) 123-4567');
    expect(field()).toHaveValue('50 123 4567');
    expect(onCountryChange).toHaveBeenCalledWith('AE');
    expect(onValueChange).toHaveBeenLastCalledWith('+971501234567', { country: 'AE', national: '501234567', valid: true });
    expect(await screen.findByRole('combobox')).toHaveAccessibleName('Country code, United Arab Emirates +971');
  });

  it('lists only the given countries, in order, and re-codes the number on change', async () => {
    const onValueChange = vi.fn();
    render(<PhoneInput aria-label="Phone" countries={['IN', 'AE', 'SA', 'QA']} defaultValue="+9198470123" onValueChange={onValueChange} />);
    const trigger = await screen.findByRole('combobox');
    expect(trigger).toHaveAccessibleName('Country code, India +91');
    fireEvent.keyDown(trigger, { key: 'Enter' });
    const options = await screen.findAllByRole('option');
    expect(options.map((o) => o.textContent!.replace(/^\P{L}+/u, ''))).toEqual(['India+91', 'United Arab Emirates+971', 'Saudi Arabia+966', 'Qatar+974']);
    fireEvent.keyDown(options[3]!, { key: 'Enter' });
    expect(onValueChange).toHaveBeenLastCalledWith('+97498470123', { country: 'QA', national: '98470123', valid: true });
    expect(field()).toHaveValue('9847 0123');
  });

  it('a number from outside a restricted list does not switch country', async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<PhoneInput aria-label="Phone" countries={['IN', 'AE']} onValueChange={onValueChange} />);
    await user.click(field());
    await user.paste('+44 20 7946 0958');
    expect(onValueChange).toHaveBeenLastCalledWith('+91442079460958', { country: 'IN', national: '442079460958', valid: false });
  });

  it('one country: no picker, the code is text', () => {
    render(<PhoneInput aria-label="Phone" countries={['SG']} />);
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Country code, Singapore +65' })).toHaveTextContent('+65');
  });

  it('is controlled by an E.164 value', async () => {
    const Controlled = () => {
      const [value, setValue] = React.useState('+14155550132');
      return (
        <>
          <PhoneInput aria-label="Phone" defaultCountry="IN" value={value} onValueChange={setValue} />
          <button onClick={() => setValue('')}>Reset</button>
          <output>{value}</output>
        </>
      );
    };
    render(<Controlled />);
    expect(field()).toHaveValue('415 555 0132');
    expect(await screen.findByRole('combobox')).toHaveAccessibleName('Country code, United States +1');
    await type(field(), '{Backspace}');
    expect(screen.getByRole('status')).toHaveTextContent('+1415555013');
    await userEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(field()).toHaveValue('');

    // A parent that ignores changes keeps its value on screen.
    render(<PhoneInput aria-label="Frozen" value="+6591234567" />);
    const frozen = screen.getByRole('textbox', { name: 'Frozen' });
    await type(frozen, '8');
    expect(frozen).toHaveValue('9123 4567');
  });

  it('submits the E.164 value under name', () => {
    const { container } = render(
      <form>
        <PhoneInput aria-label="Phone" name="phone" defaultCountry="IN" defaultValue="+919847012345" />
      </form>,
    );
    expect(new FormData(container.querySelector('form')!).get('phone')).toBe('+919847012345');
    expect(field()).not.toHaveAttribute('name');
    expect(field()).toHaveAttribute('type', 'tel');
    expect(field()).toHaveAttribute('autocomplete', 'tel-national');
  });

  it('works inside FormField', async () => {
    const { container } = render(
      <FormField.Root name="phone" invalid required>
        <FormField.Label>Mobile number</FormField.Label>
        <FormField.Control>
          <PhoneInput defaultCountry="IN" />
        </FormField.Control>
        <FormField.Error>Enter a valid number</FormField.Error>
      </FormField.Root>,
    );
    const el = screen.getByRole('textbox', { name: /Mobile number/ });
    expect(el).toHaveAttribute('aria-invalid', 'true');
    expect(el).toBeRequired();
    expect(el).toHaveAccessibleDescription('Enter a valid number');
    expect(container.querySelector('input[type="hidden"]')).toHaveAttribute('name', 'phone');
    expect(el.parentElement!.className).toContain('border-[var(--color-error)]');
    expect(await screen.findByRole('combobox')).toHaveAccessibleName('Country code, India +91');
  });

  it('readOnly and disabled', async () => {
    const onValueChange = vi.fn();
    const { unmount } = render(<PhoneInput aria-label="Phone" defaultCountry="IN" defaultValue="+9198470" readOnly onValueChange={onValueChange} />);
    const trigger = await screen.findByRole('combobox');
    await type(field(), '1');
    fireEvent.keyDown(trigger, { key: 'Enter' });
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-readonly', 'true');
    expect(field()).toHaveValue('98470');
    expect(onValueChange).not.toHaveBeenCalled();
    unmount();

    render(<PhoneInput aria-label="Phone" name="phone" disabled />);
    expect(field()).toBeDisabled();
    expect(await screen.findByRole('combobox')).toBeDisabled();
  });
});
