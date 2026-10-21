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
| `align` | `'start' \| 'center' \| 'end' \| 'stretch'` |  | Sets the align-items CSS property for all grid cells. |

## Example: 2-column

```tsx
<Grid cols={2} gap="md">
  <Card><Card.Body><Text>Card one</Text></Card.Body></Card>
  <Card><Card.Body><Text>Card two</Text></Card.Body></Card>
  <Card><Card.Body><Text>Card three</Text></Card.Body></Card>
  <Card><Card.Body><Text>Card four</Text></Card.Body></Card>
</Grid>
```

## Example: 3-column

```tsx
<Grid cols={3} gap="md">
  <Card><Card.Body><Text>Card one</Text></Card.Body></Card>
  <Card><Card.Body><Text>Card two</Text></Card.Body></Card>
  <Card><Card.Body><Text>Card three</Text></Card.Body></Card>
  <Card><Card.Body><Text>Card four</Text></Card.Body></Card>
  <Card><Card.Body><Text>Card five</Text></Card.Body></Card>
  <Card><Card.Body><Text>Card six</Text></Card.Body></Card>
</Grid>
```
