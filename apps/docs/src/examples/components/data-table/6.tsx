'use client';

import { Button, DataTable, toCSV, type DataTableColumn } from '@nexub/react';

type Invoice = { id: string; customer: string; amount: number };

const data: Invoice[] = [
  { id: 'INV-1042', customer: 'Acme, Inc.', amount: 1200 },
  { id: 'INV-1043', customer: 'Globex', amount: 860 },
];

const columns: DataTableColumn<Invoice>[] = [
  { accessorKey: 'id', header: 'Invoice' },
  { accessorKey: 'customer', header: 'Customer' },
  { accessorKey: 'amount', header: 'Amount', meta: { align: 'end' } },
];

function download() {
  const csv = toCSV(data, [
    { header: 'Invoice', value: 'id' },
    { header: 'Customer', value: 'customer' },
    { header: 'Amount', value: 'amount' },
  ]);
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: 'invoices.csv' });
  a.click();
  URL.revokeObjectURL(url);
}

export default function Example() {
  return (
    <DataTable
      caption="Invoices"
      captionHidden
      columns={columns}
      data={data}
      toolbar={<Button variant="outlined" size="sm" onClick={download}>Export CSV</Button>}
    />
  );
}
