# Heading

Semantic heading component with size, weight, and tone control.

- Package: `@nexub/react` · Category: Typography · Status: stable
- Import: `import { Heading } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/heading

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `level` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `2` | The semantic HTML heading level rendered. |
| `size` | `'display' \| 'h1' \| 'h2' \| 'h3' \| 'h4' \| 'h5' \| 'h6'` |  | Visual size of the heading, independent of the semantic level. |
| `tone` | `'default' \| 'muted' \| 'info' \| 'success' \| 'warning' \| 'danger'` |  | Color tone applied to the heading text. |
| `weight` | `'regular' \| 'medium' \| 'semibold' \| 'bold' \| 'extrabold'` |  | Font weight of the heading. |
| `asChild` | `boolean` |  | Merges props onto the immediate child element (Radix Slot). |

## Example: Default

```tsx
<Heading>The quick brown fox</Heading>
```

## Example: Scale

```tsx
<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
  <Heading size="h1">Heading H1</Heading>
  <Heading size="h2">Heading H2</Heading>
  <Heading size="h3">Heading H3</Heading>
  <Heading size="h4">Heading H4</Heading>
  <Heading size="h5">Heading H5</Heading>
</div>
```

## Example: Tones

```tsx
<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
  <Heading tone="info">Info heading</Heading>
  <Heading tone="success">Success heading</Heading>
  <Heading tone="warning">Warning heading</Heading>
  <Heading tone="danger">Danger heading</Heading>
</div>
```
