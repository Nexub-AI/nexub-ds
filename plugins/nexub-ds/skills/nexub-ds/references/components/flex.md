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
import { Flex, Button } from '@nexub/react';

export default function Example() {
  return (
    <Flex gap="md" align="center">
      <Button variant="filled">Action</Button>
      <Button variant="outlined">Cancel</Button>
    </Flex>
  );
}
```

## Example: Space between

```tsx
import { Flex, Badge } from '@nexub/react';

export default function Example() {
  return (
    <Flex justify="between" className="w-full max-w-[320px]">
      <Badge tone="success">Active</Badge>
      <Badge tone="neutral">Draft</Badge>
    </Flex>
  );
}
```

## Example: Wrap

```tsx
import { Flex, Badge } from '@nexub/react';

export default function Example() {
  return (
    <Flex gap="sm" wrap className="max-w-[260px]">
      {['React', 'TypeScript', 'Tailwind', 'Radix UI', 'Storybook'].map((t) => (
        <Badge key={t} tone="info">{t}</Badge>
      ))}
    </Flex>
  );
}
```
