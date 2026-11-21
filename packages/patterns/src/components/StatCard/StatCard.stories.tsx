import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { StatCard } from './StatCard.js';

const meta: Meta = {
  title: 'Patterns/StatCard',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

const RevenueIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const UsersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export const Default: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 15rem), 1fr))', gap: '16px', maxWidth: '600px' }}>
      <StatCard
        label="Total Revenue"
        value="$84,320"
        delta="+12.5% vs last month"
        deltaType="increase"
        description="from last month"
        icon={<RevenueIcon />}
      />
      <StatCard
        label="Active Users"
        value="3,842"
        delta="-3.2% vs last month"
        deltaType="decrease"
        description="from last month"
        icon={<UsersIcon />}
      />
    </div>
  ),
};

export const Neutral: Story = {
  render: () => (
    <div style={{ maxWidth: '280px' }}>
      <StatCard
        label="Avg. Session Duration"
        value="4m 22s"
        delta="No change"
        deltaType="neutral"
        description="vs last week"
      />
    </div>
  ),
};

/** Churn going down is good: the arrow follows `deltaType`, the colour follows `sentiment`. */
export const SentimentOverride: Story = {
  render: () => (
    <div style={{ maxWidth: '280px' }}>
      <StatCard
        label="Churn"
        value="2.1%"
        delta="-0.4%"
        deltaType="decrease"
        sentiment="positive"
        description="vs last month"
      />
    </div>
  ),
};

const lively = (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', maxWidth: '900px' }}>
    <StatCard label="Revenue" value="$84,320" delta="12.5%" deltaType="increase" icon={<RevenueIcon />} category="emerald" trend={[12, 14, 13, 17, 16, 21, 24]} />
    <StatCard label="Active users" value="2,841" delta="4.1%" deltaType="increase" icon={<UsersIcon />} category="violet" trend={[30, 28, 31, 33, 32, 35, 36]} />
    <StatCard label="Refunds" value="18" delta="2" deltaType="decrease" sentiment="positive" icon={<RevenueIcon />} category="amber" trend={[9, 8, 8, 6, 7, 5, 4]} />
  </div>
);

/** 10.3: a category colours the icon chip and the trend line. */
export const CategoryAndTrend: Story = { render: () => lively };

/** Under the vivid expression the cards also lift on hover. */
export const Vivid: Story = { render: () => <div data-expression="vivid">{lively}</div> };

/** 10.5: `loading` swaps the value for a skeleton; the card keeps its size. */
export const DataStates: Story = {
  render: () => (
    <div className="grid w-full max-w-2xl grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] gap-4">
      <StatCard label="Total revenue" value="$48,295" delta="+12.5%" deltaType="increase" description="vs last month" icon={<RevenueIcon />} loading />
      <StatCard label="Total revenue" value="$48,295" delta="+12.5%" deltaType="increase" description="vs last month" icon={<RevenueIcon />} />
    </div>
  ),
};

/** 11.3: compact size, a note, `bad-when-high`, a numeric change (percent or absolute) and a custom change label. */
export const Options: Story = {
  render: () => (
    <div className="grid w-full max-w-3xl grid-cols-[repeat(auto-fit,minmax(13rem,1fr))] gap-4">
      <StatCard size="sm" label="Revenue" value="$84,320" change={0.125} changeLabel="vs last month" icon={<RevenueIcon />} />
      <StatCard size="sm" label="Cloud costs" value="$12,400" change={0.08} tone="bad-when-high" changeLabel="vs last month" note="Includes one-off migration" />
      <StatCard size="sm" label="Open tickets" value="42" change={-12} changeFormat="absolute" tone="bad-when-high" changeLabel="since Monday" />
      <StatCard label="Active users" value="3,842" change={214} changeFormat="absolute" changeLabel={<span>vs <strong>last week</strong></span>} icon={<UsersIcon />} />
    </div>
  ),
};
