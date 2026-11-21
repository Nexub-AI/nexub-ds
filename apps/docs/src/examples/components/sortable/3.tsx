'use client';

import * as React from 'react';
import { Sortable } from '@nexub/react';

type Story = { id: string; title: string };
type Lists = { id: string; label: string; items: Story[] }[];

export default function Example() {
  const [lists, setLists] = React.useState<Lists>([
    { id: 'backlog', label: 'Backlog', items: [{ id: '1', title: 'Export to CSV' }, { id: '2', title: 'Dark mode charts' }, { id: '3', title: 'SSO for teams' }] },
    { id: 'sprint', label: 'This sprint', items: [{ id: '4', title: 'Invoice reminders' }] },
  ]);
  return (
    <Sortable.Group lists={lists} onChange={setLists} getLabel={(s) => s.title}>
      <div className="grid w-full gap-6 sm:grid-cols-2">
        {lists.map((l) => (
          <div key={l.id} className="flex flex-col gap-2">
            <h3 className="m-0 text-title-sm text-on-surface">{l.label}</h3>
            <Sortable<Story> list={l.id} className="min-h-16">
              {(s) => s.title}
            </Sortable>
          </div>
        ))}
      </div>
    </Sortable.Group>
  );
}
