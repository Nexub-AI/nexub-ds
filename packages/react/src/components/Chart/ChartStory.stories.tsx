import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { BarChart, LineChart } from './index.js';

const meta: Meta = {
  title: 'Components/Chart/Storytelling (12.3)',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

const months = [
  { month: 'Jan', revenue: 9000, cost: 5000 },
  { month: 'Feb', revenue: 9500, cost: 5200 },
  { month: 'Mar', revenue: 10000, cost: 5100 },
  { month: 'Apr', revenue: 10600, cost: 4800 },
  { month: 'May', revenue: 11200, cost: 4600 },
  { month: 'Jun', revenue: 11800, cost: 4700 },
];
const usd = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);

/** A highlighted change: the delta between two points, computed and formatted, in the success or error colour. */
export const Change: Story = {
  render: () => (
    <div className="flex max-w-2xl flex-col gap-8">
      <LineChart title="Revenue" data={months} index="month" valueFormat={usd} series={[{ key: 'revenue', label: 'Revenue' }]}
        change={{ from: 'Mar', label: 'March', locale: 'en-US' }} />
      <BarChart title="Costs" data={months} index="month" valueFormat={usd} series={[{ key: 'cost', label: 'Cost', color: 2 }]}
        change={{ from: 'Jan', invert: true, label: 'January', locale: 'en-US' }} />
    </div>
  ),
};

/** Annotations (a point and a range) and reference lines (a target and a vertical marker), each also listed as text for screen readers. */
export const AnnotationsAndReferenceLines: Story = {
  render: () => (
    <div className="max-w-2xl">
      <LineChart title="Revenue against target" data={months} index="month" valueFormat={usd} area
        series={[{ key: 'revenue', label: 'Revenue' }]}
        annotations={[{ at: 'Feb', label: 'Launch', series: 'revenue' }, { at: 'Apr', to: 'May', label: 'Spring promo' }]}
        referenceLines={[{ value: 11000, label: 'Target', tone: 'good' }]} />
    </div>
  ),
};

/** In a right-to-left page the plot mirrors and every label still reads the right way. */
export const RightToLeft: Story = {
  render: () => (
    <div dir="rtl" className="max-w-2xl">
      <BarChart title="Revenue" data={months} index="month" valueFormat={usd} series={[{ key: 'revenue', label: 'Revenue' }]}
        annotations={[{ at: 'Feb', label: 'Launch' }]}
        referenceLines={[{ value: 10000, label: 'Average' }, { value: 'May', axis: 'category', label: 'New price' }]}
        change={{ from: 'Jan', label: 'January', locale: 'en-US' }} />
    </div>
  ),
};
