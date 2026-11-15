import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from './Progress.js';

const meta: Meta<typeof Progress> = {
  title: 'Components/Progress',
  component: Progress,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Progress>;

export const Default: Story = {
  args: {
    'aria-label': 'Upload progress',
    value: 65,
    max: 100,
    size: 'md',
    tone: 'neutral',
    animated: false,
  },
};

export const Circular: Story = {
  args: { 'aria-label': 'Upload progress', variant: 'circular', value: 65 },
};

export const CircularIndeterminate: Story = {
  args: { 'aria-label': 'Loading', variant: 'circular' },
};

export const Segmented: Story = {
  args: { 'aria-label': 'Step 3 of 5', segments: 5, value: 3, max: 5, tone: 'info' },
};
