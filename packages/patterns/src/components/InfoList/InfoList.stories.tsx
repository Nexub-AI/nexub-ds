import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { EmptyStatePreset } from '@nexub/react';
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
        border: '1px solid var(--color-outline-variant)',
        borderRadius: '12px',
        padding: '16px',
        background: 'var(--color-surface)',
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

const stateLabel = 'm-0 text-label-md text-[var(--color-on-surface-variant)]';

/** 10.5: `loading`, `emptyState` and `errorState` (the error wins). */
export const DataStates: Story = {
  render: () => (
    <div className="grid w-full max-w-4xl grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] items-start gap-6">
      <div className="flex min-w-0 flex-col gap-2">
        <p className={stateLabel}>Loading</p>
        <InfoList.Root loading />
      </div>
      <div className="flex min-w-0 flex-col gap-2">
        <p className={stateLabel}>Empty</p>
        <InfoList.Root emptyState={<EmptyStatePreset kind="noData" size="sm" />} />
      </div>
      <div className="flex min-w-0 flex-col gap-2">
        <p className={stateLabel}>Error</p>
        <InfoList.Root errorState={<EmptyStatePreset kind="serverError" size="sm" />} />
      </div>
    </div>
  ),
};
