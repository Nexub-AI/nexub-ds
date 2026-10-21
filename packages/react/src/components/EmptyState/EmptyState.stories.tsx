import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { EmptyState } from './EmptyState.js';

const meta: Meta = {
  title: 'Components/EmptyState',
  parameters: { layout: 'centered' },
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <EmptyState.Root>
      <EmptyState.Illustration>
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="2" />
          <path d="M20 32h24M32 20v24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </EmptyState.Illustration>
      <EmptyState.Title>No items yet</EmptyState.Title>
      <EmptyState.Description>
        Get started by creating your first item.
      </EmptyState.Description>
      <EmptyState.Actions>
        <button
          type="button"
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            background: 'var(--color-primary)',
            color: 'var(--color-on-primary)',
          }}
        >
          Create item
        </button>
      </EmptyState.Actions>
    </EmptyState.Root>
  ),
};

export const Simple: StoryObj = {
  render: () => (
    <EmptyState.Root>
      <EmptyState.Title>No results found</EmptyState.Title>
      <EmptyState.Description>Try adjusting your search or filters.</EmptyState.Description>
    </EmptyState.Root>
  ),
};
