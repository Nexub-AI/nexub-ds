import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from './IconButton.js';

const meta: Meta<typeof IconButton> = {
  title: 'Components/IconButton',
  component: IconButton,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof IconButton>;

export const Default: Story = {
  args: {
    label: 'Action',
    variant: 'ghost',
    size: 'md',
  },
};
