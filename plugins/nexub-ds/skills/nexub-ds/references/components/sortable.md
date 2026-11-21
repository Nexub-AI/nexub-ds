# Sortable

A list people reorder by dragging or with Alt+Arrow keys on a handle.

- Package: `@nexub/react` · Category: Data Display · Status: beta
- Import: `import { Sortable } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/sortable

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` (required) | `T[]` |  | The list, in order. Not used with `list`. |
| `getLabel` | `(item) => string` |  | The name read in "Move ‹label›" and the move announcements. Defaults to `String(item)`: pass it for objects. |
| `getId` | `(item) => string` |  | Stable key. Defaults to `item.id`, else a key kept per object, else the value itself (keep string values unique). |
| `onReorder` (required) | `(items: T[]) => void` |  | Called with the new order; store it. Not used with `list`. |
| `children` (required) | `(item) => ReactNode` |  | The item’s content; the handle sits before it. |
| `aria-label` | `string` |  | Names the list. Inside a group it defaults to the list’s label. |
| `layout` | `'list' \| 'grid'` |  | Default `list`. `grid` wraps items into cells (cards, images); Alt+Arrow keys move an item by one cell or row. |
| `variant` | `'default' \| 'flat'` |  | Default `default`. `flat` drops the card chrome around items, for dense lists inside a card. |
| `disabled` | `boolean` |  | Turns every handle off: nothing moves. |
| `isLocked` | `(item) => boolean` |  | Locked items show a lock, can’t be moved, and keep their index while others move around them, so nothing lands above a locked first item. |
| `list` | `string` |  | Inside `Sortable.Group`: which of its lists this renders (instead of `items` / `onReorder`). |
| `Sortable.Group` | `{ lists: { id, label, items }[]; onChange; getLabel; getId?; isLocked?; disabled? }` |  | Owns several lists items move between; `onChange` gets every list after a move. |

## Example: Widget order

```tsx
'use client';

import * as React from 'react';
import { Sortable } from '@nexub/react';

export default function Example() {
  const [widgets, setWidgets] = React.useState(['Revenue', 'Active users', 'Churn', 'Support tickets']);
  return (
    <Sortable aria-label="Dashboard widgets" items={widgets} getId={(w) => w} getLabel={(w) => w} onReorder={setWidgets} className="w-full max-w-sm">
      {(w) => w}
    </Sortable>
  );
}
```

## Example: Grid

Cards that wrap; the items have no id.

```tsx
'use client';

import * as React from 'react';
import { Sortable } from '@nexub/react';

type Photo = { name: string; hue: string };

export default function Example() {
  // No ids: objects get a stable key of their own.
  const [photos, setPhotos] = React.useState<Photo[]>([
    { name: 'Harbour', hue: 'bg-primary-container' },
    { name: 'Dunes', hue: 'bg-tertiary-container' },
    { name: 'Forest', hue: 'bg-secondary-container' },
    { name: 'Glacier', hue: 'bg-surface-container-high' },
    { name: 'Canyon', hue: 'bg-primary-container' },
    { name: 'Meadow', hue: 'bg-secondary-container' },
  ]);
  return (
    <Sortable aria-label="Gallery order" layout="grid" items={photos} getLabel={(p) => p.name} onReorder={setPhotos} className="w-full">
      {(p) => (
        <figure className="m-0 flex flex-col gap-2">
          <div className={`aspect-video rounded-shape-control ${p.hue}`} />
          <figcaption className="text-body-sm text-on-surface-variant">{p.name}</figcaption>
        </figure>
      )}
    </Sortable>
  );
}
```

## Example: Flat, locked and disabled

A dense list in a card: the first column is locked, and the switch turns editing off.

```tsx
'use client';

import * as React from 'react';
import { Card, Sortable, SwitchField } from '@nexub/react';

export default function Example() {
  const [columns, setColumns] = React.useState(['Name', 'Owner', 'Status', 'Due date', 'Budget']);
  const [editing, setEditing] = React.useState(true);
  return (
    <Card className="flex w-full max-w-sm flex-col gap-3 p-4">
      <SwitchField checked={editing} onCheckedChange={setEditing} label="Edit order" />
      <Sortable
        aria-label="Table columns"
        variant="flat"
        disabled={!editing}
        isLocked={(c) => c === 'Name'}
        items={columns}
        getLabel={(c) => c}
        onReorder={setColumns}
      >
        {(c) => c}
      </Sortable>
    </Card>
  );
}
```

## Example: Groups

Move stories between the backlog and the sprint, by drag or Alt+ArrowLeft / Alt+ArrowRight.

```tsx
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
```

## Accessibility

- `Alt+ArrowUp / Alt+ArrowDown`: On a handle: moves the item (by a row in a grid); focus stays on its handle.
- `Alt+ArrowLeft / Alt+ArrowRight`: In a grid, moves the item by one cell; in a group, to the previous or next list. Mirrored in RTL.
- Every handle is a button named "Move ‹label›", described by the key hint.
- Moves are announced: "Alpha moved to position 3 of 5", or "Alpha moved to Sprint, position 1 of 2" across lists.
- A locked item’s handle is disabled and named "‹label› is locked".
- Dragging uses Pointer Events (mouse, pen, touch; Escape cancels), so there is no extra dependency. The settle animation is off under reduced motion.

Related: [kanban](kanban.md), [data-table](data-table.md)
