# Flex

Flexbox layout primitive.

- Package: `@nexub/react` · Category: Layout · Status: stable
- Import: `import { Flex } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/flex

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `direction` | `'row' \| 'column' \| 'row-reverse' \| 'column-reverse'` |  | Sets the flex-direction CSS property. |
| `align` | `'start' \| 'center' \| 'end' \| 'stretch'` |  | Sets the align-items CSS property. |
| `justify` | `'start' \| 'center' \| 'end' \| 'between' \| 'around'` |  | Sets the justify-content CSS property. |
| `gap` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` |  | Spacing between children using design tokens. |
| `wrap` | `boolean` |  | Allows children to wrap onto multiple lines. |

## Example: Default

```tsx
<Flex gap="md" align="center">
  <Button variant="primary">Action</Button>
  <Button variant="outline">Cancel</Button>
</Flex>
```

## Example: Space between

```tsx
<Flex justify="between">
  <Badge tone="success">Active</Badge>
  <Badge tone="neutral">Draft</Badge>
</Flex>
```

## Example: Wrap

```tsx
<Flex gap="sm" wrap>
  <Badge tone="info">React</Badge>
  <Badge tone="info">TypeScript</Badge>
  <Badge tone="info">Tailwind</Badge>
  <Badge tone="info">Radix UI</Badge>
  <Badge tone="info">Storybook</Badge>
</Flex>
```
