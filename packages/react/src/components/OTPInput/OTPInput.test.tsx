import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { OTPInput } from './OTPInput.js';

describe('OTPInput', () => {
  it('types across boxes, completes, and Backspace goes back', async () => {
    const onComplete = vi.fn();
    const onValueChange = vi.fn();
    render(<OTPInput length={4} onComplete={onComplete} onValueChange={onValueChange} />);
    expect(screen.getByRole('group', { name: 'Verification code' })).toBeInTheDocument();
    const first = screen.getByRole('textbox', { name: 'Digit 1 of 4' });
    expect(first).toHaveAttribute('autocomplete', 'one-time-code');
    await userEvent.click(first);
    await userEvent.keyboard('1a23');
    expect(onValueChange).toHaveBeenLastCalledWith('123');
    expect(screen.getByRole('textbox', { name: 'Digit 4 of 4' })).toHaveFocus();
    await userEvent.keyboard('4');
    expect(onComplete).toHaveBeenCalledWith('1234');
    await userEvent.keyboard('{Backspace}{Backspace}');
    expect(onValueChange).toHaveBeenLastCalledWith('12');
  });

  it('paste and one-time-code autofill fill every box', () => {
    const onComplete = vi.fn();
    render(<OTPInput onComplete={onComplete} />);
    const first = screen.getByRole('textbox', { name: 'Digit 1 of 6' });
    fireEvent.paste(first, { clipboardData: { getData: () => '98-76 54' } });
    expect(onComplete).toHaveBeenLastCalledWith('987654');
    expect(screen.getByRole('textbox', { name: 'Digit 6 of 6' })).toHaveValue('4');
  });

  it('jumps to the first empty box and submits under name', () => {
    const { container } = render(<OTPInput defaultValue="12" name="code" />);
    screen.getByRole('textbox', { name: 'Digit 5 of 6' }).focus();
    expect(screen.getByRole('textbox', { name: 'Digit 3 of 6' })).toHaveFocus();
    expect(container.querySelector('input[type=hidden]')).toHaveValue('12');
  });
});
