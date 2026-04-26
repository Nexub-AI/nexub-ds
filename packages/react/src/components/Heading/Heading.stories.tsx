import type { Meta, StoryObj } from '@storybook/react';
import { Heading } from './Heading.js';

const meta: Meta<typeof Heading> = {
  title: 'Components/Heading',
  component: Heading,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Heading>;

export const Default: Story = {
  args: {
    level: 2,
    children: 'Section heading',
  },
};

export const Display: Story = {
  args: {
    size: 'display',
    children: 'Display heading',
  },
};
