# Chip

Compact label chip, optionally dismissible.

- Package: `@nexub/react` · Category: Labels & Badges · Status: stable
- Import: `import { Chip } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/chip

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'filled' \| 'outline'` | `'filled'` | Visual style of the chip. |
| `onRemove` | `() => void` |  | When provided, renders a dismiss button that calls this handler. |
| `size` | `'sm' \| 'md'` |  | Controls chip size. |

## Example: Default

```tsx
<div style={{ display: 'flex', gap: '8px' }}>
  <Chip>Design</Chip>
  <Chip>Engineering</Chip>
  <Chip>Product</Chip>
</div>
```

## Example: Dismissible

```tsx
<div style={{ display: 'flex', gap: '8px' }}>
  <Chip onRemove={() => {}}>Design</Chip>
  <Chip onRemove={() => {}}>Engineering</Chip>
  <Chip onRemove={() => {}}>Product</Chip>
</div>
```
