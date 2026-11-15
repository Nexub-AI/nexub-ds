# Tabs

Layered content panels switched by tab triggers. Built on Radix UI Tabs.

- Package: `@nexub/react` · Category: Navigation · Status: stable
- Import: `import { Tabs } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/tabs

## When to use

- Switching between related views within the same page context
- Organising content that belongs to the same entity
- Reducing visual clutter by hiding secondary content behind tabs
- Horizontal navigation within a bounded section

## When not to use

- Global site navigation — use the sidebar or top nav
- Sequential steps in order — use Stepper
- Comparing content side-by-side — keep both views visible
- More than 5–7 tabs — consider a Select or sub-navigation

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `defaultValue` | `string` |  | Initially active tab value (uncontrolled). |
| `value` | `string` |  | Controlled active tab value. |
| `onValueChange` | `(value: string) => void` |  | Callback when active tab changes. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction of the tab list. |

## Example: Default

```tsx
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
```

## Example: Vertical

orientation="vertical": the indicator slides on the inline-end edge, and arrow up/down move between tabs.

```tsx
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
```
