import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from './Alert.js';

const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  args: {
    tone: 'info',
    title: 'Heads up!',
    children: 'This is an informational alert message.',
  },
};
