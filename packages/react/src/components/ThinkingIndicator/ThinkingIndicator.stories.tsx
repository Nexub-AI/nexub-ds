import type { Meta, StoryObj } from '@storybook/react';
import { ThinkingIndicator } from './ThinkingIndicator.js';

const meta: Meta<typeof ThinkingIndicator> = {
  title: 'AI/ThinkingIndicator',
  component: ThinkingIndicator,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof ThinkingIndicator>;

export const Default: Story = {
  args: { size: 'md' },
};

export const Small: Story = {
  args: { size: 'sm' },
};

export const CustomLabel: Story = {
  args: { label: 'Searching 12 sources' },
};

export const ShapeOnly: Story = {
  args: { label: null },
};
