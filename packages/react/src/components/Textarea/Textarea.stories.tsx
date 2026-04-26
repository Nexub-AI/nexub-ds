import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './Textarea.js';

const meta: Meta<typeof Textarea> = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    placeholder: 'Write something...',
    size: 'md',
  },
};
