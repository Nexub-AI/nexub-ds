'use client'; // docs preview: server pages import every example

import { Button } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex gap-2 flex-wrap items-center justify-center">
      <Button variant="filled" loading>Loading</Button>
      <Button variant="outlined" disabled>Disabled</Button>
    </div>
  );
}
