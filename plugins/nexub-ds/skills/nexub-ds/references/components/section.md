# Section

A full-width page band with vertical padding and a background tone; put a `Container` inside.

- Package: `@nexub/react` · Category: Layout · Status: stable
- Import: `import { Section } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/section

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `paddingY` | `'sm' \| 'md' \| 'lg'` |  | Vertical padding: 48, 80 or 128 px. |
| `tone` | `'default' \| 'subtle' \| 'muted' \| 'inverse'` |  | Background: the surface, two container tints, or the inverse surface. |
| `asChild` | `boolean` |  | Apply the classes to the child element instead of a `<section>`. |

## Example: Tones

```tsx
import { Container, Section, Text } from '@nexub/react';

const tones = ['default', 'subtle', 'muted', 'inverse'] as const;

export default function Example() {
  return (
    <div className="w-full overflow-hidden rounded-shape-container border border-[var(--color-outline-variant)]">
      {tones.map((tone) => (
        <Section key={tone} tone={tone} paddingY="sm" aria-label={`${tone} tone`}>
          <Container size="sm">
            <Text size="body-sm" className="text-inherit">tone=&quot;{tone}&quot;</Text>
          </Container>
        </Section>
      ))}
    </div>
  );
}
```

## Accessibility

- A `<section>` is a region landmark only when it has an accessible name: give it `aria-labelledby` pointing at its heading.

Related: [container](container.md), [box](box.md)
