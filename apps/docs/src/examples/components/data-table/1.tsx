'use client'; // docs preview: server pages import every example

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
