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
