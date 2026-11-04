# Skeleton

Placeholder loading animation that mimics content layout.

- Package: `@nexub/react` · Category: Loading States · Status: stable
- Import: `import { Skeleton } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/skeleton

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `shape` | `'line' \| 'rect' \| 'circle'` | `'line'` | Shape of the skeleton placeholder. |
| `width` | `string \| number` |  | Width of the skeleton element. |
| `height` | `string \| number` |  | Height of the skeleton element. |
| `animated` | `boolean` | `true` | Enables the shimmer animation. |

## Example: Default

```tsx
import { Skeleton } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-col gap-2 items-start w-[280px]">
      <Skeleton shape="line" width="60%" />
      <Skeleton shape="line" width="100%" />
      <Skeleton shape="line" width="80%" />
      <div className="flex gap-2 flex-nowrap items-center justify-center">
        <Skeleton shape="circle" width={40} height={40} />
        <div className="flex flex-col gap-1.5 items-start flex-1">
          <Skeleton shape="line" width="70%" />
          <Skeleton shape="line" width="50%" />
        </div>
      </div>
    </div>
  );
}
```

## Example: Shapes

```tsx
import { Skeleton } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex gap-4 flex-wrap items-center justify-center">
      <Skeleton shape="line" width={80} />
      <Skeleton shape="rect" width={80} height={40} />
      <Skeleton shape="circle" width={40} height={40} />
    </div>
  );
}
```
