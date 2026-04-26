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
