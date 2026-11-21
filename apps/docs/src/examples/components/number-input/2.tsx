'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { NumberInput } from '@nexub/react';

export default function Example() {
  const [value, setValue] = React.useState<number | null>(null);
  return (
    <div className="flex w-56 flex-col gap-2">
      <NumberInput nullable aria-label="Seat limit" placeholder="No limit" min={15} max={500} step="any" showSteppers value={value} onValueChange={setValue} />
      <span className="text-body-sm text-on-surface-muted">{value === null ? 'No limit (null)' : `${value} seats`}</span>
    </div>
  );
}
