'use client'; // docs preview: server pages import every example

import { DataTable, type DataTableColumn } from '@nexub/react';

type Invoice = { id: string; customer: string; status: string; amount: number };

const data: Invoice[] = [
  { id: 'INV-1042', customer: 'Acme', status: 'Paid', amount: 1200 },
  { id: 'INV-1043', customer: 'Globex', status: 'Due', amount: 860 },
  { id: 'INV-1044', customer: 'Initech', status: 'Paid', amount: 430 },
  { id: 'INV-1045', customer: 'Umbrella', status: 'Overdue', amount: 2150 },
];

const money = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const columns: DataTableColumn<Invoice>[] = [
  { accessorKey: 'customer', header: 'Customer', footer: 'Total', meta: { filter: 'text' } },
  { accessorKey: 'status', header: 'Status', meta: { filter: 'select' } },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ getValue }) => money(getValue<number>()),
    // The filtered rows, so the total follows the filters.
    footer: ({ table }) => money(table.getFilteredRowModel().rows.reduce((sum, r) => sum + r.original.amount, 0)),
    meta: { align: 'end', filter: 'number-range' },
  },
];

export default function Example() {
  return <DataTable caption="Invoices" captionHidden columns={columns} data={data} />;
}
