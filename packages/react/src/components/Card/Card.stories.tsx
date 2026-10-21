import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Card, CardLink } from './Card.js';

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

/** Hover lifts on a spring (elevation 1 → 2); press sinks; the second card adds the opt-in sheen; the whole card is one link. */
export const Interactive: Story = {
  render: () => (
    <div className="grid max-w-3xl grid-cols-1 gap-4 p-6 sm:grid-cols-2">
      {[
        { title: 'Payments', body: 'Send and receive money in 40 currencies.', effect: 'none' as const },
        { title: 'Insights', body: 'Spending trends, updated as you go.', effect: 'sheen' as const },
      ].map((c) => (
        <Card key={c.title} variant="interactive" effect={c.effect} className="p-5">
          <h3 className="text-title-md">
            <CardLink href="#">{c.title}</CardLink>
          </h3>
          <p className="mt-1 text-body-md text-[var(--color-on-surface-variant)]">{c.body}</p>
        </Card>
      ))}
    </div>
  ),
};
