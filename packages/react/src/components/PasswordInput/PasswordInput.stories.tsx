import type { Meta, StoryObj } from '@storybook/react';
import { PasswordInput } from './PasswordInput.js';

const meta: Meta<typeof PasswordInput> = {
  title: 'Components/PasswordInput',
  component: PasswordInput,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof PasswordInput>;

export const Default: Story = {
  args: {
    placeholder: 'Enter password...',
    size: 'md',
  },
};
