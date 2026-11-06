---
"@nexub/react": minor
"@nexub/core": minor
---

DataTable 2.0, part 1: selection and density.

- **`selectionColumn`** (with `enableRowSelection`): a checkbox column. The header checkbox selects the page and shows a mixed state for partial selections. With pagination, a selected page offers "Select all N" across pages. On by default from 6.0.
- **Controlled selection**: `rowSelection` / `onRowSelectionChange` and `getRowId` for stable ids.
- **`bulkActions(rows, clear)`**: a floating bar while rows are selected, with the count (announced), your actions and a clear button.
- **Multi-sort order**: Shift+click sorts by more columns. Each sorted header shows its order (1, 2…), which is also read out.
- **Density**: `density` / `defaultDensity` / `onDensityChange` (`comfortable` or `compact`).
- **Column visibility**: `columnVisibility` / `onColumnVisibilityChange`.
- **`viewOptions`**: a "View" menu for density and which columns show. `toolbar` puts your own content (filters, a title) in the same row.
- New messages: `selectRow`, `selectAllOnPage`, `selectedCount`, `selectAllRows`, `clearSelection`, `view`, `density`, `comfortable`, `compact`, `columns`, `sortOrder`.
