# Collapse

Expands and collapses content along the block axis.

- Package: `@nexub/react` · Category: Motion · Status: stable
- Import: `import { MotionCollapse } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/motion-collapse

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `in` (required) | `boolean` |  | When true, expands the content to its natural height. When false, collapses it to zero height. |
| `duration` | `'instant' \| 'fast' \| 'normal' \| 'slow' \| 'slower'` | `'normal'` | Controls the animation speed using the design token scale. |
| `unmountOnExit` | `boolean` | `false` | Removes the element from the DOM after the collapse animation completes. |
| `as` | `React.ElementType` | `'div'` | The HTML element or component to render as the wrapper. |
| `children` (required) | `React.ReactNode` |  | Content to expand and collapse. |

## Example: Default

```tsx
import { Collapse, Text } from '@nexub/react';

export default function Example() {
  return (
    <Collapse in>
      <div className="p-4 bg-[var(--color-surface-container-low)] rounded-shape-field">
        <Text size="body-sm">Collapsed content goes here.</Text>
      </div>
    </Collapse>
  );
}
```

## Example: Toggle

```tsx
import * as React from 'react';
import { Button, Collapse, Text } from '@nexub/react';

export default function Example() {
  const [visible, setVisible] = React.useState(true);
  return (
    <div className="flex flex-col gap-3 items-start">
      <Button variant="outline" onClick={() => setVisible((v) => !v)}>
        {visible ? 'Collapse' : 'Expand'}
      </Button>
      <Collapse in={visible}>
        <div className="p-4 bg-[var(--color-surface-container-low)] rounded-shape-field">
          <Text size="body-sm">This content collapses and expands smoothly.</Text>
        </div>
      </Collapse>
    </div>
  );
}
```
