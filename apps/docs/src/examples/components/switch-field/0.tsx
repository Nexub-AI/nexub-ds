'use client'; // docs preview: server pages import every example

import { SwitchField } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <SwitchField label="Online store" description="Buyers can see and order from the shop" defaultChecked />
      <SwitchField label="Two-step sign-in" error="Required by your organisation" />
    </div>
  );
}
