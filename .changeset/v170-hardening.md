---
'@nexub/tokens': minor
'@nexub/themes': minor
'@nexub/react': minor
'@nexub/patterns': minor
---

1.7.0 — hardening (ENHANCEMENTS_PLAN.md release tracker).

- **Date pickers follow the reader.** `DatePicker` / `DateRangePicker` take a date-fns `locale` (or `NexubProvider dateLocale`) for month and weekday names, week start and the trigger format, follow `dir` (arrows and range bands flip in RTL), and their calendar labels are translatable messages.
- **FileUpload** is a native `<label>` around the file input: one control with the visible text as its name (no nested buttons), keyboard and click open the picker natively, and file sizes format with `Intl` in the active locale.
- **Accessibility fixes found by automated checks over every story:** a nameless `Avatar` is decorative (`aria-hidden`) instead of an unnamed image; `ScrollArea` viewports are keyboard-scrollable; `ActivityFeed` is a plain list (its `feed` role broke list semantics); the `NotificationItem` unread dot has an image role.
- `Toast.Root` follows the finger when swiped, and toasts swipe toward the inline end in RTL.
- Releases publish with npm trusted publishing only — no long-lived npm token.
