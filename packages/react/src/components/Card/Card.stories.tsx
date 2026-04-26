import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card.js';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    variant: 'surface',
    children: 'Card content goes here',
    className: 'p-4',
  },
};
