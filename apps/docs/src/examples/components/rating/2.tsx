'use client'; // docs preview: server pages import every example

import { Rating } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-col gap-2 items-start">
      <Rating size="sm" value={4} readOnly />
      <Rating size="md" value={4} readOnly />
      <Rating size="lg" value={4} readOnly />
    </div>
  );
}
