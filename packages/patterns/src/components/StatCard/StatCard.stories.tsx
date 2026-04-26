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
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', maxWidth: '600px' }}>
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
