'use client'; // docs preview: server pages import every example

import { DonutChart } from '@nexub/react';

const plans = [
  { label: 'Pro', value: 540 },
  { label: 'Team', value: 310 },
  { label: 'Starter', value: 220 },
  { label: 'Free', value: 130 },
];

export default function Example() {
  return (
    <DonutChart
      title="Customers by plan"
      data={plans}
      center={
        <span>
          1,200
          <br />
          <span className="text-label-sm text-[var(--color-on-surface-muted)]">customers</span>
        </span>
      }
    />
  );
}
