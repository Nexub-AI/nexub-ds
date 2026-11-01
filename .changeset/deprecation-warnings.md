---
'@nexub/react': minor
'@nexub/patterns': minor
'@nexub/core': minor
---

Start of the 3.0 runway (2.5.0).

- `Banner`, `Callout`, `Tag` and `StatusPill` now log a one-time `console.warn` in development naming their replacement (`Alert` or `Badge`) and the 3.0 removal, as GOVERNANCE.md requires before a removal. Production builds stay silent.
- `NotificationItem` and `ActivityFeed` take their accessible labels from `NexubProvider` messages: new keys `unread`, `dismissNotification` and `activityFeed`. The English defaults are unchanged.
