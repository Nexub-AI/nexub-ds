import type { Meta, StoryObj } from '@storybook/react';
import { StatusPill } from './StatusPill.js';

const meta: Meta<typeof StatusPill> = {
  title: 'Components/StatusPill',
  component: StatusPill,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof StatusPill>;

export const Default: Story = {
  args: {
    label: 'Active',
    tone: 'success',
    dot: true,
  },
};
