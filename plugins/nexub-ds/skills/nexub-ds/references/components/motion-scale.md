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
| `easing` | `'linear' \| 'in' \| 'out' \| 'in-out' \| 'out-expo' \| 'spring'` | `'out'` | Easing curve applied to the animation. |
| `unmountOnExit` | `boolean` | `false` | Removes the element from the DOM after the exit animation completes. |
| `as` | `React.ElementType` | `'div'` | The HTML element or component to render as the wrapper. |
| `children` (required) | `React.ReactNode` |  | Content to animate. |

## Example: Default

```tsx
<Scale in={true}>
  <Card>Scaled content</Card>
</Scale>
```

## Example: Toggle

```tsx
function ScaleToggle() {
  const [visible, setVisible] = React.useState(true);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Button variant="outline" onClick={() => setVisible((v) => !v)}>
        {visible ? 'Scale out' : 'Scale in'}
      </Button>
      <Scale in={visible} duration="fast" easing="spring" unmountOnExit>
        <div
          style={{
            padding: '24px',
            background: 'var(--color-bg-subtle)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            color: 'var(--color-text-secondary)',
          }}
        >
          Pop!
        </div>
      </Scale>
    </div>
  );
}
```
