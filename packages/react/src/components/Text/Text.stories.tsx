import type { Meta, StoryObj } from '@storybook/react';
import { Text } from './Text.js';

const meta: Meta<typeof Text> = {
  title: 'Components/Text',
  component: Text,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Text>;

export const Default: Story = {
  args: {
    size: 'body',
    tone: 'default',
    children: 'The quick brown fox jumps over the lazy dog.',
  },
};
