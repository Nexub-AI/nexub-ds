# Chip

Compact label chip, optionally dismissible.

- Package: `@nexub/react` · Category: Labels & Badges · Status: stable
- Import: `import { Chip } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/chip

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'filled' \| 'outline'` | `'filled'` | Visual style of the chip. |
| `onRemove` | `() => void` |  | When provided, renders a dismiss button that calls this handler. |
| `size` | `'sm' \| 'md'` |  | Controls chip size. |

## Example: Default

```tsx
import { Chip } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex gap-2 flex-wrap items-center justify-center">
      {['Design', 'Engineering', 'Product'].map((c) => <Chip key={c}>{c}</Chip>)}
    </div>
  );
}
```

## Example: Dismissible

```tsx
import * as React from 'react';
import { Chip } from '@nexub/react';

export default function Example() {
  const [chips, setChips] = React.useState(['Design', 'Engineering', 'Product']);
  return (
    <div className="flex gap-2 flex-wrap items-center justify-center">
      {chips.map((c) => (
        <Chip key={c} onRemove={() => setChips((prev) => prev.filter((x) => x !== c))}>{c}</Chip>
      ))}
    </div>
  );
}
```
