import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Tabs } from './Tabs.js';

const meta: Meta = {
  title: 'Navigation/Tabs',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ width: '480px' }}>
      <Tabs.Root defaultValue="overview">
        <Tabs.List>
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
          <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="overview">
          <div style={{ padding: '16px 4px', fontSize: '14px', lineHeight: '1.6' }}>
            <p style={{ fontWeight: 600, marginBottom: '4px' }}>Project Overview</p>
            <p style={{ color: 'var(--color-text-muted, #64748b)', margin: 0 }}>
              This is your project dashboard. Track progress, review recent activity, and manage
              your team from this central hub.
            </p>
          </div>
        </Tabs.Content>
        <Tabs.Content value="settings">
          <div style={{ padding: '16px 4px', fontSize: '14px', lineHeight: '1.6' }}>
            <p style={{ fontWeight: 600, marginBottom: '4px' }}>Settings</p>
            <p style={{ color: 'var(--color-text-muted, #64748b)', margin: 0 }}>
              Configure your project name, visibility, integrations, and notification preferences
              here.
            </p>
          </div>
        </Tabs.Content>
        <Tabs.Content value="billing">
          <div style={{ padding: '16px 4px', fontSize: '14px', lineHeight: '1.6' }}>
            <p style={{ fontWeight: 600, marginBottom: '4px' }}>Billing</p>
            <p style={{ color: 'var(--color-text-muted, #64748b)', margin: 0 }}>
              Manage your subscription plan, payment method, and view past invoices on this page.
            </p>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  ),
};

/**
 * Panels with their own display classes (`flex`, `md:grid`). Only the active
 * panel shows: inactive ones stay hidden whatever display class they get.
 */
export const ContentWithDisplayClass: Story = {
  render: () => (
    <Tabs.Root defaultValue="list" className="w-[420px]">
      <Tabs.List>
        <Tabs.Trigger value="list">List</Tabs.Trigger>
        <Tabs.Trigger value="grid">Grid</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="list" className="flex flex-col gap-2 p-2">
        <span>Flex panel: item one</span>
        <span>Flex panel: item two</span>
      </Tabs.Content>
      <Tabs.Content value="grid" className="flex md:grid md:grid-cols-2 gap-2 p-2">
        <span>Grid panel: A</span>
        <span>Grid panel: B</span>
      </Tabs.Content>
    </Tabs.Root>
  ),
};
