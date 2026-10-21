# Separator

A horizontal or vertical visual divider.

- Package: `@nexub/react` · Category: Dividers · Status: stable
- Import: `import { Separator } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/separator

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Direction of the separator line. |
| `decorative` | `boolean` | `true` | When true, the separator is hidden from the accessibility tree. |

## Example: Default

```tsx
<Separator />
```

## Example: Vertical

```tsx
<div style={{ display: 'flex', height: '32px', alignItems: 'center', gap: '16px' }}>
  <span>Left</span>
  <Separator orientation="vertical" />
  <span>Right</span>
</div>
```
