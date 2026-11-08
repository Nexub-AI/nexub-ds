---
"@nexub/react": minor
"@nexub/core": minor
"@nexub/icons": minor
---

Reorder.

- **`Sortable`** (new, beta): a list people reorder by dragging an item or with Alt+ArrowUp/Down on its handle. Focus stays on the moved item's handle and every move is announced ("Alpha moved to position 3 of 5").
- **`Kanban`** (new, beta): columns of cards. Drag cards, or Alt+ArrowUp/Down within a column and Alt+ArrowLeft/Right across columns (mirrored in RTL). Columns are regions named by their headings.
- **`DataTable`**: `onRowOrderChange` adds a row handle column for the same drag and Alt+Arrow moves; `getRowLabel` names rows. Handles hide while a column is sorted.
- Built on the native drag-and-drop API, the same model as DataTable column reordering: no new dependency.
- **Icons**: `GripVertical`.
- New messages: `moveItem`, `reorderHint`, `itemMoved`, `itemMovedToColumn`.
