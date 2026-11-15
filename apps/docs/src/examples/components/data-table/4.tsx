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
