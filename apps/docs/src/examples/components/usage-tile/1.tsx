'use client'; // docs preview: server pages import every example

import { Button, UsageTile } from '@nexub/react';

export default function Example() {
  return (
    <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
      <UsageTile label="Projects" used={42} limit={null} note="Included in your plan" />
      <UsageTile label="Seats" used={46} limit={50} note="Billed per seat each month" action={<Button size="sm" variant="text">Add seats</Button>} />
    </div>
  );
}
