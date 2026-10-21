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
| `easing` | `'linear' \| 'in' \| 'out' \| 'in-out' \| 'out-expo' \| 'spring'` | `'out'` | Easing curve applied to the animation. |
| `unmountOnExit` | `boolean` | `false` | Removes the element from the DOM after the exit animation completes. |
| `as` | `React.ElementType` | `'div'` | The HTML element or component to render as the wrapper. |
| `children` (required) | `React.ReactNode` |  | Content to animate. |

## Example: Default

```tsx
<Fade in={true}>
  <Card>Faded in content</Card>
</Fade>
```

## Example: Toggle

```tsx
function FadeToggle() {
  const [visible, setVisible] = React.useState(true);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Button variant="outline" onClick={() => setVisible((v) => !v)}>
        {visible ? 'Fade out' : 'Fade in'}
      </Button>
      <Fade in={visible} duration="normal" easing="out" unmountOnExit>
        <Card style={{ padding: '16px' }}>
          This content fades in and out. Toggle the button to animate it.
        </Card>
      </Fade>
    </div>
  );
}
```

## Example: Slow with spring easing

```tsx
function SlowFade() {
  const [visible, setVisible] = React.useState(true);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Button variant="outline" onClick={() => setVisible((v) => !v)}>Toggle</Button>
      <Fade in={visible} duration="slow" easing="spring">
        <div style={{ padding: '16px', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)' }}>
          Slow spring fade animation.
        </div>
      </Fade>
    </div>
  );
}
```
