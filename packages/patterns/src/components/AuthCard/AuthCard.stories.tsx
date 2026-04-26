import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { AuthCard } from './AuthCard.js';

const meta: Meta = {
  title: 'Patterns/AuthCard',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

const inputStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  height: '36px',
  padding: '4px 12px',
  borderRadius: '6px',
  border: '1px solid var(--color-border-default)',
  background: 'var(--color-bg-default)',
  fontSize: '14px',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 500,
  marginBottom: '6px',
  color: 'var(--color-text-primary)',
};

export const Default: Story = {
  render: () => (
    <div style={{ padding: '40px 16px', background: 'var(--color-bg-subtle, #f9fafb)' }}>
      <AuthCard
        title="Sign in to Nexub"
        description="Enter your credentials to access your workspace."
        footer={
          <>
            <span>
              Don&apos;t have an account?{' '}
              <a href="#" style={{ color: 'var(--color-brand-primary-500)' }}>
                Sign up
              </a>
            </span>
          </>
        }
      >
        <div>
          <label htmlFor="email" style={labelStyle}>
            Email
          </label>
          <input id="email" type="email" placeholder="you@example.com" style={inputStyle} />
        </div>
        <div>
          <label htmlFor="password" style={labelStyle}>
            Password
          </label>
          <input id="password" type="password" placeholder="••••••••" style={inputStyle} />
        </div>
        <button
          type="submit"
          style={{
            width: '100%',
            height: '36px',
            borderRadius: '6px',
            border: 'none',
            background: 'var(--color-brand-primary-500, #6366f1)',
            color: 'white',
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          Sign in
        </button>
      </AuthCard>
    </div>
  ),
};
