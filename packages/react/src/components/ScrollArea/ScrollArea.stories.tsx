import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { ScrollArea } from './ScrollArea.js';

const meta: Meta = {
  title: 'Layout/ScrollArea',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

const notifications = [
  'Alice commented on your pull request.',
  'Build #142 passed successfully.',
  'Bob mentioned you in a discussion.',
  'Your subscription renews in 3 days.',
  'Carol opened a new issue: "Dark mode contrast."',
  'Deploy to production completed.',
  'Dave reviewed your design proposal.',
  'Weekly digest: 12 new comments.',
  'Eve assigned you to ticket #88.',
  'Security scan completed — no issues found.',
  'Frank merged the feature branch.',
  'Release v2.5.0 is now live.',
  'Grace left a reaction on your comment.',
  'Scheduled maintenance tonight at 02:00 UTC.',
  'Hank closed milestone "Q2 Goals."',
];

export const Default: Story = {
  render: () => (
    <ScrollArea style={{ height: '240px', width: '320px', border: '1px solid var(--color-border-default, #e2e8f0)', borderRadius: '8px' }}>
      <div style={{ padding: '12px 16px' }}>
        <p style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px', marginTop: 0 }}>Notifications</p>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {notifications.map((note, i) => (
            <li
              key={i}
              style={{
                fontSize: '13px',
                color: 'var(--color-text-primary, #0f172a)',
                borderBottom: '1px solid var(--color-border-default, #e2e8f0)',
                paddingBottom: '8px',
              }}
            >
              {note}
            </li>
          ))}
        </ul>
      </div>
    </ScrollArea>
  ),
};
