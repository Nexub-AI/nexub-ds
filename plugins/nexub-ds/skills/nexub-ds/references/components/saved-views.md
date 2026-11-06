# Saved Views

A menu to switch, save, update and delete saved filter views. Your app stores them.

- Package: `@nexub/react` · Category: Navigation · Status: beta
- Import: `import { SavedViews } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/saved-views

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `views` (required) | `{ id: string; name: string }[]` |  | The saved views. |
| `activeId` | `string` |  | The view in use; its name shows on the button. |
| `onSelect` (required) | `(id: string) => void` |  | Switch to a view: restore its filters, sort and columns. |
| `onSave` | `(name: string) => void` |  | Adds "Save as new view…", which asks for a name. |
| `onUpdate / onDelete` | `(id: string) => void` |  | Add "Update" and "Delete" for the active view. |

## Example: Views for a deals table

```tsx
'use client';

import * as React from 'react';
import { SavedViews, type SavedView } from '@nexub/react';

export default function Example() {
  const [views, setViews] = React.useState<SavedView[]>([
    { id: 'mine', name: 'My open deals' },
    { id: 'big', name: 'Over $10k' },
  ]);
  const [active, setActive] = React.useState('mine');
  return (
    <SavedViews
      views={views}
      activeId={active}
      onSelect={setActive}
      onSave={(name) => {
        const id = crypto.randomUUID();
        setViews((v) => [...v, { id, name }]);
        setActive(id);
      }}
      onUpdate={() => {}}
      onDelete={(id) => {
        setViews((v) => v.filter((x) => x.id !== id));
        setActive('');
      }}
    />
  );
}
```

Related: [filter-builder](filter-builder.md), [filter-bar](filter-bar.md), [data-table](data-table.md)
