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

describe('OTPInput 10.4 consistent controls', () => {
  it('sizes: md keeps the default box, sm and lg change it', () => {
    const { rerender } = render(<OTPInput length={2} />);
    const box = () => screen.getByRole('textbox', { name: 'Digit 1 of 2' });
    expect(box()).toHaveClass('h-[var(--otp-h,3rem)]', 'w-[var(--otp-w,2.5rem)]', 'text-title-md');
    rerender(<OTPInput length={2} size="sm" />);
    expect(box()).toHaveClass('h-10', 'w-8', 'text-title-sm');
    rerender(<OTPInput length={2} size="lg" />);
    expect(box()).toHaveClass('h-14', 'w-12', 'text-title-lg');
  });

  it('invalid sets aria-invalid on each box', () => {
    render(<OTPInput length={2} invalid />);
    expect(screen.getByRole('textbox', { name: 'Digit 2 of 2' })).toHaveAttribute('aria-invalid', 'true');
  });

  it('readOnly: boxes are read-only and paste and Backspace change nothing', () => {
    const onValueChange = vi.fn();
    render(<OTPInput length={4} defaultValue="12" readOnly onValueChange={onValueChange} />);
    const first = screen.getByRole('textbox', { name: 'Digit 1 of 4' });
    expect(first).toHaveAttribute('readonly');
    fireEvent.paste(first, { clipboardData: { getData: () => '9876' } });
    fireEvent.keyDown(first, { key: 'Backspace' });
    expect(onValueChange).not.toHaveBeenCalled();
    expect(first).toHaveValue('1');
  });
});
