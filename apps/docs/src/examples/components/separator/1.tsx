'use client'; // docs preview: server pages import every example

import { Separator } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex h-8 items-center gap-4">
      <span className="text-on-surface-variant text-body-sm">Left</span>
      <Separator orientation="vertical" />
      <span className="text-on-surface-variant text-body-sm">Right</span>
    </div>
  );
}
