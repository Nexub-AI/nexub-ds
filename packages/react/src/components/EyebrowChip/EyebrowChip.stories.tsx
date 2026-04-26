import type { Meta, StoryObj } from '@storybook/react';
import { EyebrowChip } from './EyebrowChip.js';

const meta: Meta<typeof EyebrowChip> = {
  title: 'Components/EyebrowChip',
  component: EyebrowChip,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof EyebrowChip>;

export const Default: Story = {
  args: {
    children: 'New Feature',
    tone: 'neutral',
  },
};
