import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { DateTimePicker } from './DateTimePicker.js';

// TimePicker.test.tsx covers time-keeps-date and default-time; these cover the rest.
const pickDay = async (n: number) => {
  await userEvent.click(screen.getByRole('button', { name: /Date/ }));
  const day = screen.getAllByRole('button').find((b) => b.textContent === String(n));
  await userEvent.click(day!);
};

describe('DateTimePicker', () => {
  it('a time typed before any date is used when the date is picked', async () => {
    const onChange = vi.fn();
    render(<DateTimePicker aria-label="Starts" onValueChange={onChange} />);
    fireEvent.change(screen.getByLabelText('Time'), { target: { value: '14:20' } });
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByLabelText('Time')).toHaveValue('14:20');
    await pickDay(12);
    const picked = onChange.mock.calls[0]![0] as Date;
    expect([picked.getDate(), picked.getHours(), picked.getMinutes()]).toEqual([12, 14, 20]);
  });

  it('picking a new date keeps the current time', async () => {
    const onChange = vi.fn();
    render(<DateTimePicker value={new Date(2026, 10, 9, 16, 5)} onValueChange={onChange} />);
    await pickDay(20);
    expect(onChange).toHaveBeenCalledWith(new Date(2026, 10, 20, 16, 5));
  });

  it('a cleared time is ignored', () => {
    const onChange = vi.fn();
    render(<DateTimePicker value={new Date(2026, 10, 9, 9, 0)} onValueChange={onChange} />);
    fireEvent.change(screen.getByLabelText('Time'), { target: { value: '' } });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('disabled and minuteStep reach both fields', () => {
    render(<DateTimePicker disabled minuteStep={15} />);
    expect(screen.getByRole('button', { name: /Date/ })).toBeDisabled();
    expect(screen.getByLabelText('Time')).toBeDisabled();
    expect(screen.getByLabelText('Time')).toHaveAttribute('step', '900');
  });

  it('names the time zone only when one is given', () => {
    const { rerender } = render(<DateTimePicker value={new Date(2026, 10, 9)} />);
    expect(screen.queryByText(/Time zone/)).toBeNull();
    rerender(<DateTimePicker value={new Date(2026, 10, 9)} timeZone="UTC" />);
    expect(screen.getByText(/Time zone: .*\(UTC\)/)).toBeInTheDocument();
  });
});
