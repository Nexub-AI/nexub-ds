# Slide

Slides content in from a direction based on the `in` prop.

- Package: `@nexub/react` · Category: Motion · Status: stable
- Import: `import { MotionSlide } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/motion-slide

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `in` (required) | `boolean` |  | When true, slides content in. When false, slides it out. |
| `direction` | `'up' \| 'down' \| 'left' \| 'right'` | `'up'` | The direction from which the content slides in. |
| `duration` | `'instant' \| 'fast' \| 'normal' \| 'slow' \| 'slower'` | `'normal'` | Controls the animation speed using the design token scale. |
| `unmountOnExit` | `boolean` | `false` | Removes the element from the DOM after the exit animation completes. |
| `as` | `React.ElementType` | `'div'` | The HTML element or component to render as the wrapper. |
| `children` (required) | `React.ReactNode` |  | Content to animate. |

## Example: Default

```tsx
import { Slide, Card, Text } from '@nexub/react';

export default function Example() {
  return <Slide in direction="up"><Card className="w-[200px]"><Text size="body-sm">Slid in from bottom</Text></Card></Slide>;
}
```

## Example: Directions

```tsx
import * as React from 'react';
import { Button, Slide, Card, Text } from '@nexub/react';

export default function Example() {
  const [visible, setVisible] = React.useState(true);
  return (
    <div className="flex flex-col gap-3 items-start">
      <Button variant="outlined" onClick={() => setVisible((v) => !v)}>Toggle</Button>
      <Slide in={visible} direction="up" unmountOnExit>
        <Card className="w-[200px]"><Text size="body-sm">Sliding content</Text></Card>
      </Slide>
    </div>
  );
}
```
