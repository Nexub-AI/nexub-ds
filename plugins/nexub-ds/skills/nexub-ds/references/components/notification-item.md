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
<NotificationItem
  title="New comment on your post"
  description="Alex left a comment on 'Design System v2'"
  timestamp="5 min ago"
  unread
/>
```
