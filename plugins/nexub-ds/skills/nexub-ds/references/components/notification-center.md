# NotificationCenter

A bell with an unread count that opens the notification list.

- Package: `@nexub/patterns` · Category: Feedback · Status: beta
- Import: `import { NotificationCenter } from '@nexub/patterns';`
- Docs: https://nexub-ds-docs.pages.dev/patterns/notification-center

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `notifications` (required) | `{ id, title, description?, timestamp?, read?, icon?, href? }[]` |  | Newest first. Your app owns them and their read state. |
| `onOpen` | `(id) => void` |  | A notification was opened; mark it read here. |
| `onDismiss` | `(id) => void` |  | Shows a dismiss button per item. |
| `onMarkAllRead` | `() => void` |  | Shows "Mark all as read" while some are unread. |
| `emptyText` | `ReactNode` | `"You’re all caught up"` | Shown with no notifications. |

## Example: Inbox

```tsx
'use client';

import * as React from 'react';
import { NotificationCenter, type NotificationCenterItem } from '@nexub/patterns';

export default function Example() {
  const [items, setItems] = React.useState<NotificationCenterItem[]>([
    { id: '1', title: 'Deploy failed on main', description: 'Build step "test" exited with 1.', timestamp: '2 min ago' },
    { id: '2', title: 'Invoice #1042 paid', timestamp: '1 h ago' },
    { id: '3', title: 'Ada commented on Q4 plan', timestamp: 'Yesterday', read: true },
  ]);
  const markRead = (id?: string) => setItems((list) => list.map((n) => (!id || n.id === id ? { ...n, read: true } : n)));
  return (
    <NotificationCenter
      notifications={items}
      onOpen={(id) => markRead(id)}
      onDismiss={(id) => setItems((list) => list.filter((n) => n.id !== id))}
      onMarkAllRead={() => markRead()}
    />
  );
}
```

## Accessibility

- The bell reads "Notifications, 3 unread"; the count badge is decorative.
- The list opens in a popover labelled by its heading; Escape closes it and focus returns to the bell.
- Each item’s title is its link or button, stretched over the whole item.

Related: [notification-item](notification-item.md)
