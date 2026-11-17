import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { NumberInput } from './NumberInput.js';

describe('NumberInput', () => {
  it('renders a number input', () => {
    render(<NumberInput />);
    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
  });

  it('forwards className to wrapper', () => {
    render(<NumberInput className="custom-class" />);
    expect(screen.getByRole('spinbutton').parentElement).toHaveClass('custom-class');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<NumberInput ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('renders steppers when showSteppers is true', () => {
    render(<NumberInput showSteppers />);
    expect(screen.getByRole('button', { name: /increment/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /decrement/i })).toBeInTheDocument();
  });

  it('calls onValueChange when increment is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<NumberInput showSteppers defaultValue={5} step={1} onValueChange={onChange} />);
    await user.click(screen.getByRole('button', { name: /increment/i }));
    expect(onChange).toHaveBeenCalledWith(6);
  });
});

describe('NumberInput bounds', () => {
  it('still disables the increment stepper at max when disabled={false}', () => {
    render(<NumberInput showSteppers value={5} max={5} disabled={false} />);
    expect(screen.getByLabelText('Increment')).toBeDisabled();
    expect(screen.getByLabelText('Decrement')).not.toBeDisabled();
  });
});

describe('NumberInput 10.4', () => {
  it('readOnly: steppers are disabled and arrow keys do not change the value', async () => {
    const onValueChange = vi.fn();
    render(<NumberInput readOnly showSteppers defaultValue={5} onValueChange={onValueChange} />);
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('readonly');
    expect(input).toHaveClass('tabular-nums');
    expect(screen.getByRole('button', { name: 'Increment' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Decrement' })).toBeDisabled();
    await userEvent.click(input);
    await userEvent.keyboard('{ArrowUp}{ArrowDown}');
    expect(onValueChange).not.toHaveBeenCalled();
    expect(input).toHaveValue(5);
  });
});
