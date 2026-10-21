# Stack

Vertical stack layout with configurable gap.

- Package: `@nexub/react` · Category: Layout · Status: stable
- Import: `import { Stack } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/stack

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `gap` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Spacing between child elements. |
| `align` | `'start' \| 'center' \| 'end' \| 'stretch'` |  | Cross-axis alignment of children. |
| `dividers` | `boolean` |  | Renders a divider line between each child element. |

## Example: Default

```tsx
<Stack gap="md">
  <Button variant="outline">Item 1</Button>
  <Button variant="outline">Item 2</Button>
  <Button variant="outline">Item 3</Button>
</Stack>
```

## Example: With dividers

```tsx
<Stack gap="md" dividers>
  <Text>First section</Text>
  <Text>Second section</Text>
  <Text>Third section</Text>
</Stack>
```
