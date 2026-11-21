'use client'; // docs preview: server pages import every example

import { UsageTile } from '@nexub/react';

export default function Example() {
  return (
    <div className="grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
      <UsageTile label="Seats" used={12} limit={50} />
      <UsageTile label="Storage" used={8.6} limit={10} valueFormat={(n) => `${n} GB`} />
      <UsageTile label="API calls" used={100000} limit={100000} />
    </div>
  );
}
