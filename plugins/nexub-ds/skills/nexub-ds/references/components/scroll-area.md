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
import { ScrollArea } from '@nexub/react';

export default function Example() {
  return (
    <ScrollArea className="h-[200px] w-[280px] border border-[var(--color-outline-variant)] rounded-shape-field p-3">
      {Array.from({ length: 20 }, (_, i) => (
        <div key={i} className="py-1 px-0 text-body-sm text-[var(--color-on-surface-variant)]">
          List item {i + 1}
        </div>
      ))}
    </ScrollArea>
  );
}
```

## Example: Horizontal

```tsx
import { ScrollArea } from '@nexub/react';

export default function Example() {
  return (
    <ScrollArea orientation="horizontal" className="w-[320px] border border-[var(--color-outline-variant)] rounded-shape-field p-3">
      <div className="flex gap-2 w-max">
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="w-[80px] h-[80px] bg-[var(--color-surface-container-low)] rounded-shape-tooltip flex items-center justify-center text-label-sm text-[var(--color-on-surface-variant)] shrink-0"
          >
            Card {i + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
```
