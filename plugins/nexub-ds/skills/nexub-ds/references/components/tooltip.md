# Tooltip

Floating label that appears on hover. Built on Radix UI Tooltip.

- Package: `@nexub/react` · Category: Overlays · Status: stable
- Import: `import { Tooltip } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/tooltip

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `content` (required) | `React.ReactNode` |  | Content shown inside the tooltip. |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'` | Preferred side to open. |
| `delayDuration` | `number` | `700` | Delay in ms before tooltip opens. |

## Example: Default

```tsx
<Tooltip content="This is a tooltip">
  <Button variant="outline">Hover me</Button>
</Tooltip>
```

## Example: Sides

```tsx
<div style={{ display: 'flex', gap: '12px' }}>
  <Tooltip content="Top" side="top"><Button size="sm">Top</Button></Tooltip>
  <Tooltip content="Right" side="right"><Button size="sm">Right</Button></Tooltip>
  <Tooltip content="Bottom" side="bottom"><Button size="sm">Bottom</Button></Tooltip>
  <Tooltip content="Left" side="left"><Button size="sm">Left</Button></Tooltip>
</div>
```
