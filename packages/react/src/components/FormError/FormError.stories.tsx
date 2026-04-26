import type { Meta, StoryObj } from '@storybook/react';
import { FormError } from './FormError.js';

const meta: Meta<typeof FormError> = {
  title: 'Components/FormError',
  component: FormError,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof FormError>;

export const Default: Story = {
  args: {
    children: 'This field is required.',
  },
};
