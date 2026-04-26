import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './Label.js';

const meta: Meta<typeof Label> = {
  title: 'Components/Label',
  component: Label,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Label>;

export const Default: Story = {
  args: {
    children: 'Email address',
    size: 'md',
    required: false,
  },
};
