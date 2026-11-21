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
| `onSave` | `(name: string) => void \| Promise<unknown>` |  | Adds "Save as new view…", which asks for a name. A returned promise keeps the dialog busy; a rejection shows its message. |
| `onUpdate / onDelete` | `(id: string) => void \| Promise<unknown>` |  | Add "Update" and "Delete" for the active view. A returned promise holds the control busy; a rejection shows its message. |
| `onRename` | `(id: string, name: string) => void \| Promise<unknown>` |  | 11.5: adds "Rename" for the active view, which asks for a new name. |
| `confirmDelete` | `boolean` | `false` | 11.5: ask in an AlertDialog before deleting. |
| `defaultView` | `string` |  | 11.5: the default view’s id. Tagged "Default" in the menu, and applied once on mount when `activeId` is undefined. |
| `maxLength` | `number` |  | 11.5: the longest name allowed when saving or renaming. |

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

## Example: Async, with a default view

Save, rename and delete wait on a request. Saving an existing name fails; deleting asks first.

```tsx
import * as React from 'react';
import { SavedViews, type SavedView } from '@nexub/react';

// Stands in for a request to your server.
const request = () => new Promise((resolve) => setTimeout(resolve, 800));

export default function Example() {
  const [views, setViews] = React.useState<SavedView[]>([
    { id: 'mine', name: 'My open deals' },
    { id: 'big', name: 'Over $10k' },
  ]);
  const [active, setActive] = React.useState<string>();
  return (
    <SavedViews
      views={views}
      activeId={active}
      onSelect={setActive}
      defaultView="mine"
      maxLength={40}
      confirmDelete
      onSave={async (name) => {
        await request();
        if (views.some((v) => v.name === name)) throw new Error('A view with this name already exists.');
        const id = crypto.randomUUID();
        setViews((v) => [...v, { id, name }]);
        setActive(id);
      }}
      onRename={async (id, name) => {
        await request();
        setViews((v) => v.map((x) => (x.id === id ? { ...x, name } : x)));
      }}
      onDelete={async (id) => {
        await request();
        setViews((v) => v.filter((x) => x.id !== id));
        setActive('mine');
      }}
    />
  );
}
```

Related: [filter-builder](filter-builder.md), [filter-bar](filter-bar.md), [data-table](data-table.md)
