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
