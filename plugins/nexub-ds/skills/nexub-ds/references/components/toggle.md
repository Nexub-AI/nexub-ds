# Toggle

Pressable toggle button built on Radix UI Toggle.

- Package: `@nexub/react` · Category: Interactive · Status: stable
- Import: `import { Toggle } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/toggle

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `pressed` | `boolean` |  | The controlled pressed state. |
| `defaultPressed` | `boolean` |  | The initial pressed state when uncontrolled. |
| `variant` | `'default' \| 'outline'` |  | Visual style of the toggle button. |
| `size` | `'sm' \| 'md' \| 'lg'` |  | Size of the toggle button. |
| `disabled` | `boolean` |  | Disables the toggle when true. |

## Example: Default

```tsx
<Toggle>Bold</Toggle>
```

## Example: Outline variants

```tsx
<div style={{ display: 'flex', gap: '8px' }}>
  <Toggle variant="outline">Unpressed</Toggle>
  <Toggle variant="outline" defaultPressed>Pressed</Toggle>
</div>
```
