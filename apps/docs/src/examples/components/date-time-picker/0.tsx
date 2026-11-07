'use client';

import * as React from 'react';
import { DateTimePicker } from '@nexub/react';

export default function Example() {
  const [starts, setStarts] = React.useState<Date | undefined>();
  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <DateTimePicker aria-label="Meeting starts" value={starts} onChange={setStarts} minuteStep={15} timeZone="Asia/Singapore" />
      <p className="text-body-sm text-[var(--color-on-surface-muted)]">{starts ? starts.toString() : 'Pick a date first; the time defaults to 09:00.'}</p>
    </div>
  );
}
