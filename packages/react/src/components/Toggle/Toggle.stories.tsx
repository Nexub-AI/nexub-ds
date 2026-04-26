import type { Meta, StoryObj } from '@storybook/react';
import { Toggle } from './Toggle.js';

const meta: Meta<typeof Toggle> = {
  title: 'Components/Toggle',
  component: Toggle,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
  args: {
    children: 'Bold',
  },
};
