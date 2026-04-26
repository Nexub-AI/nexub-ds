import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { DatePicker } from './DatePicker.js';

const meta: Meta = {
  title: 'Forms/DatePicker',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

function ControlledDatePicker() {
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  return (
    <div style={{ maxWidth: '280px' }}>
      <DatePicker value={date} onChange={setDate} placeholder="Pick a date" />
      {date && (
        <p style={{ marginTop: '12px', fontSize: '13px', color: 'var(--color-text-muted)' }}>
          Selected: {date.toLocaleDateString()}
        </p>
      )}
    </div>
  );
}

export const Default: Story = {
  render: () => <ControlledDatePicker />,
};

export const WithPresetDate: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date(2025, 5, 15));
    return (
      <div style={{ maxWidth: '280px' }}>
        <DatePicker value={date} onChange={setDate} />
      </div>
    );
  },
};
