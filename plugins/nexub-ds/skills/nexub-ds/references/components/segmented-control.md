# Segmented Control

Tab-style control for mutually exclusive selections.

- Package: `@nexub/react` · Category: Interactive · Status: stable
- Import: `import { SegmentedControl } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/segmented-control

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of the segmented control. |
| `value` | `string` |  | The controlled selected value. |
| `defaultValue` | `string` |  | The initial selected value when uncontrolled. |

## Example: Default

```tsx
import { SegmentedControl } from '@nexub/react';

export default function Example() {
  return (
    <SegmentedControl.Root defaultValue="month">
      <SegmentedControl.Item value="day">Day</SegmentedControl.Item>
      <SegmentedControl.Item value="week">Week</SegmentedControl.Item>
      <SegmentedControl.Item value="month">Month</SegmentedControl.Item>
    </SegmentedControl.Root>
  );
}
```

## Example: Sizes

```tsx
import { SegmentedControl } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-col gap-3 items-start">
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <SegmentedControl.Root key={s} size={s} defaultValue="a">
          <SegmentedControl.Item value="a">A</SegmentedControl.Item>
          <SegmentedControl.Item value="b">B</SegmentedControl.Item>
          <SegmentedControl.Item value="c">C</SegmentedControl.Item>
        </SegmentedControl.Root>
      ))}
    </div>
  );
}
```
