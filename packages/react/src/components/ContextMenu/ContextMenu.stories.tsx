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
            border: '2px dashed var(--color-border-default)',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            color: 'var(--color-text-muted)',
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
