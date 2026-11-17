# Comparison Bar

Two values on one split bar, with the numbers always shown as text.

- Package: `@nexub/react` · Category: Data Display · Status: alpha
- Import: `import { ComparisonBar } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/comparison-bar

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` |  | What is compared. |
| `left` (required) | `{ label: string; value: number; color?: CategoryColor }` |  | The side at the inline start. |
| `right` (required) | `{ label: string; value: number; color?: CategoryColor }` |  | The side at the inline end. |
| `valueFormat` | `(value: number) => string` |  | Formats both values, on screen and in the text alternative. |
| `size` | `'sm' \| 'md'` | `'md'` | Bar height and type size. |
| `showValues` | `boolean` | `true` | The two values and the label above the bar. |
| `showLabels` | `boolean` | `true` | The two side labels under the bar. Turn off for all but one bar in a group. |
| `highlight` | `'higher' \| 'none'` | `'higher'` | The larger side takes the accent and the other is muted. A side with a `color` keeps it. |
| `aria-label` | `string` |  | Replaces the text alternative built from the props. |

## Example: Default

```tsx
import { ComparisonBar } from '@nexub/react';

export default function Example() {
  return (
    <div className="w-full max-w-sm">
      <ComparisonBar label="Goals" left={{ label: 'Team A', value: 3 }} right={{ label: 'Team B', value: 1 }} />
    </div>
  );
}
```

## Example: A group of comparisons

```tsx
import { ComparisonBar } from '@nexub/react';

const percent = (n: number) => `${n}%`;
const stats: [string, number, number, ((n: number) => string)?][] = [
  ['Possession', 58, 42, percent],
  ['Shots', 14, 9],
  ['Shots on target', 6, 6],
  ['Corners', 3, 7],
];

export default function Example() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      {stats.map(([label, a, b, format], i) => (
        <ComparisonBar
          key={label}
          label={label}
          left={{ label: 'Team A', value: a, color: 'blue' }}
          right={{ label: 'Team B', value: b, color: 'amber' }}
          valueFormat={format}
          showLabels={i === stats.length - 1}
        />
      ))}
    </div>
  );
}
```

Related: [progress](progress.md), [description-list](description-list.md)
