'use client'; // docs preview: server pages import every example

import { BarChart } from '@nexub/react';

const months = [
  { month: 'Jan', cost: 5000 },
  { month: 'Feb', cost: 5200 },
  { month: 'Mar', cost: 5100 },
  { month: 'Apr', cost: 4800 },
  { month: 'May', cost: 4600 },
  { month: 'Jun', cost: 4700 },
];
const usd = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);

export default function Example() {
  return (
    <BarChart
      className="w-full max-w-2xl"
      title="Costs"
      data={months}
      index="month"
      valueFormat={usd}
      series={[{ key: 'cost', label: 'Cost', color: 2 }]}
      // Down is good for costs: `invert` shows the fall in the success colour.
      change={{ from: 'Jan', label: 'January', invert: true }}
      referenceLines={[{ value: 4900, label: 'Average' }, { value: 'Apr', axis: 'category', label: 'New supplier' }]}
    />
  );
}
