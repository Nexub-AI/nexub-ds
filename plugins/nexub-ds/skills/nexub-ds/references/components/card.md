# Card

Surface container for grouping related content. Supports flat, surface, and interactive variants.

- Package: `@nexub/react` · Category: Layout · Status: stable
- Import: `import { Card } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/card

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'flat' \| 'surface' \| 'interactive'` | `'flat'` | Visual style of the card surface. |
| `tone` | `ToneValue` | `undefined` | Applies a semantic left-border accent. |
| `asChild` | `boolean` | `false` | Merges props onto the immediate child element. |
| `surface` | `'solid' \| 'glass'` | `'solid'` | Liquid-glass material treatment — see Foundations → Materials. |

## Example: Default

```tsx
<Card>
  <Heading as="h3" size="sm">Card title</Heading>
  <Text size="body-sm" tone="muted">Card description goes here.</Text>
</Card>
```

## Example: Variants

```tsx
<div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
  <Card variant="flat"><Text size="body-sm">Flat</Text></Card>
  <Card variant="surface"><Text size="body-sm">Surface (elevated)</Text></Card>
  <Card variant="interactive"><Text size="body-sm">Interactive (hover)</Text></Card>
</div>
```

## Accessibility

- Roles: region (when used as a landmark)
- `Tab`: Focuses interactive children. Card itself is not focusable unless `variant="interactive"` wraps a `<Link>` or `<button>`.
- Use `<Card asChild>` with a `<Link>` or `<button>` inside to make the whole surface clickable while preserving correct focus semantics.
- Group related content with a heading inside the Card so AT users can navigate by heading level.

Related: [callout](callout.md), [banner](banner.md), [alert](alert.md)
