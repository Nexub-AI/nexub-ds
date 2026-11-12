'use client'; // docs preview: server pages import every example

import { Textarea } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-col gap-2 items-start w-[280px]">
      <Textarea size="sm" placeholder="Small" rows={2} />
      <Textarea size="md" placeholder="Medium" rows={3} />
      <Textarea size="lg" placeholder="Large" rows={4} />
    </div>
  );
}
