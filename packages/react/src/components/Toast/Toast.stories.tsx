import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { toast, Toaster } from './index.js';
import { Button } from '../Button/index.js';

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

const samples = [
  () => toast.success('Saved'),
  () => toast.info('New update available', { description: 'Refresh to get the latest version.' }),
  () =>
    toast.error('Upload failed', {
      description: 'The file is larger than 25 MB. Compress it or split it into parts, then try again.',
    }),
  () => toast.custom('Message archived', { action: { label: 'Undo', onClick: () => {} } }),
  () => toast.warning('Storage almost full', { description: '92% of your quota is used.' }),
];

/** Fire several toasts: they stack, newest in front. Hover or tab into the stack to fan it out (timers pause meanwhile). */
export const Stacked: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2 p-4">
      <Button onClick={() => samples[Math.floor(Math.random() * samples.length)]!()}>Fire one</Button>
      <Button variant="outline" onClick={() => samples.forEach((fire, i) => setTimeout(fire, i * 250))}>
        Fire five
      </Button>
      <Button variant="ghost" onClick={() => toast.dismiss()}>
        Clear
      </Button>
      <Toaster />
    </div>
  ),
};

export const StackedExpanded: Story = {
  name: 'Stacked (expand)',
  render: () => (
    <div className="flex flex-wrap gap-2 p-4">
      <Button onClick={() => samples.forEach((fire) => fire())}>Fire five</Button>
      <Toaster expand visibleToasts={4} />
    </div>
  ),
};
