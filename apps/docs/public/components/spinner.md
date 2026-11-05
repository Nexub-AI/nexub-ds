# Spinner

Animated loading indicator. Inherits color from context.

- Package: `@nexub/react` · Category: Feedback · Status: stable
- Import: `import { Spinner } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/spinner

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Diameter of the spinner. |
| `label` | `string` | `'Loading…'` | Screen-reader accessible label. |

## Example: Sizes

```tsx
import { Spinner } from '@nexub/react';

export default function Example() {
  return <div className="flex gap-5 flex-wrap items-center justify-center"><Spinner size="sm" /><Spinner size="md" /><Spinner size="lg" /><Spinner size="xl" /></div>;
}
```

## Example: Inside button

```tsx
import { Spinner } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex gap-5 flex-wrap items-center justify-center">
      <Spinner size="md" tone="info" />
      <Spinner size="md" tone="success" />
      <Spinner size="md" tone="warning" />
      <Spinner size="md" tone="danger" />
    </div>
  );
}
```
