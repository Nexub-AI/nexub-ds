import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { TimePicker } from './TimePicker.js';
import { DateTimePicker } from '../DateTimePicker/DateTimePicker.js';

describe('TimePicker', () => {
  it('is a native time input with a minute step', () => {
    const onValueChange = vi.fn();
    render(<TimePicker aria-label="Start" minuteStep={15} defaultValue="09:00" onValueChange={onValueChange} />);
    const input = screen.getByLabelText('Start');
    expect(input).toHaveAttribute('type', 'time');
    expect(input).toHaveAttribute('step', '900');
    fireEvent.change(input, { target: { value: '09:15' } });
    expect(onValueChange).toHaveBeenCalledWith('09:15');
  });
});

describe('DateTimePicker', () => {
  it('changing the time keeps the date', () => {
    const onChange = vi.fn();
    render(<DateTimePicker aria-label="Starts" value={new Date(2026, 10, 9, 9, 0)} onChange={onChange} timeZone="Asia/Singapore" />);
    expect(screen.getByRole('group', { name: 'Starts' })).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Time'), { target: { value: '13:45' } });
    expect(onChange).toHaveBeenCalledWith(new Date(2026, 10, 9, 13, 45));
    expect(screen.getByText(/Asia\/Singapore/)).toBeInTheDocument();
  });

  it('a picked date takes the default time', async () => {
    const onChange = vi.fn();
    render(<DateTimePicker onChange={onChange} defaultTime="10:30" />);
    await userEvent.click(screen.getByRole('button', { name: /Date/ }));
    const day = screen.getAllByRole('button').find((b) => /15/.test(b.textContent ?? ''));
    await userEvent.click(day!);
    const picked = onChange.mock.calls[0]![0] as Date;
    expect([picked.getDate(), picked.getHours(), picked.getMinutes()]).toEqual([15, 10, 30]);
  });
});
