# Heatmap

Intensity over a grid, such as activity by weekday and week, in seven sequential steps.

- Package: `@nexub/react` · Category: Data Display · Status: beta
- Import: `import { Heatmap } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/heatmap

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` (required) | `(number \| null)[][]` |  | Rows of values. 11.3: a missing cell (`null`, `undefined` or a hole) is drawn hatched, listed as "—" and left out of the colour range. |
| `rowLabels` (required) | `string[]` |  | One label per row. |
| `columnLabels` | `string[]` |  | Used in the hover text. |
| `title` (required) | `string` |  | Accessible name and table caption. |
| `legend` | `boolean` |  | 11.3: a low → high scale under the grid with the min and max values, plus a "No data" swatch when cells are missing. |
| `tableView` | `boolean \| string` |  | 11.3: a "Show as table" disclosure under the drawing with the same data; a string sets its label. |

## Example: Weekly activity

```tsx
import { Heatmap } from '@nexub/react';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const data = days.map((_, d) => Array.from({ length: 16 }, (_, w) => ((d * 7 + w * 3) % 11) + (w > 10 ? 4 : 0)));

export default function Example() {
  return <Heatmap className="w-full" title="Payments sent per day, last 16 weeks" rowLabels={days} data={data} />;
}
```

## Example: Missing cells and legend

`null` cells are hatched; `legend` shows the scale.

```tsx
import { Heatmap } from '@nexub/react';

export default function Example() {
  return (
    <Heatmap
      className="w-full max-w-md"
      title="Deploys by day and week"
      legend
      tableView
      rowLabels={['Mon', 'Wed', 'Fri']}
      columnLabels={['W1', 'W2', 'W3', 'W4', 'W5', 'W6']}
      data={[[2, 5, null, 3, 9, 4], [6, 1, 7, 10, null, 5], [3, 8, 4, 6, 1, null]]}
    />
  );
}
```

## Accessibility

- The drawing is hidden from assistive tech; a visually hidden table or caption carries every value.

Related: [bar-chart](bar-chart.md), [line-chart](line-chart.md)
