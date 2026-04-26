import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from './Separator.js';

const meta: Meta<typeof Separator> = {
  title: 'Components/Separator',
  component: Separator,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Separator>;

export const Default: Story = {
  args: {
    orientation: 'horizontal',
    tone: 'neutral',
  },
};
