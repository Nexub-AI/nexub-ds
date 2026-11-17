import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Select } from './Select.js';

const meta: Meta = {
  title: 'Components/Select',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Select.Root>
      <Select.Trigger aria-label="Country" style={{ width: '220px' }}>
        <Select.Value placeholder="Select a country" />
      </Select.Trigger>
      <Select.Content>
        <Select.Group>
          <Select.Label>Americas</Select.Label>
          <Select.Item value="us">United States</Select.Item>
          <Select.Item value="ca">Canada</Select.Item>
          <Select.Item value="mx">Mexico</Select.Item>
        </Select.Group>
        <Select.Separator />
        <Select.Group>
          <Select.Label>Europe</Select.Label>
          <Select.Item value="gb">United Kingdom</Select.Item>
          <Select.Item value="de">Germany</Select.Item>
        </Select.Group>
      </Select.Content>
    </Select.Root>
  ),
};

export const ClearableSearchable: Story = {
  render: () => (
    <div style={{ width: '260px', maxWidth: '100%' }}>
      <Select.Root clearable defaultValue="pro">
        <Select.Trigger aria-label="Plan">
          <Select.Value placeholder="Select a plan" />
        </Select.Trigger>
        <Select.Content searchable>
          <Select.Item value="free" description="For personal projects">Free</Select.Item>
          <Select.Item value="pro" description="For small teams">Pro</Select.Item>
          <Select.Item value="enterprise" description="SSO, audit logs and support">Enterprise</Select.Item>
        </Select.Content>
      </Select.Root>
    </div>
  ),
};

/** 10.4: the shared size scale and the read-only state. */
export const ConsistentControls: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 280 }}>
      <Select.Root defaultValue="ca">
        <Select.Trigger aria-label="Small" size="sm">
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="ca">Canada</Select.Item>
          <Select.Item value="mx">Mexico</Select.Item>
        </Select.Content>
      </Select.Root>
      <Select.Root defaultValue="ca">
        <Select.Trigger aria-label="Medium">
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="ca">Canada</Select.Item>
          <Select.Item value="mx">Mexico</Select.Item>
        </Select.Content>
      </Select.Root>
      <Select.Root defaultValue="ca">
        <Select.Trigger aria-label="Large" size="lg">
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="ca">Canada</Select.Item>
          <Select.Item value="mx">Mexico</Select.Item>
        </Select.Content>
      </Select.Root>
      <Select.Root defaultValue="ca">
        <Select.Trigger aria-label="Read-only" readOnly>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="ca">Canada</Select.Item>
          <Select.Item value="mx">Mexico</Select.Item>
        </Select.Content>
      </Select.Root>
    </div>
  ),
};
