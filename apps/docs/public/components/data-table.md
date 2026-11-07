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
| `enableColumnResizing` | `boolean` | `false` | Drag a header edge to resize (5.4). The handle is focusable: Arrow keys resize by 16px, double-click resets. |
| `columnSizing / onColumnSizingChange` | `Record<string, number>` |  | Column widths in px, keyed by column id (5.4). |
| `enableColumnReordering` | `boolean` | `false` | Drag headers to reorder, or Alt+Arrow on a focused header; the move is announced (5.4). |
| `columnOrder / onColumnOrderChange` | `string[]` |  | Column ids in display order (5.4). |
| `columnPinning / onColumnPinningChange` | `{ left?: string[]; right?: string[] }` |  | Columns that stay in view while the rest scroll sideways (5.4). The selection column pins with them. |
| `maxHeight` | `number \| string` |  | Caps the height: rows scroll and the header sticks (5.4). |
| `grid` | `boolean` | `false` | ARIA grid keyboard model for tables whose cells hold actions (5.8): the table is one tab stop; Arrow keys move between cells and the controls in them, Home/End to the row ends, Ctrl+Home/End to the corners. |
| `DataTableVirtual` | `import from '@nexub/react/DataTableVirtual'` |  | Same props plus `maxHeight` (required), `estimateRowHeight` and `overscan`: renders only the rows in view, for thousands of rows. Needs `@tanstack/react-virtual` installed (5.4). No pagination. |
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

## Example: Resize, reorder and pin

Drag header edges to resize and headers to reorder (or Alt+Arrow). Invoice stays pinned while the rest scroll; the header sticks within `maxHeight`.

```tsx
'use client';

import { DataTable, type DataTableColumn } from '@nexub/react';

interface Invoice {
  id: string;
  customer: string;
  region: string;
  owner: string;
  status: string;
  amount: number;
}

const invoices: Invoice[] = Array.from({ length: 30 }, (_, i) => ({
  id: `INV-${2041 + i}`,
  customer: ['Acme', 'Globex', 'Initech', 'Umbrella', 'Hooli'][i % 5]!,
  region: ['EMEA', 'APAC', 'Americas'][i % 3]!,
  owner: ['Ana', 'Ben', 'Chen', 'Dev'][i % 4]!,
  status: ['Paid', 'Overdue', 'Draft'][i % 3]!,
  amount: 400 + ((i * 137) % 2000),
}));

const columns: DataTableColumn<Invoice>[] = [
  { accessorKey: 'id', header: 'Invoice', size: 120 },
  { accessorKey: 'customer', header: 'Customer', size: 160 },
  { accessorKey: 'region', header: 'Region', size: 140 },
  { accessorKey: 'owner', header: 'Owner', size: 140 },
  { accessorKey: 'status', header: 'Status', size: 140 },
  { accessorKey: 'amount', header: 'Amount', size: 120, meta: { align: 'end' } },
];

export default function Example() {
  return (
    <div className="w-full max-w-[640px]">
      <DataTable
        caption="Invoices"
        captionHidden
        columns={columns}
        data={invoices}
        enableColumnResizing
        enableColumnReordering
        columnPinning={{ left: ['id'] }}
        maxHeight={320}
      />
    </div>
  );
}
```

## Example: 10,000 rows (DataTableVirtual)

`import { DataTableVirtual } from '@nexub/react/DataTableVirtual'` and install `@tanstack/react-virtual`. Only the rows in view are rendered.

```tsx
'use client';

import type { DataTableColumn } from '@nexub/react';
import { DataTableVirtual } from '@nexub/react/DataTableVirtual';

interface Event {
  id: number;
  name: string;
  user: string;
  at: string;
}

const events: Event[] = Array.from({ length: 10_000 }, (_, i) => ({
  id: i + 1,
  name: ['sign_in', 'export', 'invite', 'upgrade'][i % 4]!,
  user: `user${(i * 7919) % 997}@example.com`,
  at: new Date(Date.UTC(2026, 10, 1) + i * 60_000).toISOString().slice(0, 16).replace('T', ' '),
}));

const columns: DataTableColumn<Event>[] = [
  { accessorKey: 'id', header: '#', meta: { align: 'end' } },
  { accessorKey: 'name', header: 'Event' },
  { accessorKey: 'user', header: 'User' },
  { accessorKey: 'at', header: 'Time (UTC)' },
];

export default function Example() {
  return (
    <div className="w-full max-w-[640px]">
      <DataTableVirtual caption="Audit log" captionHidden columns={columns} data={events} maxHeight={360} enableSorting />
    </div>
  );
}
```

## Accessibility

- Roles: table (default), grid (with `grid`), columnheader with aria-sort when sortable
- `Tab`: Without `grid`: every control in the table is a tab stop. With `grid`: the table is one tab stop and remembers the last cell.
- `Arrow keys`: With `grid`: move between cells, and between the controls inside a cell. Mirrored in RTL.
- `Home / End`: With `grid`: first or last cell in the row. Ctrl+Home / Ctrl+End: first or last cell in the grid.
- `Space`: Toggles a focused row checkbox.
- `Alt+Arrow`: Moves a focused header when `enableColumnReordering` is on.
- With `grid`, focus goes to a cell’s first control, or to the cell itself when it has none.
- Name the table with `caption` (or `aria-label`); `captionHidden` keeps it for screen readers only.
- Sorting, selection counts and column moves are announced from a polite live region.
- DataTableVirtual sets aria-rowcount and aria-rowindex so readers report the full row count.
- Use `grid` when rows hold actions (edit, menus); plain tables of text read better as a table.
