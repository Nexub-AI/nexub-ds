# Separator

A horizontal or vertical visual divider.

- Package: `@nexub/react` · Category: Dividers · Status: stable
- Import: `import { Separator } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/separator

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Direction of the separator line. |

## Example: Default

```tsx
import { Separator } from '@nexub/react';

export default function Example() {
  return <div className="w-70"><Separator /></div>;
}
```

## Example: Vertical

```tsx
import { Separator } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex h-8 items-center gap-4">
      <span className="text-on-surface-variant text-body-sm">Left</span>
      <Separator orientation="vertical" />
      <span className="text-on-surface-variant text-body-sm">Right</span>
    </div>
  );
}
```
