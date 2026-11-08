# Sortable

A list people reorder by dragging or with Alt+Arrow keys on a handle.

- Package: `@nexub/react` · Category: Data Display · Status: beta
- Import: `import { Sortable } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/sortable

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` (required) | `T[]` |  | The list, in order. |
| `getId / getLabel` (required) | `(item) => string` |  | Stable key, and the name read in "Move ‹label›" and the move announcements. |
| `onReorder` (required) | `(items: T[]) => void` |  | Called with the new order; store it. |
| `children` (required) | `(item) => ReactNode` |  | The item’s content; the handle sits before it. |
| `aria-label` | `string` |  | Names the list. |

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

## Accessibility

- `Alt+ArrowUp / Alt+ArrowDown`: On a handle: moves the item; focus stays on its handle.
- Every handle is a button named "Move ‹label›", described by the key hint.
- Moves are announced: "Alpha moved to position 3 of 5".
- Mouse drag uses the native drag-and-drop API, so there is no extra dependency.

Related: [kanban](kanban.md), [data-table](data-table.md)
