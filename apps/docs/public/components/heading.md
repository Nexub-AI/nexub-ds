# Heading

Semantic heading component with size, weight, and tone control.

- Package: `@nexub/react` · Category: Typography · Status: stable
- Import: `import { Heading } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/heading

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `level` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `2` | The semantic HTML heading level rendered. |
| `size` | `'display' \| 'h1' \| 'h2' \| 'h3' \| 'h4' \| 'h5' \| 'h6'` |  | Visual size of the heading, independent of the semantic level. |
| `tone` | `'default' \| 'muted' \| 'info' \| 'success' \| 'warning' \| 'danger'` |  | Color tone applied to the heading text. |
| `weight` | `'regular' \| 'medium' \| 'semibold' \| 'bold' \| 'extrabold'` |  | Font weight of the heading. |
| `asChild` | `boolean` |  | Merges props onto the immediate child element (Radix Slot). |

## Example: Default

```tsx
import { Heading } from '@nexub/react';

export default function Example() {
  return <Heading>The quick brown fox</Heading>;
}
```

## Example: Scale

```tsx
import { Heading } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-col gap-2 items-start">
      <Heading size="h1">Heading 1</Heading>
      <Heading size="h2">Heading 2</Heading>
      <Heading size="h3">Heading 3</Heading>
      <Heading size="h4">Heading 4</Heading>
      <Heading size="h5">Heading 5</Heading>
    </div>
  );
}
```

## Example: Tones

```tsx
import { Heading } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-col gap-2 items-start">
      <Heading tone="info">Info tone</Heading>
      <Heading tone="success">Success tone</Heading>
      <Heading tone="warning">Warning tone</Heading>
      <Heading tone="danger">Danger tone</Heading>
    </div>
  );
}
```
