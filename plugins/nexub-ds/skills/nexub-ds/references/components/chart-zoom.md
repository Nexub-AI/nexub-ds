# Chart Zoom

Zoom any chart to part of its range with a two-thumb slider.

- Package: `@nexub/react` · Category: Data Display · Status: beta
- Import: `import { ChartZoom } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/chart-zoom

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` (required) | `T[]` |  | The full data. |
| `index` (required) | `keyof T` |  | The category key; its values label the range. |
| `children` (required) | `(slice: T[]) => ReactNode` |  | Render the chart for the visible slice. |
| `defaultRange` | `[start, end]` |  | Starting indexes; the whole range by default. |
| `minSpan` | `number` | `2` | Fewest categories shown. |

## Example: Zoom a year of revenue

```tsx
'use client';

import { ChartZoom, LineChart } from '@nexub/react';

const data = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => ({
  month,
  revenue: 120 + i * 14 + (i % 3) * 9,
}));

export default function Example() {
  return (
    <ChartZoom data={data} index="month" defaultRange={[3, 8]} className="w-full">
      {(slice) => (
        <LineChart className="w-full" title="Revenue ($k)" data={slice} index="month" series={[{ key: 'revenue', label: 'Revenue' }]} />
      )}
    </ChartZoom>
  );
}
```

## Accessibility

- `Arrow keys / Home / End`: Move the focused thumb.
- Thumbs read "Zoom start: Mar" and "Zoom end: Sep". Charts themselves stay server components; only this wrapper runs on the client.

Related: [line-chart](line-chart.md), [bar-chart](bar-chart.md), [chart-toggle](chart-toggle.md)
