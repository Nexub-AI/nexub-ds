import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton, SkeletonText } from './Skeleton.js';

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  args: {
    shape: 'line',
    width: 200,
    height: 16,
    animated: true,
  },
};

export const Shimmer: Story = {
  args: { shape: 'line', width: 200, height: 16, animation: 'shimmer' },
};

export const Text: Story = {
  render: () => <SkeletonText lines={3} animation="shimmer" />,
};
