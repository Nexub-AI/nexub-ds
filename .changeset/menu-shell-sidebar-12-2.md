---
'@nexub/react': minor
---

12.2 Platform requests: menus, shell and sidebar.

- **`DropdownMenu.RadioItem` / `CheckboxItem` `indicator="end"`:** the selected tick sits at the inline end (mirrors in RTL) and the leading slot goes away, so an icon can lead each label, as in a Light / Dark / System theme menu. Default `'start'` is unchanged.
- **`AppShell.Main` is now `relative`:** absolutely positioned children and sr-only labels stay inside the main area instead of escaping to the page.
- **`Sidebar.Group collapsible`:** the group label becomes a button (`aria-expanded`, `aria-controls`, a turning chevron) that folds its items away, with `defaultOpen` (default `true`) or controlled `open` / `onOpenChange`. Respects reduced motion; in the icon rail groups stay open and the toggle is hidden.
