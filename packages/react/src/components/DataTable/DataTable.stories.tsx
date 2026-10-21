import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable, type DataTableColumn } from './DataTable.js';

const meta: Meta = {
  title: 'Data Display/DataTable',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const status = getValue<string>();
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            borderRadius: '9999px',
            padding: '2px 10px',
            fontSize: '12px',
            fontWeight: 500,
            background: status === 'Active' ? 'var(--color-success-container)' : 'var(--color-surface-container-highest)',
            color: status === 'Active' ? 'var(--color-on-success-container)' : 'var(--color-on-surface-variant)',
          }}
        >
          {status}
        </span>
      );
    },
  },
];

const data: User[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', status: 'Active' },
  { id: '3', name: 'Carol White', email: 'carol@example.com', role: 'Viewer', status: 'Inactive' },
  { id: '4', name: 'David Lee', email: 'david@example.com', role: 'Editor', status: 'Active' },
  { id: '5', name: 'Eva Martinez', email: 'eva@example.com', role: 'Admin', status: 'Active' },
];

export const Default: Story = {
  render: () => (
    <DataTable columns={columns} data={data} enableSorting />
  ),
};

interface Account {
  name: string;
  mrr: number;
  seats: number;
}

const accountColumns: DataTableColumn<Account>[] = [
  { accessorKey: 'name', header: 'Account' },
  { accessorKey: 'mrr', header: 'MRR', meta: { align: 'end' } },
  { accessorKey: 'seats', header: 'Seats', meta: { align: 'end' } },
];

const accounts: Account[] = [
  { name: 'Acme', mrr: 12400, seats: 120 },
  { name: 'Globex', mrr: 980, seats: 8 },
  { name: 'Initech', mrr: 4310, seats: 41 },
];

/** Numeric columns aligned to the end via `meta.align`; named by a screen-reader-only caption. */
export const NumericColumns: Story = {
  render: () => (
    <DataTable
      columns={accountColumns}
      data={accounts}
      caption="Top accounts by MRR"
      captionHidden
      enableSorting
      pagination={{ pageSize: 2 }}
    />
  ),
};
