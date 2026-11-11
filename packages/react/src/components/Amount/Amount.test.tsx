import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Amount } from './Amount.js';
import { NexubProvider } from '../NexubProvider/NexubProvider.js';

const text = (el: HTMLElement) => el.textContent?.replace(/\u00a0/g, ' ');

describe('Amount', () => {
  it('uses the currency’s own minor unit and tabular numerals', () => {
    const { rerender } = render(<Amount data-testid="a" value={1234.5} currency="USD" locale="en-US" />);
    const el = screen.getByTestId('a');
    expect(text(el)).toBe('$1,234.50');
    expect(el).toHaveClass('tabular-nums');
    expect(el).toHaveAttribute('data-value', '1234.5');
    rerender(<Amount data-testid="a" value={1234.5} currency="JPY" locale="en-US" />);
    expect(text(screen.getByTestId('a'))).toBe('¥1,235');
  });

  it('renders a true minus sign (U+2212), and + with signDisplay', () => {
    const { rerender } = render(<Amount data-testid="a" value={-5} currency="USD" locale="en-US" />);
    expect(text(screen.getByTestId('a'))).toBe('−$5.00');
    rerender(<Amount data-testid="a" value={5} currency="USD" locale="en-US" signDisplay="exceptZero" />);
    expect(text(screen.getByTestId('a'))).toBe('+$5.00');
  });

  it('tone="auto" colours gains and losses, zero stays neutral', () => {
    const { rerender } = render(<Amount data-testid="a" value={1} currency="USD" tone="auto" />);
    expect(screen.getByTestId('a')).toHaveClass('text-[var(--color-success)]');
    rerender(<Amount data-testid="a" value={-1} currency="USD" tone="auto" />);
    expect(screen.getByTestId('a')).toHaveClass('text-[var(--color-error)]');
    rerender(<Amount data-testid="a" value={0} currency="USD" tone="auto" />);
    expect(screen.getByTestId('a').className).not.toMatch(/success|error/);
  });

  it('display size quiets the symbol and minor units', () => {
    render(<Amount data-testid="a" value={12.34} currency="USD" locale="en-US" size="display" />);
    const quiet = [...screen.getByTestId('a').querySelectorAll('span')].map((s) => s.textContent);
    expect(quiet).toEqual(['$', '.', '34']);
  });

  it('takes the locale from NexubProvider; the prop wins', () => {
    const { rerender } = render(<NexubProvider locale="de-DE"><Amount data-testid="a" value={1234.5} currency="EUR" /></NexubProvider>);
    expect(text(screen.getByTestId('a'))).toBe('1.234,50 €');
    rerender(<NexubProvider locale="de-DE"><Amount data-testid="a" value={1234.5} currency="EUR" locale="en-US" /></NexubProvider>);
    expect(text(screen.getByTestId('a'))).toBe('€1,234.50');
  });

  it('animate rolls digits but keeps the full figure readable', () => {
    render(<Amount data-testid="a" value={-5} currency="USD" locale="en-US" animate />);
    expect(screen.getByTestId('a').querySelector('.sr-only')).toHaveTextContent('−$5.00');
  });
});
