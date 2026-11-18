'use client'; // docs preview: server pages import every example

import { SuccessCheck } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-col items-center gap-3">
      <SuccessCheck size="lg" />
      <p className="m-0 text-title-md text-on-surface">Payment sent</p>
    </div>
  );
}
