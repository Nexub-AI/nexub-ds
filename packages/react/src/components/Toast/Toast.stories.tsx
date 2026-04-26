import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { toast, Toaster } from './index.js';

const meta: Meta = {
  title: 'Feedback/Toast',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

function ToastDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px' }}>
      <button
        onClick={() => toast.success('Saved!')}
        style={{
          padding: '8px 16px',
          borderRadius: '6px',
          border: 'none',
          background: 'var(--color-brand-primary-500, #6366f1)',
          color: 'white',
          cursor: 'pointer',
          fontWeight: 500,
        }}
      >
        Show Success Toast
      </button>
      <button
        onClick={() => toast.error('Something went wrong.', { description: 'Please try again.' })}
        style={{
          padding: '8px 16px',
          borderRadius: '6px',
          border: 'none',
          background: '#ef4444',
          color: 'white',
          cursor: 'pointer',
          fontWeight: 500,
        }}
      >
        Show Error Toast
      </button>
      <button
        onClick={() =>
          toast.info('New update available', { description: 'Refresh to get the latest version.' })
        }
        style={{
          padding: '8px 16px',
          borderRadius: '6px',
          border: 'none',
          background: '#3b82f6',
          color: 'white',
          cursor: 'pointer',
          fontWeight: 500,
        }}
      >
        Show Info Toast
      </button>
      <Toaster />
    </div>
  );
}

export const Default: Story = {
  render: () => <ToastDemo />,
};
