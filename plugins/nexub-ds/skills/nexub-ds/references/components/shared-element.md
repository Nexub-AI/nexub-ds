# Shared Element

Morphs the same element between two states or pages inside a view transition.

- Package: `@nexub/react` · Category: Motion · Status: beta
- Import: `import { SharedElement } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/shared-element

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` (required) | `string` |  | Same name on both sides, e.g. `avatar-${id}`. One element per name on screen at a time. |
| `children` (required) | `ReactElement` |  | One element; the name is set on it. |

## Example: List to detail

```tsx
'use client';

import * as React from 'react';
import { Avatar, Button, Card, SharedElement, startViewTransition } from '@nexub/react';

const people = [{ id: 'sl', name: 'Sam Lee', role: 'Finance' }, { id: 'ar', name: 'Ana Ruiz', role: 'Design' }];

export default function Example() {
  const [open, setOpen] = React.useState<string | null>(null);
  const person = people.find((p) => p.id === open);
  const go = (id: string | null) => startViewTransition(() => setOpen(id));
  return person ? (
    <Card variant="surface" className="flex w-full flex-col items-center gap-3 p-8">
      <SharedElement name={`avatar-${person.id}`}><Avatar size="xl" fallback={person.id.toUpperCase()} /></SharedElement>
      <p className="m-0 text-title-lg">{person.name}</p>
      <Button variant="outlined" onClick={() => go(null)}>Back</Button>
    </Card>
  ) : (
    <div className="flex w-full flex-col gap-2">
      {people.map((p) => (
        <button key={p.id} type="button" onClick={() => go(p.id)} className="nx-state-layer flex items-center gap-3 rounded-shape-container border border-[var(--color-outline-variant)] p-3 text-start">
          <SharedElement name={`avatar-${p.id}`}><Avatar size="sm" fallback={p.id.toUpperCase()} /></SharedElement>
          <span className="text-body-md">{p.name} · {p.role}</span>
        </button>
      ))}
    </div>
  );
}
```

## Accessibility

- Visual only: run the change in `startViewTransition()` and move focus to the new view as usual.

Related: [motion-fade](motion-fade.md)
