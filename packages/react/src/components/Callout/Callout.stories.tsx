import type { Meta, StoryObj } from '@storybook/react';
import { Callout } from './Callout.js';

const meta: Meta<typeof Callout> = {
  title: 'Components/Callout',
  component: Callout,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Callout>;

export const Default: Story = {
  args: {
    tone: 'info',
    children: 'Pro tip: You can use keyboard shortcuts to navigate faster.',
  },
};
