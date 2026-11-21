'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { DateTimePicker } from '@nexub/react';

export default function Example() {
  const [reminder, setReminder] = React.useState<Date | undefined>(new Date(2026, 10, 24, 9, 0));
  return (
    <div className="w-full max-w-md">
      <DateTimePicker aria-label="Remind me" clearable value={reminder} onValueChange={setReminder} />
    </div>
  );
}
