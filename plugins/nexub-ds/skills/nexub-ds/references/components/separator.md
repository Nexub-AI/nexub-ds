# Separator

A horizontal or vertical visual divider.

- Package: `@nexub/react` · Category: Dividers · Status: stable
- Import: `import { Separator } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/separator

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Direction of the separator line. |
| `decorative` | `boolean` | `true` | When true, the separator is hidden from the accessibility tree. |

## Example: Default

```tsx
import { Separator } from '@nexub/react';

export default function Example() {
  return <div className="w-[280px]"><Separator /></div>;
}
```

## Example: Vertical

```tsx
import { Separator } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex h-[32px] items-center gap-4">
      <span className="text-[var(--color-on-surface-variant)] text-body-sm">Left</span>
      <Separator orientation="vertical" />
      <span className="text-[var(--color-on-surface-variant)] text-body-sm">Right</span>
    </div>
  );
}
```
