import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { PasswordInput } from './PasswordInput.js';

describe('PasswordInput', () => {
  it('renders a password input', () => {
    render(<PasswordInput />);
    expect(document.querySelector('input[type="password"]')).toBeInTheDocument();
  });

  it('forwards className', () => {
    render(<PasswordInput className="custom-class" />);
    const input = document.querySelector('input[type="password"]');
    expect(input).toHaveClass('custom-class');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<PasswordInput ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('defaults to password type', () => {
    render(<PasswordInput />);
    const input = document.querySelector('input');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('toggles to text type when show button is clicked', async () => {
    const user = userEvent.setup();
    render(<PasswordInput />);
    await user.click(screen.getByRole('button', { name: /show password/i }));
    const input = document.querySelector('input');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('reveal is a pressed toggle with a stable name that controls the input', async () => {
    const user = userEvent.setup();
    render(<PasswordInput aria-label="Password" />);
    const toggle = screen.getByRole('button', { name: /show password/i });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    expect(toggle).toHaveAttribute('aria-controls', screen.getByLabelText('Password').id);
    await user.click(toggle);
    expect(screen.getByRole('button', { name: /show password/i, pressed: true })).toBeInTheDocument();
  });

  it('starts shown with defaultVisible', () => {
    render(<PasswordInput defaultVisible />);
    expect(document.querySelector('input')).toHaveAttribute('type', 'text');
  });

  it('is controlled by visible and reports toggles through onVisibleChange', async () => {
    const user = userEvent.setup();
    const onVisibleChange = vi.fn();
    render(<PasswordInput visible={false} onVisibleChange={onVisibleChange} />);
    await user.click(screen.getByRole('button', { name: /show password/i }));
    expect(onVisibleChange).toHaveBeenCalledWith(true);
    // Controlled: stays hidden until the parent passes visible.
    expect(document.querySelector('input')).toHaveAttribute('type', 'password');
  });

  it('keeps revealed text away from spellcheck and autocorrect', () => {
    render(<PasswordInput defaultVisible spellCheck autoCorrect="on" autoCapitalize="on" />);
    const input = document.querySelector('input');
    expect(input).toHaveAttribute('spellcheck', 'false');
    expect(input).toHaveAttribute('autocorrect', 'off');
    expect(input).toHaveAttribute('autocapitalize', 'off');
  });

  it('defaults autocomplete to current-password and lets it be overridden', () => {
    const { rerender } = render(<PasswordInput />);
    expect(document.querySelector('input')).toHaveAttribute('autocomplete', 'current-password');
    rerender(<PasswordInput autoComplete="new-password" />);
    expect(document.querySelector('input')).toHaveAttribute('autocomplete', 'new-password');
  });
});
