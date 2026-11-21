'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { DatePicker } from '@nexub/react';

export default function Example() {
  const [month, setMonth] = React.useState<string | undefined>('2026-11');
  const [year, setYear] = React.useState<string | undefined>();
  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <DatePicker granularity="month" aria-label="Pay period" value={month} onValueChange={setMonth} />
      <DatePicker granularity="year" aria-label="Tax year" value={year} onValueChange={setYear} />
    </div>
  );
}
