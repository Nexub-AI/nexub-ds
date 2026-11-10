# Fade

Animates opacity between 0 and 1 based on the `in` prop.

- Package: `@nexub/react` · Category: Motion · Status: stable
- Import: `import { MotionFade } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/motion-fade

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `in` (required) | `boolean` |  | When true, fades content in. When false, fades it out. |
| `duration` | `'instant' \| 'fast' \| 'normal' \| 'slow' \| 'slower'` | `'normal'` | Controls the animation speed using the design token scale. |
| `unmountOnExit` | `boolean` | `false` | Removes the element from the DOM after the exit animation completes. |
| `as` | `React.ElementType` | `'div'` | The HTML element or component to render as the wrapper. |
| `children` (required) | `React.ReactNode` |  | Content to animate. |

## Example: Default

```tsx
import { Fade, Card, Text } from '@nexub/react';

export default function Example() {
  return <Fade in><Card className="w-[200px]"><Text size="body-sm">Faded in content</Text></Card></Fade>;
}
```

## Example: Toggle

```tsx
import * as React from 'react';
import { Button, Fade, Card, Text } from '@nexub/react';

export default function Example() {
  const [visible, setVisible] = React.useState(true);
  return (
    <div className="flex flex-col gap-3 items-start">
      <Button variant="outline" onClick={() => setVisible((v) => !v)}>
        {visible ? 'Hide' : 'Show'}
      </Button>
      <Fade in={visible} unmountOnExit>
        <Card className="w-[200px]"><Text size="body-sm">Animated content</Text></Card>
      </Fade>
    </div>
  );
}
```

## Example: Slow spring

```tsx
import * as React from 'react';
import { Button, Fade, Card, Text } from '@nexub/react';

export default function Example() {
  const [visible, setVisible] = React.useState(true);
  return (
    <div className="flex flex-col gap-3 items-start">
      <Button variant="outline" onClick={() => setVisible((v) => !v)}>Toggle</Button>
      <Fade in={visible} duration="slow">
        <Card className="w-[200px]"><Text size="body-sm">Slow spring fade animation.</Text></Card>
      </Fade>
    </div>
  );
}
```
