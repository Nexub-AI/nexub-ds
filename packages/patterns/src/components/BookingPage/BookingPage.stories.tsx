import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Button, FormField, Input } from '@nexub/react';
import { BookingPage, type BookingPageProps } from './BookingPage.js';

const meta: Meta<typeof BookingPage> = {
  title: 'Patterns/Pages/BookingPage',
  component: BookingPage,
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof BookingPage>;

// Fixed clock and dates, so screenshots are stable.
const NOW = new Date(2026, 10, 17, 9, 0).getTime();
const page: BookingPageProps = {
  as: 'div',
  service: { title: 'Intro call', duration: '30 minutes, video', price: 'Free', description: 'A first conversation about what you need.' },
  defaultDate: new Date(2026, 10, 20),
  minDate: new Date(2026, 10, 17),
  isDateDisabled: (d) => d.getDay() === 0 || d.getDay() === 6,
  slots: [
    { value: '09:00', label: '9:00 am' },
    { value: '09:30', label: '9:30 am' },
    { value: '11:00', label: '11:00 am', disabled: true },
    { value: '14:00', label: '2:00 pm' },
    { value: '15:30', label: '3:30 pm', hint: 'Last one' },
    { value: '18:00', label: '6:00 pm' },
  ],
  defaultSlot: '14:00',
  holdUntil: NOW + 299_000,
  now: () => NOW,
  details: (
    <FormField.Root name="name" required>
      <FormField.Label>Your name</FormField.Label>
      <FormField.Control>
        <Input defaultValue="Ada Park" autoComplete="name" />
      </FormField.Control>
      <FormField.Error />
    </FormField.Root>
  ),
  onConfirm: () => new Promise<void>((resolve) => setTimeout(resolve, 600)),
  confirmation: {
    description: 'We sent the details to ada@harbour.test.',
    reference: 'BK-7731',
    actions: <Button variant="tonal">Add to calendar</Button>,
  },
};

/** Date, time and summary side by side with room; one step at a time on a phone. */
export const Default: Story = { render: () => <BookingPage {...page} /> };

/** The confirmed view. */
export const Confirmed: Story = { render: () => <BookingPage {...page} confirmed /> };
