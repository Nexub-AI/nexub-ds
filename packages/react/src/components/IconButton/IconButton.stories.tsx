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

export const Loading: Story = {
  args: { label: 'Saving', variant: 'solid', loading: true, children: '★' },
};

export const WithTooltip: Story = {
  args: { label: 'Favourite', variant: 'outline', tooltip: true, children: '★' },
};
