import type { Meta, StoryObj } from '@storybook/react';
import { Banner } from './Banner.js';

const meta: Meta<typeof Banner> = {
  title: 'Components/Banner',
  component: Banner,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Banner>;

export const Default: Story = {
  args: {
    tone: 'warning',
    title: 'Scheduled maintenance',
    children: 'The platform will be unavailable on Sunday from 2–4 AM UTC.',
  },
};
