import type { Meta, StoryObj } from '@storybook/react';
import { Tag } from './Tag.js';

const meta: Meta<typeof Tag> = {
  title: 'Components/Tag',
  component: Tag,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Tag>;

export const Default: Story = {
  args: {
    children: 'Design System',
    tone: 'neutral',
    size: 'md',
  },
};
