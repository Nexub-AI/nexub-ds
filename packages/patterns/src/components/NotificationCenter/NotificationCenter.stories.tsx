import type { Meta, StoryObj } from '@storybook/react';
import { EmptyStatePreset } from '@nexub/react';
import { NotificationCenter } from './NotificationCenter.js';

const meta: Meta = {
  title: 'Patterns/NotificationCenter',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <NotificationCenter
      notifications={[
        { id: '1', title: 'Deploy failed on main', timestamp: '2 min ago' },
        { id: '2', title: 'Invoice #1042 paid', timestamp: '1 h ago', read: true },
      ]}
      onOpen={() => {}}
      onMarkAllRead={() => {}}
    />
  ),
};

const stateLabel = 'flex items-center gap-2 text-label-md text-[var(--color-on-surface-variant)]';

/** 10.5: open each bell to see `loading`, `emptyState` and `errorState` (the error wins). */
export const DataStates: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-6">
      <span className={stateLabel}>
        Loading <NotificationCenter notifications={[]} loading />
      </span>
      <span className={stateLabel}>
        Empty <NotificationCenter notifications={[]} emptyState={<EmptyStatePreset kind="noData" size="sm" title="You’re all caught up" />} />
      </span>
      <span className={stateLabel}>
        Error <NotificationCenter notifications={[]} errorState={<EmptyStatePreset kind="serverError" size="sm" />} />
      </span>
    </div>
  ),
};
