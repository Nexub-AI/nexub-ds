import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { ActivityFeed } from './ActivityFeed.js';

const meta: Meta = {
  title: 'Patterns/ActivityFeed',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

function AvatarCircle({ initials, color }: { initials: string; color: 'primary' | 'success' | 'warning' }) {
  return (
    <div
      style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: `var(--color-${color})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: 600,
        color: `var(--color-on-${color})`,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <div
      style={{
        maxWidth: '480px',
        border: '1px solid var(--color-border-default)',
        borderRadius: '12px',
        padding: '16px',
        background: 'var(--color-bg-default)',
      }}
    >
      <ActivityFeed.Root>
        <ActivityFeed.Item
          avatar={<AvatarCircle initials="AJ" color="primary" />}
          title="Alice Johnson created a new project"
          description="Project: Q2 Marketing Campaign"
          timestamp="2m ago"
        />
        <ActivityFeed.Item
          avatar={<AvatarCircle initials="DL" color="success" />}
          title="David Lee commented on a report"
          description="&ldquo;Revenue looks great this quarter!&rdquo;"
          timestamp="14m ago"
        />
        <ActivityFeed.Item
          avatar={<AvatarCircle initials="CW" color="warning" />}
          title="Carol White updated team settings"
          description="Changed billing contact to finance@nexub.io"
          timestamp="1h ago"
        />
      </ActivityFeed.Root>
    </div>
  ),
};
