import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DateTimePicker } from './DateTimePicker.js';
import { TimePicker } from '../TimePicker/TimePicker.js';

const meta: Meta = {
  title: 'Components/DateTimePicker',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

function Demo() {
  const [value, setValue] = React.useState<Date | undefined>(new Date(2026, 10, 16, 9, 30));
  return <DateTimePicker aria-label="Starts" value={value} onValueChange={setValue} minuteStep={15} timeZone="Asia/Singapore" className="max-w-md" />;
}

export const Default: Story = { render: () => <Demo /> };
export const Time: Story = { render: () => <TimePicker aria-label="Reminder" defaultValue="14:30" wrapperClassName="w-36" /> };

/** 10.4: the shared size scale and the read-only state. */
export const ConsistentControls: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 280 }}>
      <DateTimePicker size="sm" aria-label="Small" value={new Date(2026, 10, 16, 9, 30)} />
      <DateTimePicker size="lg" aria-label="Large" value={new Date(2026, 10, 16, 9, 30)} />
      <DateTimePicker readOnly aria-label="Read-only" value={new Date(2026, 10, 16, 9, 30)} />
      <DateTimePicker invalid aria-label="Invalid" value={new Date(2026, 10, 16, 9, 30)} />
      <TimePicker readOnly size="sm" aria-label="Read-only time" defaultValue="14:30" />
    </div>
  ),
};

/** 10.6: a bottom sheet below the md breakpoint, the usual calendar popover above. */
export const SheetAuto: Story = {
  render: () => <DateTimePicker aria-label="Starts" defaultTime="09:30" sheet="auto" className="max-w-md" />,
};
