import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { UserCard } from './UserCard.js';

const meta: Meta = {
  title: 'Patterns/UserCard',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ maxWidth: '360px' }}>
      <UserCard
        name="Alice Johnson"
        role="Senior Product Designer"
        email="alice@nexub.io"
        avatarFallback="AJ"
      />
    </div>
  ),
};

export const WithActions: Story = {
  render: () => (
    <div style={{ maxWidth: '360px' }}>
      <UserCard
        name="David Lee"
        role="Engineering Lead"
        email="david@nexub.io"
        avatarFallback="DL"
        size="lg"
        actions={
          <button
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid var(--color-border-default)',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
            }}
          >
            View profile
          </button>
        }
      />
    </div>
  ),
};
