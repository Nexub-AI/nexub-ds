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

export const Glass: Story = {
  render: () => (
    <Drawer.Root defaultOpen>
      <Drawer.Trigger asChild>
        <button>Open Drawer</button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay />
        <Drawer.Content side="right" surface="glass">
          <Drawer.Header>
            <Drawer.Title>Glass drawer</Drawer.Title>
            <Drawer.Description>
              surface=&quot;glass&quot; frosts the panel over the page behind it.
            </Drawer.Description>
          </Drawer.Header>
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

/**
 * Side sheet with a long, scrolling list (the phone nav case). `direction`
 * matches `side`. The panel scrolls vertically only: before the fix, vaul's
 * over-drag strip made it scroll sideways too.
 */
export const SideSheetLongContent: Story = {
  render: () => (
    <Drawer.Root direction="left" defaultOpen>
      <Drawer.Trigger className="rounded-md border border-[var(--color-border-default)] px-4 py-2 text-sm">
        Open left sheet
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay />
        <Drawer.Content side="left" aria-describedby={undefined}>
          <Drawer.Header>
            <Drawer.Title>Sections</Drawer.Title>
          </Drawer.Header>
          <ul className="flex flex-col gap-1 px-6 pb-6">
            {Array.from({ length: 40 }, (_, i) => (
              <li key={i} className="rounded-md px-3 py-2 text-sm hover:bg-[var(--color-bg-subtle)]">
                Section {i + 1}
              </li>
            ))}
          </ul>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  ),
};
