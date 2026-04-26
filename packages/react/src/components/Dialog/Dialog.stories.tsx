import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Dialog } from './Dialog.js';

const meta: Meta = {
  title: 'Overlays/Dialog',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button>Open Dialog</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Edit profile</Dialog.Title>
            <Dialog.Description>
              Make changes to your profile here. Click save when you&apos;re done.
            </Dialog.Description>
          </Dialog.Header>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            Your profile information is visible to other members of your workspace.
          </p>
          <Dialog.Footer>
            <Dialog.Close asChild>
              <button>Cancel</button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <button>Save changes</button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  ),
};
