# Box

Generic container primitive with style token props.

- Package: `@nexub/react` · Category: Layout · Status: stable
- Import: `import { Box } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/box

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `padding` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` |  | Padding applied to all sides using design tokens. |
| `background` | `string` |  | Background color CSS value or token. |
| `radius` | `string` |  | Border radius CSS value or token. |
| `asChild` | `boolean` |  | Merges props onto the immediate child element (Radix Slot). |

## Example: Default

```tsx
<Box padding="md" style={{ background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)' }}>
  Content inside a Box
</Box>
```

## Example: Nested

```tsx
<Box padding="lg" style={{ background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-lg)' }}>
  <Heading size="h4">Section title</Heading>
  <Box padding="sm" style={{ background: 'var(--color-bg-default)', borderRadius: 'var(--radius-md)', marginTop: '8px' }}>
    <Text>Nested box content</Text>
  </Box>
</Box>
```
