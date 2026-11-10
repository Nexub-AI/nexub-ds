---
'@nexub/react': minor
'@nexub/patterns': minor
'@nexub/themes': minor
---

7.7: reorder and data at scale.

- `Sortable` and `Kanban` drag with Pointer Events (mouse, pen and touch) instead of native drag-and-drop: a drop line, items settle on the spatial spring, edge auto-scroll, and Escape or a cancelled pointer puts the item back. Alt+Arrow keyboard moves are unchanged. `DataTable` row reorder now drags from the grip only.
- `DataTable` rows are memoised, so selecting a row or re-rendering with equal data no longer redraws every row. Cell renderers should depend only on their row and `columns`; if a renderer reads other state, include it in the `columns` memo.
- `DataTable`: controlled and server-side sort and pagination: `sort` / `onSortChange` / `manualSort`, `page` / `pageSize` / `onPageChange` / `manualPagination` / `rowCount`.
- The DataTable "View" menu loads only when `viewOptions` is used.
- `FilterBuilder` renders its rule tree from a deferred value and keeps every keystroke; `FilterBar` documents the `useDeferredValue` recipe for big lists.
- New perf tripwire (`pnpm --filter @nexub/react test:perf`, also part of the visual CI job): filtering 1,000 DataTable rows, typing in a 1,000-option Combobox and moving a Kanban card must stay under 200 ms per interaction with no long task over 100 ms.
