# Data Table

Feature-rich data table with sorting and row selection powered by TanStack Table.

- Package: `@nexub/react` · Category: Data Display · Status: stable
- Import: `import { DataTable } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/data-table

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `columns` (required) | `DataTableColumn<TData>[]` |  | TanStack Table column definitions (`DataTableColumn` is exported from @nexub/react). Set `meta: { align: 'end' }` for numeric columns; headers, sort buttons and cells follow it. |
| `caption` | `ReactNode` |  | Names the table for assistive tech (and its scroll region). Shown below the table; add `captionHidden` to keep it screen-reader only. |
| `data` (required) | `TData[]` |  | Array of row data objects to render. |
| `enableSorting` | `boolean` | `false` | Enables click-to-sort on column headers. |
| `enableRowSelection` | `boolean` | `false` | Adds a checkbox column for row selection. |
| `pagination.pageSize` | `number` | `10` | Number of rows per page when pagination is active. |
| `pagination.pageIndex` | `number` | `0` | Zero-based index of the currently visible page. |
| `onRowSelectionChange` | `(selectedRows: TData[]) => void` |  | Callback invoked when the row selection state changes. |
| `loading` | `boolean` | `false` | Shows a skeleton loading state over the table body. |
| `emptyState` | `React.ReactNode` |  | Custom content rendered when the data array is empty. |

## Example: Default

```tsx
const columns = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'role', header: 'Role' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'joined', header: 'Joined' },
];

const data = [
  { name: 'Alice Johnson', role: 'Admin', status: 'Active', joined: '2024-01-10' },
  { name: 'Bob Martinez', role: 'Editor', status: 'Pending', joined: '2024-03-22' },
  { name: 'Carol Smith', role: 'Viewer', status: 'Inactive', joined: '2024-06-05' },
  { name: 'David Lee', role: 'Editor', status: 'Active', joined: '2024-09-17' },
  { name: 'Eva Chen', role: 'Admin', status: 'Active', joined: '2025-01-03' },
];

<DataTable columns={columns} data={data} />
```

## Example: With sorting

```tsx
const columns = [
  { accessorKey: 'name', header: 'Name', enableSorting: true },
  { accessorKey: 'role', header: 'Role', enableSorting: true },
  { accessorKey: 'status', header: 'Status', enableSorting: true },
  { accessorKey: 'joined', header: 'Joined', enableSorting: true },
];

const data = [
  { name: 'Alice Johnson', role: 'Admin', status: 'Active', joined: '2024-01-10' },
  { name: 'Bob Martinez', role: 'Editor', status: 'Pending', joined: '2024-03-22' },
  { name: 'Carol Smith', role: 'Viewer', status: 'Inactive', joined: '2024-06-05' },
  { name: 'David Lee', role: 'Editor', status: 'Active', joined: '2024-09-17' },
  { name: 'Eva Chen', role: 'Admin', status: 'Active', joined: '2025-01-03' },
];

<DataTable
  columns={columns}
  data={data}
  enableSorting
  enableRowSelection
  pagination={{ pageSize: 5, pageIndex: 0 }}
/>
```
