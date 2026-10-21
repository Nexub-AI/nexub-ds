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
| `easing` | `'linear' \| 'in' \| 'out' \| 'in-out' \| 'out-expo' \| 'spring'` | `'out'` | Easing curve applied to the animation. |
| `unmountOnExit` | `boolean` | `false` | Removes the element from the DOM after the exit animation completes. |
| `as` | `React.ElementType` | `'div'` | The HTML element or component to render as the wrapper. |
| `children` (required) | `React.ReactNode` |  | Content to animate. |

## Example: Default

```tsx
<Slide in={true} direction="up">
  <Card>Slid in from bottom</Card>
</Slide>
```

## Example: Directions

```tsx
function SlideDirections() {
  const [visible, setVisible] = React.useState(true);
  const [direction, setDirection] = React.useState('up');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {['up', 'down', 'left', 'right'].map((dir) => (
          <Button
            key={dir}
            variant={direction === dir ? 'primary' : 'outline'}
            size="sm"
            onClick={() => { setDirection(dir); setVisible(true); }}
          >
            {dir}
          </Button>
        ))}
        <Button variant="ghost" size="sm" onClick={() => setVisible((v) => !v)}>
          Toggle
        </Button>
      </div>
      <Slide in={visible} direction={direction} unmountOnExit>
        <div style={{ padding: '16px', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)' }}>
          Sliding in from {direction}.
        </div>
      </Slide>
    </div>
  );
}
```
