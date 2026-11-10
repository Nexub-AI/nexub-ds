---
'@nexub/react': minor
'@nexub/core': minor
'@nexub/themes': minor
---

7.6: rich surfaces and navigation.

- `Dialog.Content`: `showClose` (+ `closeLabel`), `sheet` (`true` or `'auto'`: a bottom sheet below `md`); **new** `Dialog.Body` scrolls while Header and Footer stay put, with hairlines that appear as you scroll (CSS scroll timeline; always shown where unsupported); a nested Dialog steps its parent back.
- `Tabs.List`: overflowing lists fade at the scrollable edges and keep the active tab in view (without scrolling the page); `variant="pill"`.
- `Tooltip`: `label` accepts any node, plus `description`, `shortcut` (a Kbd) and `arrow`. A Tooltip now works without an app-level `TooltipProvider`.
- `IconButton`: `loading` and `tooltip` (`true` shows the `label`). The tooltip code loads only when used.
- `Badge`: `dot`, `count` + `max` ("99+", full number for screen readers) with a tick when the count changes.
- `CommandPalette`: pages (`CommandPalette.Page`, `Item page`, Backspace goes back), `loading`, and opt-in recents (`recentKey`).
- `EmptyState.Root`: `size` (`sm` / `md` / `lg`) and opt-in `animate`.
- New message: `recent`.
