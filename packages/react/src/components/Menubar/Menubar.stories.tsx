import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Menubar } from './Menubar.js';

const meta: Meta = {
  title: 'Navigation/Menubar',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Menubar.Root>
      <Menubar.Menu>
        <Menubar.Trigger>File</Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Content>
            <Menubar.Item>New file</Menubar.Item>
            <Menubar.Item>Open&hellip;</Menubar.Item>
            <Menubar.Separator />
            <Menubar.Item>Save</Menubar.Item>
            <Menubar.Item>Save as&hellip;</Menubar.Item>
          </Menubar.Content>
        </Menubar.Portal>
      </Menubar.Menu>

      <Menubar.Menu>
        <Menubar.Trigger>Edit</Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Content>
            <Menubar.Item>Undo</Menubar.Item>
            <Menubar.Item>Redo</Menubar.Item>
            <Menubar.Separator />
            <Menubar.Item>Cut</Menubar.Item>
            <Menubar.Item>Copy</Menubar.Item>
            <Menubar.Item>Paste</Menubar.Item>
          </Menubar.Content>
        </Menubar.Portal>
      </Menubar.Menu>

      <Menubar.Menu>
        <Menubar.Trigger>View</Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Content>
            <Menubar.Item>Zoom in</Menubar.Item>
            <Menubar.Item>Zoom out</Menubar.Item>
            <Menubar.Separator />
            <Menubar.Item>Toggle sidebar</Menubar.Item>
          </Menubar.Content>
        </Menubar.Portal>
      </Menubar.Menu>
    </Menubar.Root>
  ),
};
