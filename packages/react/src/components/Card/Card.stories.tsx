import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Card } from './Card.js';

const GRADIENT = 'linear-gradient(135deg, #6366f1 0%, #ec4899 50%, #f59e0b 100%)';

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

export const Glass: Story = {
  render: () => (
    <div style={{ background: GRADIENT, padding: 48, borderRadius: 12, display: 'flex', gap: 24 }}>
      <Card className="p-6" style={{ width: 200 }}>
        <strong>Solid</strong>
      </Card>
      <Card surface="glass" className="p-6" style={{ width: 200 }}>
        <strong>Glass</strong>
      </Card>
    </div>
  ),
};
