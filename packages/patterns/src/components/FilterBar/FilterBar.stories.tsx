import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { FilterBar } from './FilterBar.js';

const meta: Meta = {
  title: 'Patterns/FilterBar',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

const chipStyle = (active: boolean): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '4px 12px',
  borderRadius: '9999px',
  fontSize: '13px',
  fontWeight: 500,
  border: '1px solid var(--color-border-default)',
  cursor: 'pointer',
  background: active ? 'var(--color-brand-primary-500, #6366f1)' : 'transparent',
  color: active ? 'white' : 'var(--color-text-primary)',
});

function FilterBarDemo() {
  const [search, setSearch] = React.useState('');
  const [activeFilter, setActiveFilter] = React.useState<string | null>(null);

  const filters = ['All', 'Active', 'Inactive', 'Pending'];

  return (
    <FilterBar
      searchPlaceholder="Search users…"
      searchValue={search}
      onSearch={setSearch}
      filters={
        <>
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f === 'All' ? null : f)}
              style={chipStyle(f === 'All' ? activeFilter === null : activeFilter === f)}
            >
              {f}
            </button>
          ))}
        </>
      }
      actions={
        <button
          style={{
            padding: '6px 14px',
            borderRadius: '6px',
            border: 'none',
            background: 'var(--color-brand-primary-500, #6366f1)',
            color: 'white',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 600,
          }}
        >
          + Invite
        </button>
      }
    />
  );
}

export const Default: Story = {
  render: () => <FilterBarDemo />,
};
