import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Popover } from './Popover.js';

const meta: Meta = {
  title: 'Overlays/Popover',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button>Open Popover</button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content>
          <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem' }}>
            Quick info
          </p>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            This popover can contain any content, such as forms, links, or descriptions.
          </p>
          <Popover.Arrow />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  ),
};

export const Glass: Story = {
  render: () => (
    <Popover.Root defaultOpen>
      <Popover.Trigger asChild>
        <button>Open Popover</button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content surface="glass">
          <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem' }}>
            Glass popover
          </p>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            surface=&quot;glass&quot; frosts the content behind the panel.
          </p>
          <Popover.Arrow />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  ),
};
