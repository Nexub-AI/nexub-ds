import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Bell, Folder, Home, Inbox, Settings, User } from '@nexub/icons';
import { NavigationRail } from './NavigationRail.js';

const meta: Meta = {
  title: 'Navigation/NavigationRail',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

/** Home is the current page. */
export const Default: Story = {
  render: () => (
    <div style={{ height: 320 }}>
      <NavigationRail.Root aria-label="Workspace">
        <NavigationRail.Item href="#" icon={<Home />} label="Home" active />
        <NavigationRail.Item href="#" icon={<Folder />} label="Files" />
        <NavigationRail.Item href="#" icon={<Settings />} label="Settings" />
      </NavigationRail.Root>
    </div>
  ),
};

/** 10.3: under the vivid expression the active pill is tinted with the accent. */
export const Vivid: Story = {
  render: () => (
    <div data-expression="vivid" style={{ height: 320 }}>
      <NavigationRail.Root aria-label="Workspace">
        <NavigationRail.Item href="#" icon={<Home />} label="Home" active />
        <NavigationRail.Item href="#" icon={<Folder />} label="Files" />
        <NavigationRail.Item href="#" icon={<Settings />} label="Settings" />
      </NavigationRail.Root>
    </div>
  ),
};

/** 11.5: `badge` as a count (99+ cap) or a dot; read as "Inbox, 4 unread". */
export const Badges: Story = {
  render: () => (
    <div style={{ height: 320 }}>
      <NavigationRail.Root aria-label="Workspace">
        <NavigationRail.Item href="#" icon={<Home />} label="Home" active />
        <NavigationRail.Item href="#" icon={<Inbox />} label="Inbox" badge={4} />
        <NavigationRail.Item href="#" icon={<Bell />} label="Alerts" badge={120} />
        <NavigationRail.Item href="#" icon={<Folder />} label="Files" badge />
      </NavigationRail.Root>
    </div>
  ),
};

/** 11.5: `orientation="bottom"`, the phone tab bar. It sticks to the bottom of the scroll area. */
export const Bottom: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => (
    <div className="flex h-96 w-full max-w-sm flex-col overflow-auto border border-[var(--color-outline-variant)]">
      <main className="flex-1 p-4 text-body-md">Page content</main>
      <NavigationRail.Root orientation="bottom" aria-label="Main">
        <NavigationRail.Item href="#" icon={<Home />} label="Home" active />
        <NavigationRail.Item href="#" icon={<Inbox />} label="Inbox" badge={3} />
        <NavigationRail.Item href="#" icon={<Bell />} label="Alerts" badge />
        <NavigationRail.Item href="#" icon={<User />} label="Profile" />
      </NavigationRail.Root>
    </div>
  ),
};
