'use client'; // docs preview: server pages import every example

import { Truncate } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex w-56 max-w-full flex-col gap-2 text-body-md">
      <Truncate>Quarterly infrastructure invoice for the Singapore and Frankfurt regions</Truncate>
      <Truncate>Short text</Truncate>
    </div>
  );
}
