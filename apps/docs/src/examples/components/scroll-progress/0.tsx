'use client'; // docs preview: server pages import every example

import { ScrollProgress } from '@nexub/react';

export default function Example() {
  return (
    <div className="w-full text-body-sm text-[var(--color-on-surface-variant)]">
      <ScrollProgress />
      Scroll this page: the bar along the very top of the window fills as you read.
    </div>
  );
}
