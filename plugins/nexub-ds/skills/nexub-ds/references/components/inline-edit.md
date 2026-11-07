# Inline Edit

Text that becomes an input on click, for renaming things in place.

- Package: `@nexub/react` · Category: Form & Input · Status: beta
- Import: `import { InlineEdit } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/inline-edit

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` (required) | `string` |  | The saved text. |
| `onSave` (required) | `(value: string) => void \| Promise` |  | Called on Enter or blur when the text changed. A promise keeps the field open and busy; a rejection keeps it open and invalid. |
| `label` (required) | `string` |  | Names the input, and the button reads "Edit ‹label›, ‹value›". |
| `placeholder` | `string` |  | Shown when the value is empty. |
| `disabled` | `boolean` |  | Shows the text without editing. |

## Example: Rename

```tsx
'use client';

import * as React from 'react';
import { InlineEdit } from '@nexub/react';

export default function Example() {
  const [name, setName] = React.useState('Q4 launch plan');
  return (
    <InlineEdit
      label="Project name"
      placeholder="Add a name"
      value={name}
      onSave={(next) => {
        if (!next.trim()) return Promise.reject(new Error('Name is required'));
        setName(next.trim());
      }}
    />
  );
}
```

## Accessibility

- `Enter / Space`: On the text: starts editing.
- `Enter`: In the input: saves.
- `Escape`: Reverts and returns focus to the text.
- Moving focus away saves too. Validate in `onSave` and reject to keep the field open.

Related: [input](input.md), [form](form.md)
