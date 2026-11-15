'use client'; // docs preview: server pages import every example

import { Sparkline } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex items-end gap-4 rounded-2xl border border-[var(--color-outline-variant)] p-4">
      <div>
        <p className="text-label-md text-[var(--color-on-surface-variant)]">Monthly revenue</p>
        <p className="text-title-lg text-[var(--color-on-surface)]">$68,420</p>
      </div>
      <Sparkline area values={[42, 48, 45, 56, 61, 68]} label="Up 62% over six months" color={2} />
    </div>
  );
}
