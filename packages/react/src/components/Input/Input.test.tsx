import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Input } from './Input.js';

describe('Input', () => {
  it('renders an input', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('forwards className to the input element', () => {
    render(<Input className="custom-class" />);
    expect(screen.getByRole('textbox')).toHaveClass('custom-class');
  });

  it('forwards ref to the input element', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('sets aria-invalid when invalid', () => {
    render(<Input invalid />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders leading addon', () => {
    render(<Input leadingAddon="https://" />);
    expect(screen.getByText('https://')).toBeInTheDocument();
  });

  it('renders trailing addon', () => {
    render(<Input trailingAddon=".com" />);
    expect(screen.getByText('.com')).toBeInTheDocument();
  });

  it('is disabled when disabled prop is set', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('clearable: clears an uncontrolled value, fires onChange and refocuses', () => {
    const onChange = vi.fn();
    render(<Input clearable defaultValue="hello" onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(input).toHaveFocus();
    expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
  });

  it('clearable: clears a controlled value', () => {
    function Controlled() {
      const [value, setValue] = React.useState('abc');
      return <Input clearable value={value} onChange={(e) => setValue(e.target.value)} />;
    }
    render(<Controlled />);
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it('clearable: no button when empty or disabled', () => {
    const { rerender } = render(<Input clearable />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    rerender(<Input clearable disabled defaultValue="x" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('showCount: shows the count and links it as a description', () => {
    render(<Input showCount maxLength={10} defaultValue="abc" aria-describedby="hint" />);
    const input = screen.getByRole('textbox');
    expect(screen.getByText('3/10')).toBeInTheDocument();
    const ids = input.getAttribute('aria-describedby')!.split(' ');
    expect(ids[0]).toBe('hint');
    const live = document.getElementById(ids[1]!)!;
    expect(live).toHaveTextContent('3 of 10 characters');
    expect(live).toHaveAttribute('aria-live', 'off');
    fireEvent.change(input, { target: { value: 'abcdefghi' } });
    expect(screen.getByText('9/10')).toBeInTheDocument();
    expect(live).toHaveAttribute('aria-live', 'polite');
  });

  it('loading: spinner and aria-busy', () => {
    render(<Input loading />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
