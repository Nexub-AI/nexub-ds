# Aurora

A decorative background of slow-drifting colour fields from the accent roles. Subtle by default, richer under data-expression="vivid".

- Package: `@nexub/react` · Category: Inline Primitives · Status: beta
- Import: `import { Aurora } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/aurora

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` |  | Shape it to its container, e.g. `rounded-shape-container`. The parent needs `position: relative` and `isolate` so the aurora stays behind the content. |

## Example: Behind a hero

```tsx
import { Aurora, Button, EyebrowChip } from '@nexub/react';

export default function Example() {
  return (
    <div className="relative isolate flex w-full flex-col items-center gap-4 overflow-hidden rounded-shape-container px-6 py-14 text-center">
      <Aurora />
      <EyebrowChip>New</EyebrowChip>
      <h3 className="m-0 text-headline-md text-[var(--color-on-surface)]">Your money, at a glance</h3>
      <p className="m-0 max-w-[40ch] text-body-md text-[var(--color-on-surface)]">The colour follows your brand, theme and dark mode.</p>
      <Button>Get started</Button>
    </div>
  );
}
```

## Accessibility

- Decorative: the whole layer is `aria-hidden`.
- The fields stop drifting under reduced motion and the layer is hidden in forced-colours mode.

Related: [text-gradient](text-gradient.md)
