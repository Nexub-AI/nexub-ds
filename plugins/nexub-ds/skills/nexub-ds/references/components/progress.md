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
import { Progress } from '@nexub/react';

export default function Example() {
  return <div className="w-[280px]"><Progress value={65} /></div>;
}
```

## Example: Tones

```tsx
import { Progress } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-col gap-2.5 items-start w-[280px]">
      <Progress value={80} tone="success" />
      <Progress value={55} tone="info" />
      <Progress value={30} tone="warning" />
      <Progress value={20} tone="danger" />
    </div>
  );
}
```

## Example: Animated

```tsx
import { Progress } from '@nexub/react';

export default function Example() {
  return <div className="w-[280px]"><Progress value={40} animated tone="info" /></div>;
}
```
