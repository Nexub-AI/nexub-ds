# Scroll Area

Scrollable container with custom styled scrollbars.

- Package: `@nexub/react` · Category: Disclosure · Status: stable
- Import: `import { ScrollArea } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/scroll-area

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `'auto' \| 'always' \| 'scroll' \| 'hover'` | `'hover'` | Controls when the scrollbar is visible. "hover" shows it on mouse-over, "scroll" while scrolling, "always" always, "auto" when content overflows. |
| `scrollHideDelay` | `number` | `600` | Milliseconds before the scrollbar hides after the user stops interacting (only applies to types "scroll" and "hover"). |
| `orientation` | `'vertical' \| 'horizontal' \| 'both'` | `'vertical'` | Which axis(es) to make scrollable. |
| `className` | `string` |  | Additional CSS class names applied to the viewport wrapper. |
| `style` | `React.CSSProperties` |  | Inline styles applied to the viewport wrapper. |

## Example: Default

```tsx
<ScrollArea style={{ height: '200px', width: '280px', border: '1px solid var(--color-border-default)', borderRadius: 'var(--radius-md)', padding: '12px' }}>
  {Array.from({ length: 20 }, (_, i) => (
    <div key={i} style={{ padding: '4px 0', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
      Item {i + 1}
    </div>
  ))}
</ScrollArea>
```

## Example: Horizontal

```tsx
<ScrollArea orientation="horizontal" style={{ width: '320px', border: '1px solid var(--color-border-default)', borderRadius: 'var(--radius-md)', padding: '12px' }}>
  <div style={{ display: 'flex', gap: '8px', width: 'max-content' }}>
    {Array.from({ length: 12 }, (_, i) => (
      <div
        key={i}
        style={{
          width: '80px',
          height: '80px',
          background: 'var(--color-bg-subtle)',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.75rem',
          color: 'var(--color-text-secondary)',
          flexShrink: 0,
        }}
      >
        Card {i + 1}
      </div>
    ))}
  </div>
</ScrollArea>
```
