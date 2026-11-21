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
        <p style={{ marginTop: '12px', fontSize: '13px', color: 'var(--color-on-surface-muted)' }}>
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

/** 10.4: the shared size scale and the read-only state. */
export const ConsistentControls: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 280 }}>
      <DateRangePicker size="sm" aria-label="Small" value={{ from: new Date(2024, 0, 15), to: new Date(2024, 0, 20) }} />
      <DateRangePicker size="md" aria-label="Medium" value={{ from: new Date(2024, 0, 15), to: new Date(2024, 0, 20) }} />
      <DateRangePicker size="lg" aria-label="Large" value={{ from: new Date(2024, 0, 15), to: new Date(2024, 0, 20) }} />
      <DateRangePicker readOnly aria-label="Read-only" value={{ from: new Date(2024, 0, 15), to: new Date(2024, 0, 20) }} />
    </div>
  ),
};

/** 10.6: a bottom sheet below the md breakpoint, the usual popover above. */
export const SheetAuto: Story = {
  render: () => (
    <div style={{ maxWidth: '17.5rem' }}>
      <DateRangePicker aria-label="Period" placeholder="Select date range" sheet="auto" />
    </div>
  ),
};

/** 11.2: a half-open range (the end is the day after) and onComplete once both ends are set. */
export const EndExclusive: Story = {
  render: () => {
    const [range, setRange] = React.useState<DateRange | undefined>({ from: new Date(2026, 2, 1), to: new Date(2026, 2, 4) });
    const [done, setDone] = React.useState('');
    return (
      <div style={{ display: 'grid', gap: 8, maxWidth: 320 }}>
        <DateRangePicker
          aria-label="Stay"
          endExclusive
          value={range}
          onChange={setRange}
          onComplete={(r) => setDone(`${r.from.toDateString()} → ${r.to.toDateString()} (exclusive)`)}
        />
        <span>{done || 'Pick two days'}</span>
      </div>
    );
  },
};
