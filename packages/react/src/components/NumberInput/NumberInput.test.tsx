import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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

describe('NumberInput 11.1', () => {
  const type = (el: Element, text: string) => userEvent.setup({ delay: null }).type(el, text);

  it('clamps on blur, not on every keystroke (typing 30 with min 15)', async () => {
    const onValueChange = vi.fn();
    render(<NumberInput aria-label="Limit" min={15} max={100} defaultValue={20} onValueChange={onValueChange} />);
    const input = screen.getByRole('spinbutton');
    await userEvent.clear(input);
    await type(input, '30');
    expect(input).toHaveValue(30);
    expect(onValueChange).toHaveBeenLastCalledWith(30);
    expect(onValueChange).not.toHaveBeenCalledWith(15);
    await userEvent.clear(input);
    await type(input, '3');
    await userEvent.tab();
    expect(onValueChange).toHaveBeenLastCalledWith(15);
    expect(input).toHaveValue(15);
  });

  it('step="any" passes through to the input and steppers move by 1', async () => {
    const onValueChange = vi.fn();
    render(<NumberInput aria-label="Rate" step="any" showSteppers defaultValue={1.25} onValueChange={onValueChange} />);
    expect(screen.getByRole('spinbutton')).toHaveAttribute('step', 'any');
    await userEvent.click(screen.getByRole('button', { name: 'Increment' }));
    expect(onValueChange).toHaveBeenLastCalledWith(2.25);
  });

  it('nullable: a cleared field reports null, not 0, and shows empty', async () => {
    const onValueChange = vi.fn();
    render(<NumberInput nullable aria-label="Target" defaultValue={4} onValueChange={onValueChange} />);
    const input = screen.getByRole('spinbutton');
    await userEvent.clear(input);
    expect(onValueChange).toHaveBeenLastCalledWith(null);
    await userEvent.tab();
    expect(input).toHaveValue('');
    expect(input).not.toHaveAttribute('aria-valuenow');
  });

  it('nullable: starts empty without a default and keeps a half-typed "2." and "-"', async () => {
    const onValueChange = vi.fn();
    render(<NumberInput nullable aria-label="Amount" onValueChange={onValueChange} />);
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveValue('');
    await type(input, '2.');
    expect(input).toHaveValue('2.');
    expect(onValueChange).toHaveBeenLastCalledWith(2);
    await type(input, '5');
    expect(onValueChange).toHaveBeenLastCalledWith(2.5);
    await userEvent.clear(input);
    await type(input, '-');
    expect(input).toHaveValue('-');
    expect(onValueChange).toHaveBeenLastCalledWith(null);
    await type(input, '4');
    expect(onValueChange).toHaveBeenLastCalledWith(-4);
  });

  it('nullable: letters are ignored, arrow keys and Home/End step within bounds', async () => {
    const onValueChange = vi.fn();
    render(<NumberInput nullable aria-label="Seats" min={1} max={10} defaultValue={5} onValueChange={onValueChange} />);
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('aria-valuenow', '5');
    expect(input).toHaveAttribute('aria-valuemin', '1');
    await type(input, 'x');
    expect(input).toHaveValue('5');
    await userEvent.keyboard('{ArrowUp}');
    expect(onValueChange).toHaveBeenLastCalledWith(6);
    await userEvent.keyboard('{End}');
    expect(onValueChange).toHaveBeenLastCalledWith(10);
    await userEvent.keyboard('{ArrowUp}');
    expect(onValueChange).toHaveBeenLastCalledWith(10);
    await userEvent.keyboard('{Home}');
    expect(onValueChange).toHaveBeenLastCalledWith(1);
  });

  it('nullable controlled: null shows empty and a number shows the number', () => {
    const { rerender } = render(<NumberInput nullable aria-label="Cap" value={null} onValueChange={() => {}} />);
    expect(screen.getByRole('spinbutton')).toHaveValue('');
    rerender(<NumberInput nullable aria-label="Cap" value={12} onValueChange={() => {}} />);
    expect(screen.getByRole('spinbutton')).toHaveValue('12');
  });

  it('precision formats after blur, not while typing', () => {
    // fireEvent and the value attribute: user-event (used above) patches the document and keeps its own
    // copy of a number input's typed text, which hides the property React sets on blur.
    render(<NumberInput aria-label="Price" precision={2} defaultValue={1} />);
    const input = screen.getByRole('spinbutton') as HTMLInputElement;
    expect(input).toHaveAttribute('value', '1.00');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '3' } });
    expect(input).toHaveAttribute('value', '3');
    fireEvent.blur(input);
    expect(input).toHaveAttribute('value', '3.00');
  });
});
