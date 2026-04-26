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
        style={{ padding: '0.5rem 1rem', borderRadius: '0.375rem', background: 'var(--color-brand-primary-500)', color: 'white' }}
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
