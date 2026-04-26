import type { Meta, StoryObj } from '@storybook/react';
import { HelperText } from './HelperText.js';

const meta: Meta<typeof HelperText> = {
  title: 'Components/HelperText',
  component: HelperText,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof HelperText>;

export const Default: Story = {
  args: {
    children: 'We will never share your email.',
  },
};
