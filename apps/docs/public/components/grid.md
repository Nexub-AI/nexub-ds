# Grid

CSS Grid layout primitive.

- Package: `@nexub/react` · Category: Layout · Status: stable
- Import: `import { Grid } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/grid

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `cols` | `number \| string` |  | Number of columns or a custom grid-template-columns value. |
| `gap` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` |  | Gap between grid cells using design tokens. |

## Example: 2-column

```tsx
import { Grid, Card, Text } from '@nexub/react';

export default function Example() {
  return (
    <Grid cols={2} gap="md" className="w-full max-w-[400px]">
      {[1, 2, 3, 4].map((n) => (
        <Card key={n}><Text size="body-sm" tone="muted">Card {n}</Text></Card>
      ))}
    </Grid>
  );
}
```

## Example: 3-column

```tsx
import { Grid, Card, Text } from '@nexub/react';

export default function Example() {
  return (
    <Grid cols={3} gap="sm" className="w-full max-w-[480px]">
      {[1, 2, 3, 4, 5, 6].map((n) => (
        <Card key={n}><Text size="caption" tone="muted">Item {n}</Text></Card>
      ))}
    </Grid>
  );
}
```
