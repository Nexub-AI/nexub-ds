import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { InfoList } from './InfoList.js';

const meta: Meta = {
  title: 'Patterns/InfoList',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div
      style={{
        maxWidth: '420px',
        border: '1px solid var(--color-border-default)',
        borderRadius: '12px',
        padding: '16px',
        background: 'var(--color-bg-default)',
      }}
    >
      <InfoList.Root>
        <InfoList.Item label="Plan" value="Pro" />
        <InfoList.Item
          label="Status"
          value={
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                borderRadius: '9999px',
                padding: '2px 10px',
                fontSize: '12px',
                fontWeight: 500,
                background: '#dcfce7',
                color: '#166534',
              }}
            >
              Active
            </span>
          }
        />
        <InfoList.Item label="Next billing" value="May 1, 2026" />
        <InfoList.Item label="Team size" value="12 members" />
      </InfoList.Root>
    </div>
  ),
};
