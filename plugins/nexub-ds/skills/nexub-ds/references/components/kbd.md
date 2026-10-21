# Kbd

Keyboard key display — renders a styled <kbd> element.

- Package: `@nexub/react` · Category: Inline Primitives · Status: stable
- Import: `import { Kbd } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/kbd

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...props` | `React.HTMLAttributes<HTMLElement>` |  | All standard kbd HTML attributes are forwarded. |

## Example: Default

```tsx
<div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
  <Kbd>⌘</Kbd>
  <Kbd>K</Kbd>
</div>
```

## Example: Combinations

```tsx
<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
    <Kbd>⌘</Kbd>
    <Kbd>K</Kbd>
  </div>
  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
    <Kbd>Ctrl</Kbd>
    <Kbd>C</Kbd>
  </div>
  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
    <Kbd>⇧</Kbd>
    <Kbd>⌘</Kbd>
    <Kbd>P</Kbd>
  </div>
</div>
```
