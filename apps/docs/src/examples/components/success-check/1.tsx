'use client'; // docs preview: server pages import every example

import { SuccessCheck } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex items-center gap-4">
      <SuccessCheck size="sm" label="Saved" />
      <SuccessCheck size="md" label="Saved" />
      <SuccessCheck size="lg" label="Saved" />
    </div>
  );
}
