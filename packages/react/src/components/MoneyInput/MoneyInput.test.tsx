import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { MoneyInput } from './MoneyInput.js';
import { Amount } from '../Amount/Amount.js';

describe('MoneyInput', () => {
  it('parses as you type, groups on blur, and edits raw again on focus', async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<MoneyInput aria-label="Amount" currency="USD" locale="en-US" onValueChange={onValueChange} />);
    const input = screen.getByRole('textbox', { name: 'Amount' });
    expect(input).toHaveAttribute('inputmode', 'decimal');

    await user.type(input, '1234.5');
    expect(onValueChange).toHaveBeenLastCalledWith(1234.5);

    await user.tab();
    expect(input).toHaveValue('1,234.50');

    await user.click(input);
    expect(input).toHaveValue('1234.5');

    await user.clear(input);
    expect(onValueChange).toHaveBeenLastCalledWith(null);
  });

  it('uses the locale separators and shows the currency symbol', async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<MoneyInput aria-label="Betrag" currency="EUR" locale="de-DE" onValueChange={onValueChange} />);
    expect(screen.getByText('€')).toBeInTheDocument();
    await user.type(screen.getByRole('textbox'), '1.234,5');
    expect(onValueChange).toHaveBeenLastCalledWith(1234.5);
    await user.tab();
    expect(screen.getByRole('textbox')).toHaveValue('1.234,50');
  });

  it('follows a controlled value when not focused', () => {
    const { rerender } = render(<MoneyInput aria-label="Amount" currency="USD" locale="en-US" value={10} />);
    expect(screen.getByRole('textbox')).toHaveValue('10.00');
    rerender(<MoneyInput aria-label="Amount" currency="USD" locale="en-US" value={null} />);
    expect(screen.getByRole('textbox')).toHaveValue('');
  });
});

describe('Amount', () => {
  it('formats with tabular numerals and a true minus sign', () => {
    render(<Amount value={-1234.5} currency="USD" locale="en-US" data-testid="a" />);
    const el = screen.getByTestId('a');
    expect(el).toHaveTextContent('−$1,234.50');
    expect(el).toHaveClass('tabular-nums');
  });

  it('colours gains and losses with tone="auto"', () => {
    render(
      <>
        <Amount value={5} currency="USD" locale="en-US" tone="auto" signDisplay="exceptZero" data-testid="up" />
        <Amount value={-5} currency="USD" locale="en-US" tone="auto" data-testid="down" />
      </>,
    );
    expect(screen.getByTestId('up')).toHaveTextContent('+$5.00');
    expect(screen.getByTestId('up').className).toContain('color-success');
    expect(screen.getByTestId('down').className).toContain('color-error');
  });
});
