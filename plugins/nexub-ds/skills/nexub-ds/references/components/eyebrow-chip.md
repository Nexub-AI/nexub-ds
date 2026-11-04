# Eyebrow Chip

A compact eyebrow label, typically used above headings.

- Package: `@nexub/react` · Category: Labels & Badges · Status: stable
- Import: `import { EyebrowChip } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/eyebrow-chip

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `'sm' \| 'md'` |  | Controls chip size. |

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
      <h2 className="m-0 text-[1.5rem] font-bold text-[var(--color-on-surface)]">Version 2.0</h2>
    </div>
  );
}
```
