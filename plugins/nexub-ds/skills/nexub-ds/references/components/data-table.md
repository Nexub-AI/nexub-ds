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
import { DataTable } from '@nexub/react';

export default function Example() {
  const data = [
    { name: 'Alice Brown', email: 'alice@example.com', plan: 'Pro', status: 'Active' },
    { name: 'Bob Carter', email: 'bob@example.com', plan: 'Free', status: 'Pending' },
    { name: 'Carol Davis', email: 'carol@example.com', plan: 'Pro', status: 'Inactive' },
    { name: 'Dave Evans', email: 'dave@example.com', plan: 'Enterprise', status: 'Active' },
  ];
  const columns = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'plan', header: 'Plan' },
    { accessorKey: 'status', header: 'Status' },
  ];
  return (
    <div className="w-full max-w-[600px]">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
```

## Example: With sorting

```tsx
import { DataTable } from '@nexub/react';

export default function Example() {
  const data = [
    { name: 'Alice Brown', email: 'alice@example.com', plan: 'Pro', status: 'Active' },
    { name: 'Bob Carter', email: 'bob@example.com', plan: 'Free', status: 'Pending' },
    { name: 'Carol Davis', email: 'carol@example.com', plan: 'Pro', status: 'Inactive' },
    { name: 'Dave Evans', email: 'dave@example.com', plan: 'Enterprise', status: 'Active' },
  ];
  const columns = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'plan', header: 'Plan' },
    { accessorKey: 'status', header: 'Status' },
  ];
  return (
    <div className="w-full max-w-[600px]">
      <DataTable columns={columns} data={data} enableSorting />
    </div>
  );
}
```
