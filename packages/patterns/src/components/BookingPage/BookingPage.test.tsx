import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Input, FormField } from '@nexub/react';
import { BookingPage, type BookingSlot } from './index.js';

const date = new Date(2026, 10, 20);
const slots: BookingSlot[] = [
  { value: '09:00', label: '9:00 am' },
  { value: '09:30', label: '9:30 am', disabled: true },
  { value: '14:00', label: '2:00 pm' },
];
const service = { title: 'Intro call', duration: '30 minutes', price: 'Free', description: 'A first conversation.' };
const T = Date.UTC(2026, 10, 17, 9, 0, 0);

describe('BookingPage', () => {
  it('is a main landmark with an h1, three named steps and a step count', () => {
    render(<BookingPage service={service} slots={[]} onConfirm={() => {}} />);
    expect(screen.getByRole('main', { name: 'Book a time' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Book a time' })).toBeInTheDocument();
    for (const name of ['Pick a date', 'Pick a time', 'Your booking']) expect(screen.getByRole('region', { name })).toBeInTheDocument();
    expect(screen.getByText('Step 1 of 3')).toBeInTheDocument();
    expect(screen.getByText('A first conversation.')).toBeInTheDocument();
    // No date yet: no times, and nothing to continue or confirm with.
    expect(screen.getByText('Pick a date to see the times.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Confirm booking' })).toBeDisabled();
    expect(screen.queryByRole('button', { name: 'Back' })).toBeNull();
  });

  it('walks date → time → confirm, moving focus to each step heading, then shows the confirmed view', async () => {
    const onConfirm = vi.fn(async (_b: { date: Date; slot: string; formData: FormData }) => {});
    const onSlotChange = vi.fn();
    render(
      <BookingPage
        title="Book a call"
        service={service}
        defaultDate={date}
        slots={slots}
        onSlotChange={onSlotChange}
        onConfirm={onConfirm}
        details={
          <FormField.Root name="name">
            <FormField.Label>Name</FormField.Label>
            <FormField.Control>
              <Input defaultValue="Ada Park" />
            </FormField.Control>
          </FormField.Root>
        }
        confirmation={{ description: 'We sent the details to your email.', reference: 'BK-7731', actions: <button type="button">Add to calendar</button> }}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByText('Step 2 of 3')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Pick a time' })).toHaveFocus();
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();
    expect(screen.getByRole('radio', { name: /9:30 am/ })).toBeDisabled();
    await userEvent.click(screen.getByRole('radio', { name: /2:00 pm/ }));
    expect(onSlotChange).toHaveBeenCalledWith('14:00');
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByRole('heading', { level: 2, name: 'Your booking' })).toHaveFocus();
    expect(screen.queryByRole('button', { name: 'Continue' })).toBeNull();
    const summary = screen.getByRole('region', { name: 'Your booking' });
    expect(summary).toHaveTextContent('Friday, November 20, 2026');
    expect(summary).toHaveTextContent('2:00 pm');
    expect(summary).toHaveTextContent('30 minutes');
    await userEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByText('Step 2 of 3')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Confirm booking' }));
    const done = await screen.findByRole('status');
    expect(onConfirm).toHaveBeenCalledWith({ date, slot: '14:00', formData: expect.any(FormData) });
    expect(onConfirm.mock.calls[0]![0].formData.get('name')).toBe('Ada Park');
    expect(within(done).getByRole('heading', { level: 1, name: 'Booking confirmed' })).toHaveFocus();
    expect(screen.getByText('We sent the details to your email.')).toBeInTheDocument();
    expect(screen.getByText('BK-7731')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add to calendar' })).toBeInTheDocument();
  });

  it('a new date clears the chosen time', async () => {
    const onDateChange = vi.fn();
    const onSlotChange = vi.fn();
    render(<BookingPage defaultDate={date} slots={slots} defaultSlot="09:00" onDateChange={onDateChange} onSlotChange={onSlotChange} isDateDisabled={(d) => d.getDay() === 0} minDate={new Date(2026, 10, 1)} maxDate={new Date(2026, 11, 31)} onConfirm={() => {}} />);
    expect(screen.getByRole('radio', { name: /9:00 am/ })).toBeChecked();
    await userEvent.click(within(screen.getByRole('region', { name: 'Pick a date' })).getByRole('button'));
    await userEvent.click(await screen.findByRole('button', { name: /November 24/ }));
    expect(onDateChange).toHaveBeenCalled();
    expect(onDateChange.mock.calls[0]![0].getDate()).toBe(24);
    expect(onSlotChange).toHaveBeenCalledWith(undefined);
  });

  it('times: loading, an error, and none left', () => {
    const { rerender } = render(<BookingPage date={date} slots={[]} slotsLoading onConfirm={() => {}} />);
    expect(within(screen.getByRole('region', { name: 'Pick a time' })).queryByRole('radiogroup')).toBeNull();
    expect(document.querySelector('[aria-busy="true"]')).not.toBeNull();
    rerender(<BookingPage date={date} slots={[]} slotsLoading slotsError={<p role="alert">Could not load times</p>} onConfirm={() => {}} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Could not load times');
    rerender(<BookingPage date={date} slots={[]} onConfirm={() => {}} />);
    expect(screen.getByText('No times are free on this day.')).toBeInTheDocument();
  });

  it('a failed confirm shows its message and stays on the step', async () => {
    const onConfirm = vi.fn().mockRejectedValueOnce(new Error('That time was just taken')).mockRejectedValueOnce('offline');
    render(<BookingPage date={date} slots={slots} slot="09:00" onConfirm={onConfirm} />);
    await userEvent.click(screen.getByRole('button', { name: 'Confirm booking' }));
    expect(await screen.findByText('That time was just taken')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Confirm booking' }));
    expect(await screen.findByText('offline')).toBeInTheDocument();
    expect(screen.queryByRole('status', { name: 'Booking confirmed' })).toBeNull();
    expect(screen.getByRole('region', { name: 'Your booking' })).toHaveTextContent('9:00 am');
  });

  it('holds the time with a countdown; when it runs out, confirm is off and "Pick another time" goes back', async () => {
    const onHoldExpire = vi.fn();
    const onSlotChange = vi.fn();
    const onConfirm = vi.fn();
    const { rerender } = render(<BookingPage date={date} slots={slots} slot="14:00" onSlotChange={onSlotChange} holdUntil={T + 299_000} now={() => T} onConfirm={onConfirm} />);
    expect(screen.getByText('Held for')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole('region', { name: 'Your booking' })).toHaveTextContent('4:59'));
    expect(screen.getByRole('button', { name: 'Confirm booking' })).toBeEnabled();

    rerender(<BookingPage date={date} slots={slots} slot="14:00" onSlotChange={onSlotChange} holdUntil={new Date(T - 1000)} now={() => T} onHoldExpire={onHoldExpire} onConfirm={onConfirm} />);
    await waitFor(() => expect(onHoldExpire).toHaveBeenCalledTimes(1));
    expect(screen.getByRole('alert')).toHaveTextContent('We are no longer holding this time.');
    expect(screen.queryByText('Held for')).toBeNull();
    expect(screen.getByRole('button', { name: 'Confirm booking' })).toBeDisabled();
    await userEvent.click(screen.getByRole('button', { name: 'Pick another time' }));
    expect(onSlotChange).toHaveBeenCalledWith(undefined);
    expect(screen.getByText('Step 2 of 3')).toBeInTheDocument();
    expect(onConfirm).not.toHaveBeenCalled();

    // A new hold starts fresh.
    rerender(<BookingPage date={date} slots={slots} slot="14:00" holdUntil={T + 60_000} now={() => T} onConfirm={onConfirm} />);
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.getByRole('button', { name: 'Confirm booking' })).toBeEnabled();
  });

  it('`confirmed` shows the confirmed view directly, with a custom title; and it renders on the server', () => {
    render(<BookingPage confirmed date={date} slots={slots} slot="mystery" confirmation={{ title: 'See you soon' }} onConfirm={() => {}} />);
    expect(screen.getByRole('heading', { level: 1, name: 'See you soon' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('mystery')).toBeInTheDocument();
    expect(screen.queryByText('Reference')).toBeNull();
    expect(renderToString(<BookingPage service={service} date={date} slots={slots} slot="09:00" onConfirm={() => {}} />)).toContain('Intro call');
  });
});
