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

  it('shows hide button after reveal', async () => {
    const user = userEvent.setup();
    render(<PasswordInput />);
    await user.click(screen.getByRole('button', { name: /show password/i }));
    expect(screen.getByRole('button', { name: /hide password/i })).toBeInTheDocument();
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
});
