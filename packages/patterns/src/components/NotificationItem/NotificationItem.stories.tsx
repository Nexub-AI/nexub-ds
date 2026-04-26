import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { NotificationItem } from './NotificationItem.js';

const meta: Meta = {
  title: 'Patterns/NotificationItem',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

const BellIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const Default: Story = {
  render: () => (
    <div
      style={{
        maxWidth: '420px',
        border: '1px solid var(--color-border-default)',
        borderRadius: '12px',
        overflow: 'hidden',
        background: 'var(--color-bg-default)',
      }}
    >
      <NotificationItem
        title="Your export is ready"
        description="The Q1 revenue report has finished generating and is ready to download."
        timestamp="Just now"
        read={false}
        icon={<BellIcon />}
        onDismiss={() => {}}
      />
      <NotificationItem
        title="Team member joined"
        description="Eva Martinez accepted your invitation and joined the workspace."
        timestamp="3 hours ago"
        read
        icon={<CheckIcon />}
        onDismiss={() => {}}
      />
    </div>
  ),
};
