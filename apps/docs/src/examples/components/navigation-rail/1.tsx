'use client'; // docs preview: server pages import every example

import { NavigationRail } from '@nexub/react';
import { Bell, Home, Inbox, User } from '@nexub/icons';

export default function Example() {
  return (
    <div className="flex h-80 w-full max-w-sm flex-col overflow-auto rounded-shape-overlay border border-outline-variant">
      <main className="flex-1 p-4 text-body-md text-on-surface-variant">Page content scrolls above the tab bar.</main>
      <NavigationRail.Root orientation="bottom" aria-label="Main">
        <NavigationRail.Item href="#" icon={<Home />} label="Home" active />
        <NavigationRail.Item href="#" icon={<Inbox />} label="Inbox" badge={3} />
        <NavigationRail.Item href="#" icon={<Bell />} label="Alerts" badge />
        <NavigationRail.Item href="#" icon={<User />} label="Profile" />
      </NavigationRail.Root>
    </div>
  );
}
