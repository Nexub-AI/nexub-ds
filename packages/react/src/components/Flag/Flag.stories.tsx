import type { Meta, StoryObj } from '@storybook/react';
import { Flag } from './Flag.js';

const meta: Meta<typeof Flag> = {
  title: 'Components/Flag',
  component: Flag,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Flag>;

export const Default: Story = {
  args: {
    code: 'SG',
    size: 'md',
  },
};
