# Visually Hidden

Content for screen readers only: hidden on screen but still read out (Radix).

- Package: `@nexub/react` · Category: Inline Primitives · Status: stable
- Import: `import { VisuallyHidden } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/visually-hidden

## When to use

- Extra context a sighted user gets from layout, e.g. "(opens in a new tab)"

## When not to use

- Naming an icon button: `IconButton` takes a `label`
- Hiding content from everyone: use `hidden`

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` |  | The text to read out. |
| `asChild` | `boolean` |  | Hide your own element instead of a `<span>`. |

## Example: Label an icon

```tsx
import { Link, VisuallyHidden } from '@nexub/react';

export default function Example() {
  return (
    <Link href="https://example.com" target="_blank" rel="noreferrer">
      Status page
      <VisuallyHidden> (opens in a new tab)</VisuallyHidden>
    </Link>
  );
}
```

Related: [icon-button](icon-button.md)
