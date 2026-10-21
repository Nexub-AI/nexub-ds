import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { fr } from 'date-fns/locale/fr';
import { DateRangePicker } from './DateRangePicker.js';
import { NexubProvider } from '../NexubProvider/NexubProvider.js';

describe('DateRangePicker', () => {
  it('renders a button trigger', () => {
    render(<DateRangePicker onChange={vi.fn()} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('shows placeholder when no range selected', () => {
    render(<DateRangePicker onChange={vi.fn()} placeholder="Select range" />);
    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-label',
      'Select range',
    );
  });

  it('shows formatted range when value is provided', () => {
    const range = { from: new Date(2024, 0, 1), to: new Date(2024, 0, 15) };
    render(<DateRangePicker value={range} onChange={vi.fn()} />);
    expect(
      screen.getByRole('button').getAttribute('aria-label'),
    ).toContain('\u2013');
  });

  it('opens calendar on click', () => {
    render(<DateRangePicker onChange={vi.fn()} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getAllByRole('grid').length).toBeGreaterThan(0);
  });

  it('is disabled when disabled prop is true', () => {
    render(<DateRangePicker disabled onChange={vi.fn()} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('forwards className to the trigger button', () => {
    render(<DateRangePicker onChange={vi.fn()} className="custom-class" />);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });
});

describe('DateRangePicker locale + RTL', () => {
  const range = { from: new Date(2024, 0, 15), to: new Date(2024, 0, 20) };

  it('renders dir=rtl on the calendar under an Arabic provider', () => {
    render(<DateRangePicker value={range} onChange={vi.fn()} />, {
      wrapper: ({ children }) => <NexubProvider locale="ar">{children}</NexubProvider>,
    });
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getAllByRole('grid')[0]!.closest('[dir]')).toHaveAttribute('dir', 'rtl');
    expect(screen.getByRole('button', { name: 'Go to previous month' })).toBeInTheDocument();
  });

  it('uses the date-fns locale prop for trigger and caption', () => {
    render(<DateRangePicker value={range} onChange={vi.fn()} locale={fr} />);
    expect(screen.getByRole('button').getAttribute('aria-label')).toMatch(/janv/);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText(/janvier 2024/i)).toBeInTheDocument();
  });
});
