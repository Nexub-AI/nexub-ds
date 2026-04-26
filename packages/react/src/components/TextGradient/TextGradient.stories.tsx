import type { Meta, StoryObj } from '@storybook/react';
import { TextGradient } from './TextGradient.js';

const meta: Meta<typeof TextGradient> = {
  title: 'Components/TextGradient',
  component: TextGradient,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof TextGradient>;

export const Default: Story = {
  args: {
    children: 'Nexub Design System',
  },
};
