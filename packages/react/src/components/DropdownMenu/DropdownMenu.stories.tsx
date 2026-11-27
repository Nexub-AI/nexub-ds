import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Monitor, Moon, Sun } from '@nexub/icons';
import { DropdownMenu } from './DropdownMenu.js';

const meta: Meta = {
  title: 'Navigation/DropdownMenu',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button>Open Menu</button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content>
          <DropdownMenu.Label>My account</DropdownMenu.Label>
          <DropdownMenu.Item>Profile</DropdownMenu.Item>
          <DropdownMenu.Item>Billing</DropdownMenu.Item>
          <DropdownMenu.Item>Settings</DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item>Team</DropdownMenu.Item>
          <DropdownMenu.Item disabled>Invite users (unavailable)</DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item>Log out</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  ),
};

/** 10.6: a bottom sheet below the md breakpoint, the usual menu above. */
export const SheetAuto: Story = {
  render: () => (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button>Account</button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content sheet="auto">
          <DropdownMenu.Item>Profile</DropdownMenu.Item>
          <DropdownMenu.Item>Settings</DropdownMenu.Item>
          <DropdownMenu.Item>Log out</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  ),
};

/** 12.2: `indicator="end"`: an icon at the start of each label, the tick at the inline end. */
export const ThemeMenu: Story = {
  render: function ThemeMenuStory() {
    const [theme, setTheme] = React.useState('system');
    return (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button>Theme</button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content>
            <DropdownMenu.RadioGroup value={theme} onValueChange={setTheme}>
              <DropdownMenu.RadioItem value="light" indicator="end">
                <Sun size="sm" /> Light
              </DropdownMenu.RadioItem>
              <DropdownMenu.RadioItem value="dark" indicator="end">
                <Moon size="sm" /> Dark
              </DropdownMenu.RadioItem>
              <DropdownMenu.RadioItem value="system" indicator="end">
                <Monitor size="sm" /> System
              </DropdownMenu.RadioItem>
            </DropdownMenu.RadioGroup>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    );
  },
};
