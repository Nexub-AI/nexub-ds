---
"@nexub/react": minor
"@nexub/patterns": minor
"@nexub/core": minor
---

Inbox, export and zoom.

- **`NotificationCenter`** (new, beta, patterns): a bell with an unread count ("Notifications, 3 unread") that opens the notification list in a popover, with "Mark all as read", dismiss and an empty state. Your app owns the notifications.
- **`NotificationItem`**: `href` or `onSelect` makes the whole item a link or a button (the dismiss button stays separate).
- **`toCSV(rows, columns)`** (new): CSV text per RFC 4180 with CRLF line ends. Cells that start like a spreadsheet formula (`=`, `+`, `-`, `@`) get a leading `'`, so exports can't run formulas.
- **`ChartZoom`** (new, beta): zoom any chart to part of its range with a two-thumb slider and a reset button. Only the wrapper is a client component; charts stay server-rendered.
- New messages: `notificationCenter`, `unreadNotifications`, `markAllRead`, `noNotifications`, `zoomStart`, `zoomEnd`, `resetZoom`.
