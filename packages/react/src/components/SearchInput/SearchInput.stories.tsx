import type { Meta, StoryObj } from '@storybook/react';
import { SearchInput } from './SearchInput.js';

const meta: Meta<typeof SearchInput> = {
  title: 'Components/SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {
  args: {
    placeholder: 'Search...',
    size: 'md',
  },
};

/** 10.4: the shared size scale and the read-only state. */
export const ConsistentControls: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 280 }}>
      <SearchInput size="sm" aria-label="Small" defaultValue="Small" />
      <SearchInput size="lg" aria-label="Large" defaultValue="Large" />
      <SearchInput readOnly aria-label="Read-only" defaultValue="Read-only" />
    </div>
  ),
};
