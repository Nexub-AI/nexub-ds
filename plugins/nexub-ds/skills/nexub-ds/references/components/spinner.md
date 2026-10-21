# Spinner

Animated loading indicator. Inherits color from context.

- Package: `@nexub/react` · Category: Feedback · Status: stable
- Import: `import { Spinner } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/spinner

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Diameter of the spinner. |
| `label` | `string` | `'Loading…'` | Screen-reader accessible label. |

## Example: Sizes

```tsx
<div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
  <Spinner size="xs" />
  <Spinner size="sm" />
  <Spinner size="md" />
  <Spinner size="lg" />
  <Spinner size="xl" />
</div>
```

## Example: Inside button

```tsx
<Button loading>Saving…</Button>
```
