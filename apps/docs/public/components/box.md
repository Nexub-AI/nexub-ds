# Box

Generic container primitive with style token props.

- Package: `@nexub/react` · Category: Layout · Status: stable
- Import: `import { Box } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/box

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` |  | Merges props onto the immediate child element (Radix Slot). |

## Example: Default

```tsx
import { Box, Text } from '@nexub/react';

export default function Example() {
  return (
    <Box className="p-4 bg-[var(--color-surface-container-low)] rounded-shape-field">
      <Text size="body-sm">Content inside a Box</Text>
    </Box>
  );
}
```

## Example: Nested

```tsx
import { Box, Heading, Text } from '@nexub/react';

export default function Example() {
  return (
    <Box className="p-6 bg-[var(--color-surface-container-low)] rounded-shape-container">
      <Heading size="h4">Section title</Heading>
      <Box className="p-3 bg-[var(--color-surface)] rounded-shape-field mt-2">
        <Text size="body-sm">Nested box content</Text>
      </Box>
    </Box>
  );
}
```
