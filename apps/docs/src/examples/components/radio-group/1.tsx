'use client'; // docs preview: server pages import every example

import { RadioGroup, Label } from '@nexub/react';

export default function Example() {
  return (
    <RadioGroup.Root defaultValue="monthly" orientation="horizontal">
      <div className="flex gap-4">
        {[{ value: 'monthly', label: 'Monthly' }, { value: 'annual', label: 'Annual' }].map(({ value, label }) => (
          <div key={value} className="flex items-center gap-2">
            <RadioGroup.Item value={value} id={`rgh-${value}`} />
            <Label htmlFor={`rgh-${value}`}>{label}</Label>
          </div>
        ))}
      </div>
    </RadioGroup.Root>
  );
}
