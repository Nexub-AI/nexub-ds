# Action Bar

Save and cancel that stay in view at the bottom of a long form.

- Package: `@nexub/react` · Category: Form & Input · Status: beta
- Import: `import { ActionBar } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/action-bar

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `message` | `ReactNode` |  | Status on the start side, e.g. "Unsaved changes"; announced politely and names the region. |
| `children` (required) | `ReactNode` |  | The actions, primary last. |

## Example: Unsaved changes

```tsx
'use client';

import * as React from 'react';
import { ActionBar, Button, Input, useUnsavedChanges } from '@nexub/react';

export default function Example() {
  const [saved, setSaved] = React.useState('Acme');
  const [name, setName] = React.useState('Acme');
  const dirty = name !== saved;
  useUnsavedChanges(dirty);
  return (
    <div className="flex w-full max-w-lg flex-col gap-4">
      <Input aria-label="Company name" value={name} onChange={(e) => setName(e.target.value)} />
      {dirty && (
        <ActionBar message="Unsaved changes">
          <Button variant="text" onClick={() => setName(saved)}>Discard</Button>
          <Button onClick={() => setSaved(name)}>Save</Button>
        </ActionBar>
      )}
    </div>
  );
}
```

## Accessibility

- A region named by its message. Sticky at the bottom of its scrolling parent, so put it last in the form.
- Pair with `useUnsavedChanges(dirty)` to warn before leaving the page.

Related: [form](form.md), [data-table](data-table.md)
