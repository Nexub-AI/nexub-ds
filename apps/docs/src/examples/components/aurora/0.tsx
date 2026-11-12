'use client'; // docs preview: server pages import every example

import { Aurora, Button, EyebrowChip } from '@nexub/react';

export default function Example() {
  return (
    <div className="relative isolate flex w-full flex-col items-center gap-4 overflow-hidden rounded-shape-container px-6 py-14 text-center">
      <Aurora />
      <EyebrowChip>New</EyebrowChip>
      <h3 className="m-0 text-headline-md text-[var(--color-on-surface)]">Your money, at a glance</h3>
      <p className="m-0 max-w-[40ch] text-body-md text-[var(--color-on-surface)]">The colour follows your brand, theme and dark mode.</p>
      <Button>Get started</Button>
    </div>
  );
}
