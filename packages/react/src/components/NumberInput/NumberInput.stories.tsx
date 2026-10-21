import type { Meta, StoryObj } from '@storybook/react';
import { NumberInput } from './NumberInput.js';

const meta: Meta<typeof NumberInput> = {
  title: 'Components/NumberInput',
  component: NumberInput,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof NumberInput>;

export const Default: Story = {
  args: {
    'aria-label': 'Quantity',
    defaultValue: 0,
    step: 1,
    showSteppers: true,
    size: 'md',
  },
};
