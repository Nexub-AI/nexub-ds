---
"@nexub/react": minor
"@nexub/core": minor
---

Hierarchy.

- **`TreeView`** (new, beta): an ARIA tree. Arrow keys move, open and close (mirrored in RTL), Home/End jump, typing finds an item, and the tree is one tab stop. Single selection, or `checkable` with tri-state parents (`checked` lists every checked id). `hasChildren` + `onLoadChildren` load children on first open, with the item `aria-busy` meanwhile.
- **`DataTable`**: `getSubRows` makes a tree table. The first column gets an expand toggle and indents each level; `expanded` / `defaultExpanded` / `onExpandedChange` control it. With `pagination`, a parent and its children stay on one page.
- New messages: `expandRow`, `collapseRow`.
