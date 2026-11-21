import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { BarChart, DonutChart, LineChart } from './index.js';

const meta: Meta = {
  title: 'Components/Chart/Dashboards (11.3)',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

const months = [
  { month: 'Jan', usd: 12400, myr: 31000 },
  { month: 'Feb', usd: 13100, myr: null },
  { month: 'Mar', usd: null, myr: 35500 },
  { month: 'Apr', usd: 15800, myr: 38200 },
  { month: 'May', usd: 16200, myr: 39900 },
];
const usd = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);
const myr = (v: number) => new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR', maximumFractionDigits: 0 }).format(v);

/** Missing months are gaps, not zero; each series has its own currency formatter; a table view. */
export const GapsAndCurrencies: Story = {
  render: () => (
    <div className="flex max-w-2xl flex-col gap-8">
      <LineChart title="Revenue by currency" data={months} index="month" tableView series={[{ key: 'usd', label: 'USD', valueFormat: usd }, { key: 'myr', label: 'MYR', valueFormat: myr }]} />
      <BarChart title="Revenue (USD)" data={months} index="month" valueFormat={usd} series={[{ key: 'usd', label: 'USD' }]} />
    </div>
  ),
};

/** Tones beside the palette, a colour per bar, and whole-number ticks. */
export const TonesAndCounts: Story = {
  render: () => {
    const spend = [
      { month: 'Jan', spend: 82, budget: 100 },
      { month: 'Feb', spend: 97, budget: 100 },
      { month: 'Mar', spend: 118, budget: 100 },
      { month: 'Apr', spend: 91, budget: 100 },
    ];
    const hires = [
      { team: 'Sales', hires: 3 },
      { team: 'Ops', hires: 1 },
      { team: 'Product', hires: 2 },
    ];
    return (
      <div className="flex max-w-2xl flex-col gap-8">
        <BarChart title="Spend against budget" data={spend} index="month" series={[{ key: 'spend', label: 'Spend', color: 'good' }]} colorOf={(row) => (row.spend > row.budget ? 'danger' : row.spend > 95 ? 'warning' : undefined)} />
        <BarChart title="Hires this quarter" data={hires} index="team" integerTicks series={[{ key: 'hires', label: 'Hires' }]} />
      </div>
    );
  },
};

/** Horizontal bars for ranked lists with long names. */
export const Horizontal: Story = {
  render: () => (
    <div className="max-w-xl">
      <BarChart
        title="Top products by revenue"
        orientation="horizontal"
        valueFormat={usd}
        data={[
          { product: 'Enterprise plan (annual)', revenue: 48200 },
          { product: 'Team plan', revenue: 31900 },
          { product: 'Starter', revenue: 12800 },
          { product: 'Add-on: extra seats', revenue: 6400 },
        ]}
        index="product"
        series={[{ key: 'revenue', label: 'Revenue' }]}
      />
    </div>
  ),
};

/** A cash-flow waterfall: totals from zero, rises and falls from a running total. */
export const Waterfall: Story = {
  render: () => (
    <div className="max-w-2xl">
      <BarChart
        title="Cash flow, Q3"
        variant="waterfall"
        totalKey="total"
        valueFormat={usd}
        data={[
          { step: 'Opening', v: 120000, total: true },
          { step: 'Sales', v: 64000, total: false },
          { step: 'Payroll', v: -52000, total: false },
          { step: 'Refunds', v: -6000, total: false },
          { step: 'Interest', v: 1500, total: false },
          { step: 'Closing', v: 127500, total: true },
        ]}
        index="step"
        series={[{ key: 'v', label: 'Cash', color: 2 }]}
      />
    </div>
  ),
};

/** "Other" grouping, legend values and links, sizes. */
export const DonutOptions: Story = {
  render: () => (
    <div className="flex flex-wrap gap-10">
      <DonutChart
        title="Plans"
        size="lg"
        legendValues
        maxSlices={4}
        data={[
          { label: 'Enterprise', value: 42, href: '#enterprise' },
          { label: 'Team', value: 31, href: '#team' },
          { label: 'Starter', value: 15 },
          { label: 'Education', value: 6 },
          { label: 'Nonprofit', value: 4 },
          { label: 'Trial', value: 2 },
        ]}
        center="100"
      />
      <DonutChart title="Status" size="sm" data={[{ label: 'On track', value: 7, color: 'good' }, { label: 'At risk', value: 2, color: 'warning' }, { label: 'Late', value: 1, color: 'danger' }]} />
    </div>
  ),
};
