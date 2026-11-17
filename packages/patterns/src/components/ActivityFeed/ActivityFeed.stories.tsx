import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { EmptyStatePreset } from '@nexub/react';
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
        border: '1px solid var(--color-outline-variant)',
        borderRadius: '12px',
        padding: '16px',
        background: 'var(--color-surface)',
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

const stateLabel = 'm-0 text-label-md text-[var(--color-on-surface-variant)]';

/** 10.5: `loading`, `emptyState` and `errorState` (the error wins). */
export const DataStates: Story = {
  render: () => (
    <div className="grid w-full max-w-4xl grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] items-start gap-6">
      <div className="flex min-w-0 flex-col gap-2">
        <p className={stateLabel}>Loading</p>
        <ActivityFeed.Root loading />
      </div>
      <div className="flex min-w-0 flex-col gap-2">
        <p className={stateLabel}>Empty</p>
        <ActivityFeed.Root emptyState={<EmptyStatePreset kind="noData" size="sm" />} />
      </div>
      <div className="flex min-w-0 flex-col gap-2">
        <p className={stateLabel}>Error</p>
        <ActivityFeed.Root errorState={<EmptyStatePreset kind="serverError" size="sm" />} />
      </div>
    </div>
  ),
};
