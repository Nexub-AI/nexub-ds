# NotificationItem

Single notification row for notification panels or dropdowns.

- Package: `@nexub/patterns` · Category: Feedback · Status: stable
- Import: `import { NotificationItem } from '@nexub/patterns';`
- Docs: https://nexub-ds-docs.pages.dev/patterns/notification-item

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` (required) | `string` |  | Notification title. |
| `description` | `string` |  | Supporting text. |
| `timestamp` | `string` |  | Relative time string. |
| `unread` | `boolean` | `false` | Applies unread indicator styling. |
| `avatar` | `React.ReactNode` |  | Avatar for the notification actor. |
| `onClick` | `() => void` |  | Click handler for the item. |

## Example: Default

```tsx
import { NotificationItem } from '@nexub/patterns';

export default function Example() {
  return (
    <div className="w-[340px]">
      <NotificationItem title="New team member" description="Sarah joined your workspace." timestamp="2 min ago" read={false} />
      <NotificationItem title="Invoice paid" description="Invoice #1042 was paid successfully." timestamp="1 hr ago" read />
    </div>
  );
}
```
