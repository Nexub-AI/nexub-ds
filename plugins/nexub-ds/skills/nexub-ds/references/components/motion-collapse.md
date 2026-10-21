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
| `easing` | `'linear' \| 'in' \| 'out' \| 'in-out' \| 'out-expo' \| 'spring'` | `'out'` | Easing curve applied to the animation. |
| `unmountOnExit` | `boolean` | `false` | Removes the element from the DOM after the collapse animation completes. |
| `as` | `React.ElementType` | `'div'` | The HTML element or component to render as the wrapper. |
| `children` (required) | `React.ReactNode` |  | Content to expand and collapse. |

## Example: Default

```tsx
<Collapse in={true}>
  <div style={{ padding: '16px', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)' }}>
    Collapsed content
  </div>
</Collapse>
```

## Example: Toggle

```tsx
function CollapseToggle() {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Button variant="outline" onClick={() => setOpen((o) => !o)}>
        {open ? 'Collapse' : 'Expand'}
      </Button>
      <Collapse in={open} unmountOnExit>
        <div
          style={{
            padding: '16px',
            background: 'var(--color-bg-subtle)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-text-secondary)',
            fontSize: '0.875rem',
          }}
        >
          This section smoothly expands and collapses along the vertical axis.
          It preserves the natural document flow by animating the block size.
        </div>
      </Collapse>
    </div>
  );
}
```
