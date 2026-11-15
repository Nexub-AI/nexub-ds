import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge.js';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: 'Badge',
    tone: 'neutral',
    variant: 'solid',
    size: 'md',
  },
};

export const Dot: Story = {
  args: { dot: true, tone: 'success', 'aria-label': 'Online' },
};

export const Count: Story = {
  args: { count: 120, max: 99, tone: 'danger' },
};
