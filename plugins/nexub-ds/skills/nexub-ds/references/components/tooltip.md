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
import { TooltipProvider, Tooltip, Button } from '@nexub/react';

export default function Example() {
  return (
    <TooltipProvider>
      <Tooltip label="This is a tooltip" side="top">
        <Button variant="outlined">Hover me</Button>
      </Tooltip>
    </TooltipProvider>
  );
}
```

## Example: Sides

```tsx
import { TooltipProvider, Tooltip, Button } from '@nexub/react';

export default function Example() {
  return (
    <TooltipProvider>
      <Tooltip label="This is a tooltip" side="top">
        <Button variant="outlined">Hover me</Button>
      </Tooltip>
    </TooltipProvider>
  );
}
```
