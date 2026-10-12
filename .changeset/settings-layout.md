---
"@nexub/patterns": minor
---

**New pattern `SettingsLayout`** (the My Account layout) and **`SettingsRow`**.

- Full-width frame: a `TopNav` with `logo` and `actions` slots, and a left `Sidebar` of sections built from `items: { id, label, icon, href }[]`, with `activeId` highlighted. It works with any router: `onSelect(item)` takes over plain clicks, and `href` still works for modified clicks.
- Under 768px the sidebar becomes a menu button that opens a left `Sheet` with the same items. Choosing one closes it.
- Content area (max width 3xl) with an optional page header (`title`, `description`). Children are sections: use `SettingsLayout.Section` (a `Card` with an optional title and description).
- `SettingsRow` (also `SettingsLayout.Row`): label (and optional description) on the left, value in the middle, action on the right. It stacks on phones.
