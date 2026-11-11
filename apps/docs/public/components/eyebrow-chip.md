# Eyebrow Chip

A compact eyebrow label, typically used above headings.

- Package: `@nexub/react` · Category: Labels & Badges · Status: stable
- Import: `import { EyebrowChip } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/eyebrow-chip

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `tone` | `ToneValue` | `'neutral'` | Text colour. |
| `variant` | `'soft' \| 'gradient'` | `'soft'` | `gradient`: the marketing-mode chip; looks like `soft` outside `data-mode="marketing"`. |
| `live` | `boolean` | `false` | A decorative "live" dot before the label; it pings in marketing mode and stays still under reduced motion. |
| `leadingIcon` | `React.ReactNode` |  | Icon before the label. |

## Example: Default

```tsx
import { EyebrowChip } from '@nexub/react';

export default function Example() {
  return <EyebrowChip>New release</EyebrowChip>;
}
```

## Example: Usage

```tsx
import { EyebrowChip } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-col gap-2 items-start">
      <EyebrowChip>Now available</EyebrowChip>
      <h2 className="m-0 text-headline-sm font-bold text-[var(--color-on-surface)]">Version 2.0</h2>
    </div>
  );
}
```

## Example: Gradient and live (marketing mode)

Inside `data-mode="marketing"`.

```tsx
import { EyebrowChip } from '@nexub/react';

export default function Example() {
  return (
    <div data-mode="marketing" className="flex flex-wrap items-center gap-3">
      <EyebrowChip variant="gradient" tone="info">Now in Vietnam</EyebrowChip>
      <EyebrowChip variant="gradient" tone="success" live>Live</EyebrowChip>
    </div>
  );
}
```
