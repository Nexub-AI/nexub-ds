import type { Meta, StoryObj } from '@storybook/react';
import { FilterChip } from './FilterChip.js';

const meta: Meta<typeof FilterChip> = {
  title: 'Components/FilterChip',
  component: FilterChip,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof FilterChip>;

export const Default: Story = {
  args: {
    children: 'Category',
    selected: false,
    count: 3,
  },
};

/** 10.4: the three sizes, with a count. */
export const ConsistentControls: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <FilterChip key={size} size={size} count={12}>
          {size}
        </FilterChip>
      ))}
      <FilterChip size="sm" selected count={3} onRemove={() => {}}>
        selected
      </FilterChip>
    </div>
  ),
};
