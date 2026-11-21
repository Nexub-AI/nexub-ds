'use client'; // docs preview: server pages import every example

import { BarChart } from '@nexub/react';

const products = [
  { product: 'Enterprise plan (annual)', revenue: 48200 },
  { product: 'Team plan', revenue: 31900 },
  { product: 'Starter', revenue: 12800 },
];
const spend = [
  { month: 'Jan', spend: 82 },
  { month: 'Feb', spend: 97 },
  { month: 'Mar', spend: 118 },
];

export default function Example() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-8">
      <BarChart title="Top products" orientation="horizontal" data={products} index="product" series={[{ key: 'revenue', label: 'Revenue' }]} />
      <BarChart title="Spend against a budget of 100" data={spend} index="month" series={[{ key: 'spend', label: 'Spend', color: 'good' }]} colorOf={(row) => (row.spend > 100 ? 'danger' : undefined)} />
    </div>
  );
}
