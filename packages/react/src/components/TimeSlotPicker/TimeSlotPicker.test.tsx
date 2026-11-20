import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { TimeSlotPicker } from './TimeSlotPicker.js';
import { FormField } from '../FormField/FormField.js';

const slots = [
  { value: '09:00' },
  { value: '09:30', disabled: true },
  { value: '13:00', hint: 'Last one' },
  { value: '18:15', label: 'Quarter past six' },
];

describe('TimeSlotPicker', () => {
  it('labels slots with the time, the same on the server', () => {
    render(<TimeSlotPicker slots={slots} />);
    expect(screen.getByRole('radiogroup', { name: 'Choose a time' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: '9:00 AM' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Quarter past six' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: '1:00 PM' })).toHaveAccessibleDescription('Last one');
    expect(renderToString(<TimeSlotPicker slots={[{ value: '2026-03-02T14:45:00Z' }]} />)).toContain('2:45 PM');
  });

  it('selects on click and reports the value', async () => {
    const onValueChange = vi.fn();
    render(<TimeSlotPicker slots={slots} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('radio', { name: '1:00 PM' }));
    expect(onValueChange).toHaveBeenCalledWith('13:00');
    expect(screen.getByRole('radio', { name: '1:00 PM' })).toBeChecked();
  });

  it('arrow keys move the selection and skip unavailable slots', async () => {
    const user = userEvent.setup();
    render(<TimeSlotPicker slots={slots} defaultValue="09:00" />);
    await user.tab();
    expect(screen.getByRole('radio', { name: '9:00 AM' })).toHaveFocus();
    // Hold the key: Radix selects only while an arrow is down.
    await user.keyboard('{ArrowRight>}');
    expect(screen.getByRole('radio', { name: '1:00 PM' })).toHaveFocus();
    expect(screen.getByRole('radio', { name: '1:00 PM' })).toBeChecked();
  });

  it('unavailable slots say so and cannot be picked', async () => {
    const onValueChange = vi.fn();
    render(<TimeSlotPicker slots={slots} onValueChange={onValueChange} />);
    const slot = screen.getByRole('radio', { name: '9:30 AM, unavailable' });
    expect(slot).toBeDisabled();
    await userEvent.click(slot);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('groups by period', () => {
    render(<TimeSlotPicker slots={slots} groupBy="period" />);
    const text = screen.getByRole('radiogroup').textContent!;
    expect(text.indexOf('Morning')).toBeLessThan(text.indexOf('9:00 AM'));
    expect(text.indexOf('Afternoon')).toBeLessThan(text.indexOf('1:00 PM'));
    expect(text.indexOf('Evening')).toBeLessThan(text.indexOf('Quarter past six'));
    expect(screen.getAllByRole('radio')).toHaveLength(4);
  });

  it('shows the empty state', () => {
    const { rerender } = render(<TimeSlotPicker slots={[]} />);
    expect(screen.getByText('No times available')).toBeInTheDocument();
    expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument();
    rerender(<TimeSlotPicker slots={[]} emptyState="Fully booked" />);
    expect(screen.getByText('Fully booked')).toBeInTheDocument();
  });

  it('readOnly keeps the value; disabled disables every slot', async () => {
    const onValueChange = vi.fn();
    const { rerender } = render(<TimeSlotPicker slots={slots} defaultValue="09:00" readOnly onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('radio', { name: '1:00 PM' }));
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole('radio', { name: '9:00 AM' })).toBeChecked();
    rerender(<TimeSlotPicker slots={slots} disabled />);
    screen.getAllByRole('radio').forEach((r) => expect(r).toBeDisabled());
  });

  it('submits under name and takes FormField state', async () => {
    const { container } = render(
      <form>
        <FormField.Root name="time" invalid>
          <FormField.Control>
            <TimeSlotPicker slots={slots} aria-label="Start time" />
          </FormField.Control>
          <FormField.Error>Pick a time</FormField.Error>
        </FormField.Root>
      </form>,
    );
    const group = screen.getByRole('radiogroup', { name: 'Start time' });
    expect(group).toHaveAttribute('aria-invalid', 'true');
    expect(group).toHaveAccessibleDescription('Pick a time');
    expect(screen.getByRole('radio', { name: '9:00 AM' })).toHaveAttribute('aria-invalid', 'true');
    await userEvent.click(screen.getByRole('radio', { name: '9:00 AM' }));
    expect(new FormData(container.querySelector('form')!).get('time')).toBe('09:00');
  });
});
