# Kanban

Columns of cards people move by dragging or with Alt+Arrow keys.

- Package: `@nexub/react` · Category: Data Display · Status: beta
- Import: `import { Kanban } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/kanban

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `columns` (required) | `{ id, title, items: T[] }[]` |  | The board. |
| `getId / getLabel` (required) | `(item) => string` |  | Stable key and the name read when it moves. |
| `onChange` (required) | `(columns) => void` |  | Called with the columns after a move; store them (and save to your server). |
| `renderCard` (required) | `(item) => ReactNode` |  | The card’s content. |
| `onChange` | `(columns, move: { item, from, to }) => void` |  | 11.4: the second argument names the moved card and its column and lane before and after. |
| `readOnly` | `boolean` |  | 11.4: no drag handles, no keyboard moves. |
| `canMove` | `(move: { item, from, to }) => boolean` |  | 11.4: refuse a target before the card lands (a WIP limit, a rule); the drop mark does not show and the keyboard announces it. |
| `dropTargets` | `{ id, label, icon?, onDrop(item, from) }[]` |  | 11.4: areas outside the columns (Archive, Trash). Alt+Arrow keys reach them after the last column. |
| `renderColumnHeader / renderColumnFooter` | `(column, …) => ReactNode` |  | 11.4: replace the header (WIP badge, actions); add a slot under the cards (quick add). |
| `lanes / getLane` | `{ id, title }[] / (item) => string` |  | 11.4: swimlanes: one row of columns per lane. |
| `getTone` | `(item) => 'info' \| 'success' \| 'warning' \| 'danger' \| undefined` |  | 11.4: a coloured edge on the card; say the meaning in the card text too. |
| `columnWidth` | `'sm' \| 'md' \| 'lg'` | `'md'` | 11.4: 15, 18 or 24rem. |

## Example: Task board

```tsx
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
```

## Example: Workflow: lanes, WIP limit, archive

```tsx
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
```

## Accessibility

- `Alt+ArrowUp / Alt+ArrowDown`: On a handle: moves the card within its column.
- `Alt+ArrowLeft / Alt+ArrowRight`: Moves the card to the previous or next column. Mirrored in RTL.
- Each column is a region named by its heading. Moves are announced: "Bravo moved to Done, position 2 of 2".

Related: [sortable](sortable.md)
