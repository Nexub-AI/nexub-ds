import type { Meta, StoryObj } from '@storybook/react';
import { GradientDivider } from './GradientDivider.js';

const meta: Meta<typeof GradientDivider> = {
  title: 'Components/GradientDivider',
  component: GradientDivider,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof GradientDivider>;

export const Default: Story = {
  args: {
    height: 3,
    orientation: 'horizontal',
  },
};
