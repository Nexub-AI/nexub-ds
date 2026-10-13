---
"@nexub/react": minor
"@nexub/patterns": minor
---

**`Sidebar.Header` with a product logo and a status.** New `Sidebar.Header` takes the logo as children and an optional `status` (e.g. a "Live" `Badge`). They sit on one row when they fit; otherwise the status moves under the logo. When the sidebar is collapsed, the status is visually hidden but still announced.
- `Logo` with `product` truncates the product name with an ellipsis when its container is too narrow, instead of overflowing.
- `SettingsLayout`'s top bar lets a long product logo shrink and truncate next to the actions.
