import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { AlertDialog } from './AlertDialog.js';

const meta: Meta = {
  title: 'Overlays/AlertDialog',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button>Delete account</button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay />
        <AlertDialog.Content>
          <AlertDialog.Header>
            <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
            <AlertDialog.Description>
              This action cannot be undone. This will permanently delete your account and remove
              all of your data from our servers.
            </AlertDialog.Description>
          </AlertDialog.Header>
          <AlertDialog.Footer>
            <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
            <AlertDialog.Action>Yes, delete account</AlertDialog.Action>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  ),
};

export const TypeToConfirm: Story = {
  render: () => (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button>Delete workspace</button>
      </AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Header>
          <AlertDialog.Title>Delete acme-prod?</AlertDialog.Title>
          <AlertDialog.Description>All projects, members and billing history go with it. This can’t be undone.</AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Confirm text="acme-prod" />
        <AlertDialog.Footer>
          <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
          <AlertDialog.Action>Delete workspace</AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  ),
};
