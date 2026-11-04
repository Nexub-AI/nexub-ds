import * as React from 'react';
import { DateRangePicker } from '@nexub/react';

export default function Example() {
  const [range, setRange] = React.useState<{ from: Date | undefined; to: Date | undefined }>({
    from: new Date('2026-04-01'),
    to: new Date('2026-04-14'),
  });
  return (
    <DateRangePicker
      value={range}
      onChange={(r) => setRange({ from: r?.from, to: r?.to })}
      placeholder="Select date range…"
    />
  );
}
