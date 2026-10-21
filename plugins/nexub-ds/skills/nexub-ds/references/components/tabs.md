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
- Sequential steps in order — use StepIndicator
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
<Tabs.Root defaultValue="account">
  <Tabs.List>
    <Tabs.Trigger value="account">Account</Tabs.Trigger>
    <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
    <Tabs.Trigger value="notifications">Notifications</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="account">
    <Text>Account settings content.</Text>
  </Tabs.Content>
  <Tabs.Content value="billing">
    <Text>Billing details content.</Text>
  </Tabs.Content>
  <Tabs.Content value="notifications">
    <Text>Notification preferences content.</Text>
  </Tabs.Content>
</Tabs.Root>
```
