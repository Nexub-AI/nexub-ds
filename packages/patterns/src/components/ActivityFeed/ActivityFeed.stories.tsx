import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { EmptyStatePreset, IconButton } from '@nexub/react';
import { MoreHorizontal } from '@nexub/icons';
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

/** 11.5: `Group` headers, `Date` timestamps (focus one for the full date), `tone` and an actions slot. */
export const GroupsAndTones: Story = {
  render: () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60_000);
    const more = (
      <IconButton size="xs" variant="ghost" label="More actions">
        <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
      </IconButton>
    );
    return (
      <div className="max-w-lg">
        <ActivityFeed.Root>
          <ActivityFeed.Group label="Today">
            <ActivityFeed.Item tone="success" title="Deploy to production finished" timestamp={fiveMinutesAgo} actions={more} />
            <ActivityFeed.Item
              avatar={<AvatarCircle initials="AJ" color="primary" />}
              tone="danger"
              title="Alice Johnson's import failed"
              description={<ul className="list-disc ps-4"><li>Row 12: missing email</li><li>Row 40: duplicate ID</li></ul>}
              timestamp={fiveMinutesAgo}
              actions={more}
            />
          </ActivityFeed.Group>
          <ActivityFeed.Group label="Earlier">
            <ActivityFeed.Item tone="info" title="Workspace created" timestamp={new Date(2025, 0, 14, 9, 30)} />
          </ActivityFeed.Group>
        </ActivityFeed.Root>
      </div>
    );
  },
};
