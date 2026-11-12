'use client'; // docs preview: server pages import every example

import { Button } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex gap-2 flex-wrap items-center justify-center">
      <Button variant="filled">Primary</Button>
      <Button variant="outlined">Outline</Button>
      <Button variant="text">Ghost</Button>
      <Button variant="subtle">Subtle</Button>
      <Button variant="link">Link</Button>
    </div>
  );
}
