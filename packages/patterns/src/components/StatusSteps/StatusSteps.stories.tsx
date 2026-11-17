import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Button } from '@nexub/react';
import { StatusSteps } from './StatusSteps.js';

const meta: Meta<typeof StatusSteps> = { title: 'Patterns/StatusSteps', component: StatusSteps, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof StatusSteps>;

/** An application review. */
export const Default: Story = {
  render: () => (
    <div className="w-96 max-w-full">
      <StatusSteps
        aria-label="Application progress"
        steps={[
          { id: 'submitted', title: 'Submitted', status: 'done', timestamp: <time dateTime="2026-03-12">12 Mar</time> },
          { id: 'review', title: 'Under review', status: 'current', description: 'Usually takes two working days.' },
          { id: 'approved', title: 'Approved', status: 'upcoming' },
        ]}
      />
    </div>
  ),
};

export const WithError: Story = {
  render: () => (
    <div className="w-96 max-w-full">
      <StatusSteps
        aria-label="Application progress"
        steps={[
          { id: 'submitted', title: 'Submitted', status: 'done', timestamp: <time dateTime="2026-03-12">12 Mar</time> },
          {
            id: 'documents',
            title: 'Documents need another look',
            status: 'error',
            description: 'The proof of address is older than three months.',
            timestamp: <time dateTime="2026-03-13">13 Mar</time>,
            action: <Button size="sm" variant="tonal">Upload again</Button>,
          },
          { id: 'approved', title: 'Approved', status: 'upcoming' },
        ]}
      />
    </div>
  ),
};

export const Compact: Story = {
  render: () => (
    <div className="w-72">
      <StatusSteps
        size="sm"
        aria-label="Order progress"
        steps={[
          { title: 'Order placed', status: 'done' },
          { title: 'Packed', status: 'done' },
          { title: 'On its way', status: 'current' },
          { title: 'Delivered', status: 'upcoming' },
        ]}
      />
    </div>
  ),
};
