'use client'; // Sidebar.Root is a compound (dot) component, so it renders from a client file.

import { BarChart, PageHeader, Sidebar } from '@nexub/react';
import { StatCard } from '@nexub/patterns';
import { Home, Receipt, Settings, Wallet } from '@nexub/icons';

const SPENDING = [
  { month: 'Jul', spent: 1740 },
  { month: 'Aug', spent: 2210 },
  { month: 'Sep', spent: 2004 },
  { month: 'Oct', spent: 1842 },
];

/** A small app screen: the surfaces Vivid styles since 10.3. */
export function AppSample({ label }: { label: string }) {
  return (
    <div className="flex min-h-105 overflow-hidden rounded-shape-container border border-outline-variant bg-surface">
      <Sidebar.Root aria-label={`Sample navigation (${label})`} className="hidden w-44 shrink-0 sm:flex">
        <Sidebar.Group label={label}>
          <Sidebar.Item href="#app" active icon={<Home size={16} />}>Home</Sidebar.Item>
          <Sidebar.Item href="#app" icon={<Receipt size={16} />}>Invoices</Sidebar.Item>
          <Sidebar.Item href="#app" icon={<Settings size={16} />}>Settings</Sidebar.Item>
        </Sidebar.Group>
      </Sidebar.Root>
      <div className="flex min-w-0 flex-1 flex-col gap-4 p-4">
        <PageHeader level={3} wash title="Good morning, Mei" description="Two bills are due this week." />
        <StatCard label="Saved" value="S$2,400" delta="12%" deltaType="increase" icon={<Wallet size={16} />} category="emerald" trend={[10, 12, 13, 15, 16, 19, 22]} />
        <BarChart title={`Spending by month (${label})`} data={SPENDING} index="month" series={[{ key: 'spent', label: 'Spent' }]} size="sm" />
      </div>
    </div>
  );
}
