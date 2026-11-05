# Reveal

Fades its content up as it scrolls into view, in marketing mode. CSS scroll-driven where supported, an IntersectionObserver elsewhere; content on screen at load, and every visitor without JS or with reduced motion, just sees it.

- Package: `@nexub/react` · Category: Motion · Status: beta
- Import: `import { MotionReveal } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/motion-reveal

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | `false` | Merge onto the child element instead of a div. |
| `children` (required) | `React.ReactNode` |  | Content to reveal. |

## Example: Default

```tsx
import { Card, Reveal } from '@nexub/react';

export default function Example() {
  return (
    <div data-mode="marketing" className="flex h-64 w-full flex-col gap-6 overflow-y-auto p-2">
      <p className="m-0 shrink-0 pb-40 text-body-md text-[var(--color-on-surface-variant)]">Scroll down</p>
      {[1, 2, 3].map((n) => (
        <Reveal key={n} className="shrink-0">
          <Card variant="showcase" className="p-6">Section {n}</Card>
        </Reveal>
      ))}
    </div>
  );
}
```
