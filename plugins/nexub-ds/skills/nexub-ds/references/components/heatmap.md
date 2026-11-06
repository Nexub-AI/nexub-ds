# Heatmap

Intensity over a grid, such as activity by weekday and week, in seven sequential steps.

- Package: `@nexub/react` · Category: Data Display · Status: beta
- Import: `import { Heatmap } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/heatmap

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` (required) | `number[][]` |  | Rows of values. |
| `rowLabels` (required) | `string[]` |  | One label per row. |
| `columnLabels` | `string[]` |  | Used in the hover text. |
| `title` (required) | `string` |  | Accessible name and table caption. |

## Example: Weekly activity

```tsx
import { Heatmap } from '@nexub/react';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const data = days.map((_, d) => Array.from({ length: 16 }, (_, w) => ((d * 7 + w * 3) % 11) + (w > 10 ? 4 : 0)));

export default function Example() {
  return <Heatmap className="w-full" title="Payments sent per day, last 16 weeks" rowLabels={days} data={data} />;
}
```

## Accessibility

- The drawing is hidden from assistive tech; a visually hidden table or caption carries every value.

Related: [bar-chart](bar-chart.md), [line-chart](line-chart.md)
