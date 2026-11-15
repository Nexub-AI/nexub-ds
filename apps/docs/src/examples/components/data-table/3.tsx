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
