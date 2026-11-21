'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { DateRangePicker, type DateRange } from '@nexub/react';

export default function Example() {
  // Stored half-open, as the booking API does: 1–3 March is { from: 1 Mar, to: 4 Mar }.
  const [stay, setStay] = React.useState<DateRange | undefined>();
  const [nights, setNights] = React.useState<number | null>(null);
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <DateRangePicker
        aria-label="Stay"
        endExclusive
        value={stay}
        onChange={setStay}
        onComplete={({ from, to }) => setNights(Math.round((to.getTime() - from.getTime()) / 86400000))}
      />
      <p className="text-body-sm text-on-surface-muted">{nights === null ? 'Pick check-in and check-out' : `${nights} nights`}</p>
    </div>
  );
}
