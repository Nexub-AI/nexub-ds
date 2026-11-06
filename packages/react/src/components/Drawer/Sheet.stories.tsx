import type { Meta, StoryObj } from '@storybook/react';
import { Sheet } from './Drawer.js';
import { Text } from '../Text/Text.js';

const meta: Meta = { title: 'Overlays/Sheet', tags: ['autodocs'] };
export default meta;
type Story = StoryObj;

// Open by default so the screenshot and the axe run see the panel itself.
export const Open: Story = {
  render: () => (
    <Sheet.Root defaultOpen>
      <Sheet.Portal>
        <Sheet.Overlay />
        <Sheet.Content side="right">
          <Sheet.Header>
            <Sheet.Title>Notifications</Sheet.Title>
            <Sheet.Description>Your recent activity</Sheet.Description>
          </Sheet.Header>
          <div className="flex-1 p-4">
            <Text size="body-sm" tone="muted">No new notifications.</Text>
          </div>
        </Sheet.Content>
      </Sheet.Portal>
    </Sheet.Root>
  ),
};
