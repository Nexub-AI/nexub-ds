'use client'; // docs preview: server pages import every example

import { LineChart } from '@nexub/react';

const months = [
  { month: 'Jan', usd: 12400, myr: 31000 },
  { month: 'Feb', usd: 13100, myr: null },
  { month: 'Mar', usd: null, myr: 35500 },
  { month: 'Apr', usd: 15800, myr: 38200 },
];
const usd = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);
const myr = (v: number) => new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR', maximumFractionDigits: 0 }).format(v);

export default function Example() {
  return (
    <LineChart
      className="w-full max-w-2xl"
      title="Revenue by currency"
      data={months}
      index="month"
      tableView
      series={[{ key: 'usd', label: 'USD', valueFormat: usd }, { key: 'myr', label: 'MYR', valueFormat: myr }]}
    />
  );
}
