import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { HoverCard } from './HoverCard.js';

const meta: Meta = {
  title: 'Overlays/HoverCard',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <HoverCard.Root>
      <HoverCard.Trigger asChild>
        <a href="#" style={{ fontSize: '0.875rem', textDecoration: 'underline' }}>
          @janedoe
        </a>
      </HoverCard.Trigger>
      <HoverCard.Content>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '9999px',
                background: 'var(--color-bg-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: '0.875rem',
              }}
            >
              JD
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>Jane Doe</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>@janedoe</p>
            </div>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            Product designer and open-source contributor. Building great experiences.
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            Joined April 2021 &middot; 128 followers
          </p>
        </div>
        <HoverCard.Arrow />
      </HoverCard.Content>
    </HoverCard.Root>
  ),
};
