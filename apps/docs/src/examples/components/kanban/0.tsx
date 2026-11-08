'use client';

import * as React from 'react';
import { Badge, Kanban, type KanbanColumn } from '@nexub/react';

type Task = { id: string; title: string; tag?: string };

export default function Example() {
  const [columns, setColumns] = React.useState<KanbanColumn<Task>[]>([
    { id: 'todo', title: 'To do', items: [{ id: '1', title: 'Write release notes', tag: 'Docs' }, { id: '2', title: 'Update pricing page' }] },
    { id: 'doing', title: 'In progress', items: [{ id: '3', title: 'Billing migration', tag: 'Backend' }] },
    { id: 'done', title: 'Done', items: [{ id: '4', title: 'Hire designer' }] },
  ]);
  return (
    <Kanban
      columns={columns}
      getId={(t) => t.id}
      getLabel={(t) => t.title}
      onChange={setColumns}
      renderCard={(t) => (
        <div className="flex flex-col items-start gap-1">
          {t.title}
          {t.tag && <Badge>{t.tag}</Badge>}
        </div>
      )}
    />
  );
}
