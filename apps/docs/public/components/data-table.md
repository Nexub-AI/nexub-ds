# Data Table

Feature-rich data table with sorting and row selection powered by TanStack Table.

- Package: `@nexub/react` · Category: Data Display · Status: stable
- Import: `import { DataTable } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/data-table

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `columns` (required) | `DataTableColumn<TData>[]` |  | TanStack Table column definitions (`DataTableColumn` is exported from @nexub/react). Set `meta: { align: 'end' }` for numeric columns; headers, sort buttons and cells follow it. |
| `data` (required) | `TData[]` |  | Array of row data objects to render. |
| `caption` | `ReactNode` |  | Names the table for assistive tech (and its scroll region). Shown below the table; add `captionHidden` to keep it screen-reader only. |
| `enableSorting` | `boolean` | `false` | Click a header to sort; Shift+click adds more columns, numbered 1, 2… (5.3). |
| `enableRowSelection` | `boolean` | `false` | Turns on row selection state. |
| `selectionColumn` | `boolean` | `false` | With `enableRowSelection` (5.3): a checkbox column, select-page in its header, and "Select all N" across pages. On by default from 6.0. |
| `rowSelection / onRowSelectionChange` | `Record<string, boolean>` |  | Controlled selection keyed by row id (5.3). |
| `getRowId` | `(row: TData, index: number) => string` |  | Stable row ids for selection; defaults to the row index (5.3). |
| `bulkActions` | `(rows: TData[], clear: () => void) => ReactNode` |  | A floating bar while rows are selected, with the count, your actions and a clear button (5.3). |
| `density / defaultDensity / onDensityChange` | `'comfortable' \| 'compact'` | `'comfortable'` | Row height (5.3). |
| `columnVisibility / onColumnVisibilityChange` | `Record<string, boolean>` |  | Which columns show, keyed by column id (5.3). |
| `viewOptions` | `boolean` | `false` | A "View" menu above the table for density and column visibility (5.3). |
| `toolbar` | `ReactNode` |  | Content at the start of the row above the table, e.g. filters (5.3). |
| `pagination.pageSize` | `number` | `20` | Rows per page; pagination is on when `pagination` is set. |

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

## Example: Selection, bulk actions and view menu

Select rows with the checkbox column; the bar at the bottom acts on them. The View menu switches density and hides columns.

```tsx
'use client';

import * as React from 'react';
import { Button, DataTable, type DataTableColumn } from '@nexub/react';

interface Invoice {
  id: string;
  customer: string;
  status: string;
  amount: number;
}

const invoices: Invoice[] = [
  { id: 'INV-2041', customer: 'Acme', status: 'Overdue', amount: 1200 },
  { id: 'INV-2042', customer: 'Globex', status: 'Paid', amount: 860 },
  { id: 'INV-2043', customer: 'Initech', status: 'Draft', amount: 430 },
  { id: 'INV-2044', customer: 'Umbrella', status: 'Overdue', amount: 2150 },
  { id: 'INV-2045', customer: 'Hooli', status: 'Paid', amount: 990 },
];

const columns: DataTableColumn<Invoice>[] = [
  { accessorKey: 'id', header: 'Invoice' },
  { accessorKey: 'customer', header: 'Customer' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'amount', header: 'Amount', meta: { align: 'end' } },
];

export default function Example() {
  const [selection, setSelection] = React.useState<Record<string, boolean>>({ 'INV-2041': true, 'INV-2044': true });
  return (
    <div className="w-full max-w-[640px]">
      <DataTable
        caption="Invoices"
        captionHidden
        columns={columns}
        data={invoices}
        getRowId={(r) => r.id}
        enableSorting
        enableRowSelection
        selectionColumn
        rowSelection={selection}
        onRowSelectionChange={setSelection}
        viewOptions
        bulkActions={(rows, clear) => (
          <>
            <Button size="sm" variant="outline" onClick={clear}>
              Send reminders ({rows.length})
            </Button>
            <Button size="sm" variant="destructive" onClick={clear}>
              Void
            </Button>
          </>
        )}
      />
    </div>
  );
}
```
