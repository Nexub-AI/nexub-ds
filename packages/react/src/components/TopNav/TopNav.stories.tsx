import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { TopNav } from './TopNav.js';

const meta: Meta = {
  title: 'Navigation/TopNav',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <TopNav.Root>
      <TopNav.Logo>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 700,
            fontSize: '18px',
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <rect width="24" height="24" rx="6" fill="var(--color-brand-primary-500, #6366f1)" />
            <path d="M7 17L12 7l5 10H7z" fill="white" />
          </svg>
          Nexub
        </span>
      </TopNav.Logo>

      <TopNav.Menu>
        <TopNav.Item href="#" active>
          Dashboard
        </TopNav.Item>
        <TopNav.Item href="#">Analytics</TopNav.Item>
        <TopNav.Item href="#">Projects</TopNav.Item>
        <TopNav.Item href="#">Settings</TopNav.Item>
      </TopNav.Menu>

      <TopNav.Actions>
        <button
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '32px',
            width: '32px',
            borderRadius: '50%',
            background: 'var(--color-bg-subtle, #f4f4f5)',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '13px',
          }}
          aria-label="User menu"
        >
          JD
        </button>
      </TopNav.Actions>
    </TopNav.Root>
  ),
};
