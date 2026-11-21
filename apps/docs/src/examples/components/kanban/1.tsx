'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { Kanban, type KanbanColumn } from '@nexub/react';

type Ticket = { id: string; title: string; owner: string; high?: boolean };
const start: KanbanColumn<Ticket>[] = [
  { id: 'todo', title: 'To do', items: [{ id: 't1', title: 'Renew SSL certificate', owner: 'ana', high: true }, { id: 't2', title: 'Update pricing page', owner: 'ben' }] },
  { id: 'doing', title: 'Doing', items: [{ id: 't3', title: 'Migrate invoices', owner: 'ana' }] },
  { id: 'done', title: 'Done', items: [] },
];
const WIP = 2;

export default function Example() {
  const [cols, setCols] = React.useState(start);
  const [archived, setArchived] = React.useState<string[]>([]);
  return (
    <div className="flex w-full flex-col gap-2">
      <Kanban
        columns={cols}
        getId={(t) => t.id}
        getLabel={(t) => t.title}
        lanes={[{ id: 'ana', title: 'Ana' }, { id: 'ben', title: 'Ben' }]}
        getLane={(t) => t.owner}
        onChange={(next, { item, to }) =>
          setCols(next.map((c) => ({ ...c, items: c.items.map((t) => (t.id === item.id && to.laneId ? { ...t, owner: to.laneId } : t)) })))
        }
        canMove={({ to }) => to.columnId !== 'doing' || cols[1]!.items.length < WIP}
        renderColumnHeader={(c, count) => (
          <span className="flex w-full items-center justify-between">
            {c.title}
            <span className="text-label-md font-normal text-on-surface-muted">{c.id === 'doing' ? `${count} / ${WIP}` : count}</span>
          </span>
        )}
        getTone={(t) => (t.high ? 'danger' : undefined)}
        columnWidth="sm"
        dropTargets={[{ id: 'archive', label: 'Archive', onDrop: (t) => setArchived((a) => [...a, t.title]) }]}
        renderCard={(t) => (
          <span className="flex flex-col">
            {t.title}
            {t.high && <span className="text-label-sm text-error">High priority</span>}
          </span>
        )}
      />
      <p className="text-body-sm text-on-surface-muted">Archived: {archived.join(', ') || '—'}</p>
    </div>
  );
}
