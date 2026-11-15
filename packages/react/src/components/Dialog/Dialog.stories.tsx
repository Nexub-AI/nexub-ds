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
          <p style={{ fontSize: '0.875rem', color: 'var(--color-on-surface-muted)' }}>
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

export const Glass: Story = {
  render: () => (
    <Dialog.Root defaultOpen>
      <Dialog.Trigger asChild>
        <button>Open Dialog</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content surface="glass">
          <Dialog.Header>
            <Dialog.Title>Glass dialog</Dialog.Title>
            <Dialog.Description>
              surface=&quot;glass&quot; — the content behind blurs through the panel.
            </Dialog.Description>
          </Dialog.Header>
          <Dialog.Footer>
            <Dialog.Close asChild>
              <button>Close</button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  ),
};

/** 7.6: close button, scrolling Body with scroll-edge hairlines, nested step-back, and a bottom sheet on small screens. */
export const RichSurfaces: Story = {
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button>Open terms</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content showClose sheet="auto">
          <Dialog.Header>
            <Dialog.Title>Terms of service</Dialog.Title>
            <Dialog.Description>Scroll to read; the header and footer stay put.</Dialog.Description>
          </Dialog.Header>
          <Dialog.Body>
            {Array.from({ length: 20 }, (_, i) => (
              <p key={i} className="mb-3 text-sm">Section {i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            ))}
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <button>Open nested</button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay />
                <Dialog.Content size="sm" showClose>
                  <Dialog.Title>Nested dialog</Dialog.Title>
                  <Dialog.Description>The dialog behind steps back.</Dialog.Description>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
            <Dialog.Close asChild>
              <button>Accept</button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  ),
};
