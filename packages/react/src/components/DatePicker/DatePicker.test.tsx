import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DatePicker } from './DatePicker.js';

describe('DatePicker', () => {
  it('renders a button trigger', () => {
    render(<DatePicker onChange={vi.fn()} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('shows placeholder text when no date selected', () => {
    render(<DatePicker onChange={vi.fn()} placeholder="Choose date" />);
    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-label',
      'Choose date',
    );
  });

  it('shows formatted date when value is provided', () => {
    const date = new Date(2024, 0, 15); // Jan 15, 2024
    render(<DatePicker value={date} onChange={vi.fn()} />);
    expect(screen.getByRole('button').getAttribute('aria-label')).toMatch(
      /Jan/,
    );
  });

  it('opens popover on click', () => {
    render(<DatePicker onChange={vi.fn()} />);
    fireEvent.click(screen.getByRole('button'));
    // Calendar should be in the document
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    render(<DatePicker disabled onChange={vi.fn()} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('forwards className to the trigger button', () => {
    render(<DatePicker onChange={vi.fn()} className="custom-class" />);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });
});
