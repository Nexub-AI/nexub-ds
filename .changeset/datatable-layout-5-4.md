---
"@nexub/react": minor
"@nexub/core": minor
---

DataTable 2.0, part 2: layout and scale.

- **Resize**: `enableColumnResizing`, with `columnSizing` / `onColumnSizingChange`. Drag a header's edge. The handle is a focusable separator: Arrow keys resize by 16px and double-click resets. RTL-aware.
- **Reorder**: `enableColumnReordering`, with `columnOrder` / `onColumnOrderChange`. Drag headers, or press Alt+Arrow on a focused header, and the move is announced.
- **Pin**: `columnPinning` / `onColumnPinningChange` (`{ left, right }`). Pinned columns stay in view with an edge line, and the selection column pins with them.
- **Sticky header**: `maxHeight` caps the table's height. Rows scroll and the header stays in view.
- **`DataTableVirtual`** (new, beta), imported from `@nexub/react/DataTableVirtual`: renders only the rows in view, for thousands of rows. Rows carry `aria-rowindex` and the table `aria-rowcount`. It needs `@tanstack/react-virtual`, an optional peer dependency, so apps that don't use it don't install it.
- Sizes and offsets are set through the CSSOM, not style attributes, so strict-CSP pages work.
- New messages: `resizeColumn`, `columnMoved`.
