import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { FloatingInput } from './FloatingInput.js';

describe('FloatingInput', () => {
  it('the label is a real <label> for the input', () => {
    render(<FloatingInput label="Email" />);
    const input = screen.getByRole('textbox', { name: 'Email' });
    // A single-space placeholder drives the :placeholder-shown float.
    expect(input).toHaveAttribute('placeholder', ' ');
  });

  it('typing updates the value and calls onChange', async () => {
    const onChange = vi.fn();
    render(<FloatingInput label="Email" onChange={onChange} />);
    const input = screen.getByLabelText('Email');
    await userEvent.type(input, 'a@b.co');
    expect(input).toHaveValue('a@b.co');
    expect(onChange).toHaveBeenCalledTimes(6);
  });

  it('keeps a caller id, and passes input attributes through', () => {
    render(<FloatingInput label="Email" id="email" type="email" aria-invalid required disabled />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('id', 'email');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toBeInvalid();
    expect(input).toBeRequired();
    expect(input).toBeDisabled();
  });

  it('ref goes to the input, className to the wrapper', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<FloatingInput ref={ref} label="Email" className="x" />);
    expect(ref.current).toBe(screen.getByLabelText('Email'));
    expect(ref.current!.parentElement).toHaveClass('nx-float-field', 'x');
  });
});
