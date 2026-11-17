import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { PageHeader } from './PageHeader.js';

const meta: Meta<typeof PageHeader> = {
  title: 'Components/PageHeader',
  component: PageHeader,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof PageHeader>;

export const Default: Story = {
  args: {
    title: 'Dashboard',
    description: 'Overview of your account activity and metrics.',
  },
};

export const WithActions: Story = {
  args: {
    title: 'Projects',
    description: 'Manage your projects.',
    actions: (
      <button
        type="button"
        style={{ padding: '0.5rem 1rem', borderRadius: '0.375rem', background: 'var(--color-primary)', color: 'var(--color-on-primary)' }}
      >
        New Project
      </button>
    ),
  },
};

export const WithBreadcrumb: Story = {
  args: {
    title: 'Project Settings',
    breadcrumb: <nav aria-label="breadcrumb">Home / Projects / Settings</nav>,
    actions: (
      <button type="button" style={{ padding: '0.5rem 1rem', borderRadius: '0.375rem' }}>
        Save
      </button>
    ),
  },
};

/** A section header inside a page that already has an h1. */
export const Level2: Story = {
  args: {
    title: 'Billing',
    description: 'Invoices and payment methods.',
    level: 2,
  },
};

/** 10.3: `wash` sits the header on a tonal panel. */
export const Wash: Story = {
  args: { title: 'Good morning, Mei', description: 'Here is what changed since yesterday.', wash: true },
};

/** Under the vivid expression the title is heavier and the wash carries the accent. */
export const Vivid: Story = {
  render: () => (
    <div data-expression="vivid" className="flex flex-col gap-6">
      <PageHeader title="Good morning, Mei" description="Here is what changed since yesterday." wash />
      <PageHeader title="Invoices" description="Sent and received this quarter." level={2} />
    </div>
  ),
};
