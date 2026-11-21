'use client'; // docs preview: server pages import every example

import { BarChart } from '@nexub/react';

const cash = [
  { step: 'Opening', v: 120000, total: true },
  { step: 'Sales', v: 64000, total: false },
  { step: 'Payroll', v: -52000, total: false },
  { step: 'Refunds', v: -6000, total: false },
  { step: 'Closing', v: 126000, total: true },
];
const usd = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(v);

export default function Example() {
  return <BarChart className="w-full max-w-2xl" title="Cash flow, Q3" variant="waterfall" totalKey="total" valueFormat={usd} data={cash} index="step" series={[{ key: 'v', label: 'Cash', color: 2 }]} tableView />;
}
