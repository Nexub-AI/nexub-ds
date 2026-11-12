'use client'; // docs preview: server pages import every example

import { BarChart } from '@nexub/react';

const data = [
  { month: 'May', thisYear: 42, lastYear: 35 },
  { month: 'Jun', thisYear: 48, lastYear: 37 },
  { month: 'Jul', thisYear: 45, lastYear: 40 },
  { month: 'Aug', thisYear: 56, lastYear: 41 },
  { month: 'Sep', thisYear: 61, lastYear: 47 },
  { month: 'Oct', thisYear: 68, lastYear: 50 },
];

export default function Example() {
  return (
    <BarChart
      className="w-full"
      title="Revenue by month"
      data={data}
      index="month"
      series={[{ key: 'thisYear', label: '2026' }, { key: 'lastYear', label: '2025' }]}
      valueFormat={(v) => `$${v}k`}
    />
  );
}
