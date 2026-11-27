'use client'; // docs preview: server pages import every example

import { LineChart } from '@nexub/react';

const months = [
  { month: 'Jan', revenue: 9000 },
  { month: 'Feb', revenue: 9500 },
  { month: 'Mar', revenue: 10000 },
  { month: 'Apr', revenue: 10600 },
  { month: 'May', revenue: 11200 },
  { month: 'Jun', revenue: 11800 },
];
const usd = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);

export default function Example() {
  return (
    <LineChart
      className="w-full max-w-2xl"
      title="Revenue against target"
      data={months}
      index="month"
      valueFormat={usd}
      series={[{ key: 'revenue', label: 'Revenue' }]}
      change={{ from: 'Mar', label: 'March' }}
      annotations={[{ at: 'Feb', label: 'Launch', series: 'revenue' }, { at: 'Apr', to: 'May', label: 'Spring promo' }]}
      referenceLines={[{ value: 11000, label: 'Target', tone: 'good' }]}
    />
  );
}
