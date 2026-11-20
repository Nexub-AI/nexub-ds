'use client'; // docs preview: server pages import every example

import { Truncate } from '@nexub/react';

export default function Example() {
  return (
    <Truncate lines={2} as="p" className="w-56 text-body-md">
      Quarterly infrastructure invoice for the Singapore and Frankfurt regions, including premium support, data transfer and reserved capacity.
    </Truncate>
  );
}
