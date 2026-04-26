import type { Meta, StoryObj } from '@storybook/react';
import { ErrorState } from './ErrorState.js';

const meta: Meta<typeof ErrorState> = {
  title: 'Components/ErrorState',
  component: ErrorState,
  parameters: { layout: 'centered' },
  argTypes: {
    tone: {
      control: 'select',
      options: ['error', 'warning', 'info'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ErrorState>;

export const Default: Story = {
  args: {
    title: 'Something went wrong',
    description: 'An unexpected error occurred. Please try again.',
    tone: 'error',
  },
};

export const WithRetry: Story = {
  args: {
    title: 'Failed to load data',
    description: 'We could not load the data. Please try again.',
    tone: 'error',
    onRetry: () => alert('Retrying...'),
  },
};

export const Warning: Story = {
  args: {
    title: 'Approaching limit',
    description: 'You are close to reaching your storage limit.',
    tone: 'warning',
  },
};

export const Info: Story = {
  args: {
    title: 'No data available',
    description: 'There is no data to display for the selected period.',
    tone: 'info',
  },
};
