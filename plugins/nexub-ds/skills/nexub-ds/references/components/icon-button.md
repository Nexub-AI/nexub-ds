# Icon Button

A square button designed to hold a single icon, with an accessible label.

- Package: `@nexub/react` · Category: Actions · Status: stable
- Import: `import { IconButton } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/icon-button

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'ghost' \| 'solid' \| 'outline' \| 'subtle'` | `'ghost'` | Visual style of the icon button. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Controls button dimensions. |
| `disabled` | `boolean` |  | Disables the button. |
| `loading` | `boolean` |  | Shows a spinner and disables interaction. |
| `asChild` | `boolean` |  | Merges props onto the immediate child element (Radix Slot). |

## Example: Default

```tsx
<IconButton variant="ghost" aria-label="Settings">
  <div style={{ width: 16, height: 16, background: 'currentColor', borderRadius: 2 }} />
</IconButton>
```

## Example: Variants

```tsx
<div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
  <IconButton variant="ghost" aria-label="Ghost action">
    <div style={{ width: 16, height: 16, background: 'currentColor', borderRadius: 2 }} />
  </IconButton>
  <IconButton variant="solid" aria-label="Solid action">
    <div style={{ width: 16, height: 16, background: 'currentColor', borderRadius: 2 }} />
  </IconButton>
  <IconButton variant="outline" aria-label="Outline action">
    <div style={{ width: 16, height: 16, background: 'currentColor', borderRadius: 2 }} />
  </IconButton>
  <IconButton variant="subtle" aria-label="Subtle action">
    <div style={{ width: 16, height: 16, background: 'currentColor', borderRadius: 2 }} />
  </IconButton>
</div>
```
