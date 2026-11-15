'use client'; // docs preview: server pages import every example

import { RadioGroup, Label } from '@nexub/react';

export default function Example() {
  return (
    <RadioGroup.Root defaultValue="monthly">
      <div className="flex flex-col gap-2 items-start">
        {['Monthly', 'Yearly', 'Lifetime'].map((opt) => (
          <div key={opt} className="flex items-center gap-2">
            <RadioGroup.Item value={opt.toLowerCase()} id={`rg-${opt}`} />
            <Label htmlFor={`rg-${opt}`}>{opt}</Label>
          </div>
        ))}
      </div>
    </RadioGroup.Root>
  );
}
