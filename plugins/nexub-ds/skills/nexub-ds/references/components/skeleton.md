# Skeleton

Placeholder loading animation that mimics content layout.

- Package: `@nexub/react` · Category: Loading States · Status: stable
- Import: `import { Skeleton } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/skeleton

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `shape` | `'line' \| 'rect' \| 'circle'` | `'line'` | Shape of the skeleton placeholder. |
| `width` | `string \| number` |  | Width of the skeleton element. |
| `height` | `string \| number` |  | Height of the skeleton element. |
| `animated` | `boolean` | `true` | Enables the shimmer animation. |

## Example: Default

```tsx
<div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '280px', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
  <Skeleton shape="circle" width={40} height={40} />
  <Skeleton shape="line" width="60%" height={12} />
  <Skeleton shape="line" width="100%" height={12} />
  <Skeleton shape="line" width="80%" height={12} />
  <Skeleton shape="rect" width="100%" height={80} />
</div>
```

## Example: Shapes

```tsx
<div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
  <Skeleton shape="line" width={120} height={12} />
  <Skeleton shape="rect" width={80} height={60} />
  <Skeleton shape="circle" width={40} height={40} />
</div>
```
