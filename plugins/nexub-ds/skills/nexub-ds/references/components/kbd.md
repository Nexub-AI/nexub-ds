# Kbd

Keyboard key display — renders a styled <kbd> element.

- Package: `@nexub/react` · Category: Inline Primitives · Status: stable
- Import: `import { Kbd } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/kbd

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...props` | `React.HTMLAttributes<HTMLElement>` |  | All standard kbd HTML attributes are forwarded. |

## Example: Default

```tsx
import { Kbd } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex gap-1 flex-wrap items-center justify-center">
      <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
    </div>
  );
}
```

## Example: Combinations

```tsx
import { Kbd, Text } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-col gap-2 items-start">
      <div className="flex gap-1 flex-wrap items-center justify-center"><Kbd>⌘</Kbd><Kbd>K</Kbd><Text size="body-sm" tone="secondary">— Open search</Text></div>
      <div className="flex gap-1 flex-wrap items-center justify-center"><Kbd>⌃</Kbd><Kbd>C</Kbd><Text size="body-sm" tone="secondary">— Copy</Text></div>
      <div className="flex gap-1 flex-wrap items-center justify-center"><Kbd>⇧</Kbd><Kbd>⌘</Kbd><Kbd>P</Kbd><Text size="body-sm" tone="secondary">— Command palette</Text></div>
    </div>
  );
}
```
