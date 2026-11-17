'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { TimeSlotPicker } from '@nexub/react';

const slots = [
  { value: '09:00' },
  { value: '09:30' },
  { value: '10:00', disabled: true },
  { value: '10:30' },
  { value: '11:00', hint: 'Last one' },
  { value: '11:30' },
];

export default function Example() {
  const [time, setTime] = React.useState('09:30');
  return (
    <div className="flex w-96 max-w-full flex-col gap-3">
      <TimeSlotPicker aria-label="Start time" slots={slots} value={time} onValueChange={setTime} />
      <p aria-live="polite" className="text-body-sm text-[var(--color-on-surface-muted)]">
        Selected: {time}
      </p>
    </div>
  );
}
