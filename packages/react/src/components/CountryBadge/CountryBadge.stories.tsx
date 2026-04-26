import type { Meta, StoryObj } from '@storybook/react';
import { CountryBadge } from './CountryBadge.js';

const meta: Meta<typeof CountryBadge> = {
  title: 'Components/CountryBadge',
  component: CountryBadge,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof CountryBadge>;

export const Default: Story = {
  args: {
    code: 'SG',
    label: 'Singapore',
    size: 'md',
  },
};
