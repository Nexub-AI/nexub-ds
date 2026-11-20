import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { ContextMenu } from './ContextMenu.js';

const meta: Meta = {
  title: 'Navigation/ContextMenu',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '16rem',
            height: '8rem',
            border: '2px dashed var(--color-outline-variant)',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            color: 'var(--color-on-surface-muted)',
            userSelect: 'none',
          }}
        >
          Right-click here
        </div>
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content>
          <ContextMenu.Item>View</ContextMenu.Item>
          <ContextMenu.Item>Edit</ContextMenu.Item>
          <ContextMenu.Item>Duplicate</ContextMenu.Item>
          <ContextMenu.Separator />
          <ContextMenu.Item>Share</ContextMenu.Item>
          <ContextMenu.Item>Copy link</ContextMenu.Item>
          <ContextMenu.Separator />
          <ContextMenu.Item disabled>Move to trash (unavailable)</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  ),
};

/** 10.6: a bottom sheet below the md breakpoint, the usual menu above. */
export const SheetAuto: Story = {
  render: () => (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>
        <div className="flex h-24 w-56 items-center justify-center rounded-shape-container border border-dashed border-[var(--color-outline)] text-body-sm text-[var(--color-on-surface)]">
          Long-press or right-click
        </div>
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content sheet="auto">
          <ContextMenu.Item>View</ContextMenu.Item>
          <ContextMenu.Item>Edit</ContextMenu.Item>
          <ContextMenu.Item>Share</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  ),
};
