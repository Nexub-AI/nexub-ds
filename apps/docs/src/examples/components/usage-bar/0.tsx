'use client'; // docs preview: server pages import every example

import { UsageBar } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <UsageBar aria-label="Seats" used={18} limit={50} />
      <UsageBar aria-label="Seats" used={42} limit={50} />
      <UsageBar aria-label="Seats" used={50} limit={50} />
      <UsageBar aria-label="Projects" used={7} limit={null} />
    </div>
  );
}
