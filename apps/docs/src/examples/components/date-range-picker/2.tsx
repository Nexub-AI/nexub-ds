'use client';

import * as React from 'react';
import { DateRangePicker, type DateRange } from '@nexub/react';

export default function Example() {
  const [range, setRange] = React.useState<DateRange | undefined>();
  return (
    <div className="w-[300px]">
      <DateRangePicker aria-label="Report period" value={range} onChange={setRange} presets timeZone="Europe/London" />
    </div>
  );
}
