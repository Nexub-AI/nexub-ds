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
