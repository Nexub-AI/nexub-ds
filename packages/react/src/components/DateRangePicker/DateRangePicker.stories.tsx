import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { DateRangePicker, type DateRange } from './DateRangePicker.js';

const meta: Meta = {
  title: 'Forms/DateRangePicker',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

function ControlledDateRangePicker() {
  const [range, setRange] = React.useState<DateRange | undefined>(undefined);

  return (
    <div style={{ maxWidth: '360px' }}>
      <DateRangePicker value={range} onChange={setRange} placeholder="Select date range" />
      {range?.from && (
        <p style={{ marginTop: '12px', fontSize: '13px', color: 'var(--color-text-muted)' }}>
          {range.from.toLocaleDateString()}
          {range.to ? ` – ${range.to.toLocaleDateString()}` : ' – …'}
        </p>
      )}
    </div>
  );
}

export const Default: Story = {
  render: () => <ControlledDateRangePicker />,
};

export const WithPresetRange: Story = {
  render: () => {
    const [range, setRange] = React.useState<DateRange | undefined>({
      from: new Date(2025, 0, 1),
      to: new Date(2025, 0, 31),
    });
    return (
      <div style={{ maxWidth: '360px' }}>
        <DateRangePicker value={range} onChange={setRange} />
      </div>
    );
  },
};
