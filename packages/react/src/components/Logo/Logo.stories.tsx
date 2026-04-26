import type { Meta, StoryObj } from '@storybook/react';
import { Logo } from './Logo.js';

const meta: Meta<typeof Logo> = {
  title: 'Components/Logo',
  component: Logo,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Logo>;

export const Default: Story = {
  args: {
    variant: 'full',
    size: 'md',
    tone: 'default',
  },
};

export const Mark: Story = {
  args: {
    variant: 'mark',
    size: 'md',
  },
};
