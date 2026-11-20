import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { fr } from 'date-fns/locale/fr';
import { DateRangePicker, todayIn } from './DateRangePicker.js';
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

describe('DateRangePicker presets and time zone', () => {
  it('todayIn reads the calendar date in a time zone', () => {
    const now = new Date('2026-11-07T02:00:00Z'); // still Nov 6 in Los Angeles, Nov 7 in Tokyo
    expect(todayIn('America/Los_Angeles', now).getDate()).toBe(6);
    expect(todayIn('Asia/Tokyo', now).getDate()).toBe(7);
  });

  it('presets pick a range and close; the time zone is labelled', () => {
    const onChange = vi.fn();
    render(<DateRangePicker onChange={onChange} presets timeZone="Asia/Tokyo" />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText(/Time zone: .*\(Asia\/Tokyo\)/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Last 7 days' }));
    const range = onChange.mock.calls[0]![0];
    expect((range.to - range.from) / 86_400_000).toBe(6);
    expect(range.to.getTime()).toBe(todayIn('Asia/Tokyo').getTime());
  });

  it('accepts custom presets', () => {
    const onChange = vi.fn();
    const q = { from: new Date(2026, 6, 1), to: new Date(2026, 8, 30) };
    render(<DateRangePicker onChange={onChange} presets={[{ label: 'Q3', range: () => q }]} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByRole('button', { name: 'Q3' }));
    expect(onChange).toHaveBeenCalledWith(q);
  });
});

describe('DateRangePicker 10.4', () => {
  it('size: md by default, lg on request', () => {
    const { rerender } = render(<DateRangePicker />);
    expect(screen.getByRole('button')).toHaveClass('h-control-md', 'px-3.5');
    rerender(<DateRangePicker size="lg" />);
    expect(screen.getByRole('button')).toHaveClass('h-control-lg', 'px-4');
  });

  it('readOnly: the calendar cannot open', () => {
    render(<DateRangePicker readOnly />);
    const trigger = screen.getByRole('button');
    expect(trigger).toHaveAttribute('data-readonly');
    fireEvent.click(trigger);
    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
  });
});

describe('DateRangePicker sheet (10.6)', () => {
  const sheetAttr = () => document.querySelector('[data-nx-sheet]')?.getAttribute('data-nx-sheet') ?? null;

  it('marks the calendar popover with data-nx-sheet only when asked, and still closes', () => {
    const { unmount } = render(<DateRangePicker aria-label="When" />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getAllByRole('grid').length).toBeGreaterThan(0);
    expect(sheetAttr()).toBeNull();
    fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' });
    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    unmount();

    render(<DateRangePicker aria-label="When" sheet="auto" />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getAllByRole('grid')[0]!.closest('[data-nx-sheet]')).toHaveAttribute('data-nx-sheet', 'auto');
  });
});
