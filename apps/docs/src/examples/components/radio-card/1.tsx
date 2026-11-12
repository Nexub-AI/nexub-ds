'use client'; // docs preview: server pages import every example

import { RadioCardGroup, RadioCard } from '@nexub/react';

export default function Example() {
  return (
    <RadioCardGroup aria-label="Billing" columns={2} defaultValue="yearly" className="w-full">
      <RadioCard value="monthly" title="Monthly" description="Billed every month." />
      <RadioCard value="yearly" title="Yearly" description="Two months free." />
    </RadioCardGroup>
  );
}
