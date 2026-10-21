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
<SegmentedControl.Root defaultValue="month">
  <SegmentedControl.Item value="day">Day</SegmentedControl.Item>
  <SegmentedControl.Item value="week">Week</SegmentedControl.Item>
  <SegmentedControl.Item value="month">Month</SegmentedControl.Item>
</SegmentedControl.Root>
```

## Example: Sizes

```tsx
<div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
  <SegmentedControl.Root defaultValue="b" size="sm">
    <SegmentedControl.Item value="a">Small A</SegmentedControl.Item>
    <SegmentedControl.Item value="b">Small B</SegmentedControl.Item>
  </SegmentedControl.Root>
  <SegmentedControl.Root defaultValue="b" size="md">
    <SegmentedControl.Item value="a">Medium A</SegmentedControl.Item>
    <SegmentedControl.Item value="b">Medium B</SegmentedControl.Item>
  </SegmentedControl.Root>
  <SegmentedControl.Root defaultValue="b" size="lg">
    <SegmentedControl.Item value="a">Large A</SegmentedControl.Item>
    <SegmentedControl.Item value="b">Large B</SegmentedControl.Item>
  </SegmentedControl.Root>
</div>
```
