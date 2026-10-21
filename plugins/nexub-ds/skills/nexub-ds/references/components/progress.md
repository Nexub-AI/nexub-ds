# Progress

Horizontal progress bar with optional tone and animation.

- Package: `@nexub/react` · Category: Loading States · Status: stable
- Import: `import { Progress } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/progress

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number` |  | Current progress value between 0 and max. |
| `max` | `number` | `100` | Maximum value of the progress bar. |
| `tone` | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'` |  | Semantic colour tone of the filled track. |
| `animated` | `boolean` | `false` | Adds a stripes-in-motion animation to the filled track. |

## Example: Default

```tsx
<Progress value={65} />
```

## Example: Tones

```tsx
<div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
  <Progress value={80} tone="info" />
  <Progress value={60} tone="success" />
  <Progress value={45} tone="warning" />
  <Progress value={30} tone="danger" />
</div>
```

## Example: Animated

```tsx
<Progress value={40} animated tone="info" />
```
