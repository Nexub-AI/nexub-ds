'use client'; // docs preview: server pages import every example

import { DatePicker } from '@nexub/react';

export default function Example() {
  return <DatePicker value={new Date('2026-01-15')} onValueChange={() => {}} />;
}
