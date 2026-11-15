'use client'; // docs preview: server pages import every example

import { Tabs } from '@nexub/react';

export default function Example() {
  return (
    <div className="w-[320px]">
      <Tabs.Root defaultValue="tab1">
        <Tabs.List>
          <Tabs.Trigger value="tab1">Overview</Tabs.Trigger>
          <Tabs.Trigger value="tab2">Analytics</Tabs.Trigger>
          <Tabs.Trigger value="tab3">Settings</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="tab1">
          <div className="py-3 px-0 text-[var(--color-on-surface-variant)] text-body-sm">Overview content goes here.</div>
        </Tabs.Content>
        <Tabs.Content value="tab2">
          <div className="py-3 px-0 text-[var(--color-on-surface-variant)] text-body-sm">Analytics content goes here.</div>
        </Tabs.Content>
        <Tabs.Content value="tab3">
          <div className="py-3 px-0 text-[var(--color-on-surface-variant)] text-body-sm">Settings content goes here.</div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
