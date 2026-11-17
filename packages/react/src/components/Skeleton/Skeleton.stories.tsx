import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton, SkeletonText } from './Skeleton.js';
import { SkeletonPreset } from './Skeleton.js';

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

/** Presets for the loading state of common layouts. */
export const DataStates: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6">
      {(['card', 'tableRow', 'listRow', 'chart', 'form'] as const).map((preset) => (
        <SkeletonPreset key={preset} preset={preset} count={preset === 'card' || preset === 'chart' ? 1 : 3} className="min-w-0 flex-1 basis-60" />
      ))}
    </div>
  ),
};
