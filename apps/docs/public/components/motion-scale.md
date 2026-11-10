# Scale

Scales content in/out from its center.

- Package: `@nexub/react` · Category: Motion · Status: stable
- Import: `import { MotionScale } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/motion-scale

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `in` (required) | `boolean` |  | When true, scales content in from 0 to 1. When false, scales it back down to 0. |
| `duration` | `'instant' \| 'fast' \| 'normal' \| 'slow' \| 'slower'` | `'normal'` | Controls the animation speed using the design token scale. |
| `unmountOnExit` | `boolean` | `false` | Removes the element from the DOM after the exit animation completes. |
| `as` | `React.ElementType` | `'div'` | The HTML element or component to render as the wrapper. |
| `children` (required) | `React.ReactNode` |  | Content to animate. |

## Example: Default

```tsx
import { Scale, Card, Text } from '@nexub/react';

export default function Example() {
  return <Scale in><Card className="w-[200px]"><Text size="body-sm">Scaled content</Text></Card></Scale>;
}
```

## Example: Toggle

```tsx
import * as React from 'react';
import { Button, Scale, Card, Text } from '@nexub/react';

export default function Example() {
  const [visible, setVisible] = React.useState(true);
  return (
    <div className="flex flex-col gap-3 items-start">
      <Button variant="outline" onClick={() => setVisible((v) => !v)}>Toggle</Button>
      <Scale in={visible} unmountOnExit>
        <Card className="w-[200px]"><Text size="body-sm">Scaling content</Text></Card>
      </Scale>
    </div>
  );
}
```
