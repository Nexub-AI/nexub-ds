# Container

Centres content at a maximum width with responsive side padding.

- Package: `@nexub/react` · Category: Layout · Status: stable
- Import: `import { Container } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/container

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| 'nexub' \| 'marketing' \| 'prose'` |  | Maximum width, from the `--container-*` tokens. `prose` is 65ch for reading. |
| `paddingX` | `boolean` |  | Responsive horizontal padding (16, 24, 32 px). |
| `asChild` | `boolean` |  | Apply the container classes to the child element (e.g. `<main>`) instead of a `<div>`. |

## Example: Default

```tsx
import { Container, Text } from '@nexub/react';

export default function Example() {
  return (
    <div className="w-full bg-[var(--color-surface-container-low)] py-4">
      <Container size="sm" className="rounded-shape-container bg-[var(--color-surface)] py-4">
        <Text size="body-sm">Centred at up to 640 px, with responsive side padding.</Text>
      </Container>
    </div>
  );
}
```

## Example: Prose width

```tsx
import { Container, Heading, Text } from '@nexub/react';

export default function Example() {
  return (
    <Container size="prose" paddingX={false}>
      <Heading level={3}>Release notes</Heading>
      <Text size="body-sm" tone="secondary" className="mt-2">
        The prose size caps lines at about 65 characters, a comfortable measure for reading long text.
      </Text>
    </Container>
  );
}
```

Related: [section](section.md), [box](box.md), [stack](stack.md)
