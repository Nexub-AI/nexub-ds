'use client'; // docs preview: server pages import every example

import { EyebrowChip } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-col gap-2 items-start">
      <EyebrowChip>Now available</EyebrowChip>
      <h2 className="m-0 text-headline-sm font-bold text-[var(--color-on-surface)]">Version 2.0</h2>
    </div>
  );
}
