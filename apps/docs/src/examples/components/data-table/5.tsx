'use client';

import { DataTable, type DataTableColumn } from '@nexub/react';

type Account = { name: string; owner: string; arr: number; children?: Account[] };

const data: Account[] = [
  {
    name: 'Acme Group',
    owner: 'Ada',
    arr: 420000,
    children: [
      { name: 'Acme EU', owner: 'Grace', arr: 180000, children: [{ name: 'Acme Berlin', owner: 'Grace', arr: 60000 }] },
      { name: 'Acme US', owner: 'Alan', arr: 240000 },
    ],
  },
  { name: 'Globex', owner: 'Linus', arr: 95000 },
];

const columns: DataTableColumn<Account>[] = [
  { accessorKey: 'name', header: 'Account' },
  { accessorKey: 'owner', header: 'Owner' },
  {
    accessorKey: 'arr',
    header: 'ARR',
    meta: { align: 'end' },
    cell: ({ getValue }) => new Intl.NumberFormat('en', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(getValue<number>()),
  },
];

export default function Example() {
  return (
    <DataTable
      caption="Accounts by region"
      captionHidden
      columns={columns}
      data={data}
      getSubRows={(row) => row.children}
      getRowId={(row) => row.name}
      defaultExpanded={{ 'Acme Group': true }}
    />
  );
}
