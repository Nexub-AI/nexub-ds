# Scroll Progress

A thin bar along the top that fills as the page scrolls. CSS only.

- Package: `@nexub/react` · Category: Motion · Status: beta
- Import: `import { ScrollProgress } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/scroll-progress

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` |  | Position or colour overrides. Defaults to the accent (the Vivid gradient under data-expression="vivid"). |

## Example: Long page

```tsx
import { ScrollProgress } from '@nexub/react';

export default function Example() {
  return (
    <div className="w-full text-body-sm text-[var(--color-on-surface-variant)]">
      <ScrollProgress />
      Scroll this page: the bar along the very top of the window fills as you read.
    </div>
  );
}
```

## Accessibility

- Decorative (`aria-hidden`); hidden under reduced motion and where scroll-driven animations are not supported.

Related: [scroll-area](scroll-area.md)
