import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { TimeSlotPicker, type TimeSlot } from './TimeSlotPicker.js';

const slots: TimeSlot[] = [
  { value: '09:00' },
  { value: '09:30' },
  { value: '10:00', disabled: true },
  { value: '11:30', hint: 'Last one' },
  { value: '13:00' },
  { value: '14:30' },
  { value: '16:00', disabled: true },
  { value: '17:30' },
  { value: '19:00' },
];

const meta: Meta<typeof TimeSlotPicker> = {
  title: 'Components/TimeSlotPicker',
  component: TimeSlotPicker,
  tags: ['autodocs'],
  decorators: [(Story) => <div className="w-96 max-w-full"><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof TimeSlotPicker>;

export const Default: Story = { args: { slots, defaultValue: '09:30', 'aria-label': 'Start time' } };

export const Grouped: Story = { args: { slots, groupBy: 'period', columns: 3, defaultValue: '13:00', 'aria-label': 'Start time' } };

export const States: Story = {
  render: () => {
    const few = slots.slice(0, 4);
    return (
      <div className="flex flex-col gap-6">
        <TimeSlotPicker aria-label="Small" size="sm" slots={few} defaultValue="09:00" />
        <TimeSlotPicker aria-label="Large" size="lg" slots={few} defaultValue="09:00" />
        <TimeSlotPicker aria-label="Invalid" invalid slots={few} />
        <TimeSlotPicker aria-label="Disabled" disabled slots={few} defaultValue="09:00" />
        <TimeSlotPicker aria-label="Read-only" readOnly slots={few} defaultValue="09:30" />
        <TimeSlotPicker aria-label="Empty" slots={[]} />
      </div>
    );
  },
};
