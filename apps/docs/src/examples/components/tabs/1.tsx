'use client'; // docs preview: server pages import every example

import { Tabs } from '@nexub/react';

export default function Example() {
  return (
    <div className="w-[420px]">
      <Tabs.Root defaultValue="profile" orientation="vertical">
        <Tabs.List aria-label="Account">
          <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
          <Tabs.Trigger value="security">Security</Tabs.Trigger>
          <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="profile">
          <div className="p-3 text-body-sm text-[var(--color-on-surface-variant)]">Name, photo and contact details.</div>
        </Tabs.Content>
        <Tabs.Content value="security">
          <div className="p-3 text-body-sm text-[var(--color-on-surface-variant)]">Password, passkeys and sessions.</div>
        </Tabs.Content>
        <Tabs.Content value="billing">
          <div className="p-3 text-body-sm text-[var(--color-on-surface-variant)]">Plan, invoices and payment method.</div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
