import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Drawer } from './Drawer.js';

const meta: Meta = {
  title: 'Components/Drawer',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <button>Open Drawer</button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay />
        <Drawer.Content side="right">
          <Drawer.Header>
            <Drawer.Title>Settings</Drawer.Title>
            <Drawer.Description>
              Manage your account settings and preferences.
            </Drawer.Description>
          </Drawer.Header>
          <div style={{ padding: '0 1.5rem', flex: 1 }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
              Your preferences are saved automatically as you make changes.
            </p>
          </div>
          <Drawer.Footer>
            <Drawer.Close asChild>
              <button>Close</button>
            </Drawer.Close>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  ),
};
