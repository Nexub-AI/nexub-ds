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

## Accessibility

- `Alt+ArrowUp / Alt+ArrowDown`: On a handle: moves the card within its column.
- `Alt+ArrowLeft / Alt+ArrowRight`: Moves the card to the previous or next column. Mirrored in RTL.
- Each column is a region named by its heading. Moves are announced: "Bravo moved to Done, position 2 of 2".

Related: [sortable](sortable.md)
