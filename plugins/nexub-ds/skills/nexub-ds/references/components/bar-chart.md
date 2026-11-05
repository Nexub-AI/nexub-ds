# Bar Chart

Compare values across categories, grouped or stacked. Server-rendered SVG on the chart palette.

- Package: `@nexub/react` · Category: Data Display · Status: beta
- Import: `import { BarChart } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/bar-chart

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` (required) | `string` |  | Accessible name of the chart and caption of its data table. |
| `data` (required) | `T[]` |  | One row per category, in order. |
| `index` (required) | `keyof T` |  | Key of the category label in each row (the x axis). |
| `series` (required) | `ChartSeries[]` |  | `{ key, label?, color? }` per series. `color` is 1–8 from the categorical chart palette; defaults to the series position. |
| `valueFormat` | `(value: number) => string` |  | Formats axis labels, hover text and the data table. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Plot height: 8, 12 or 16rem. |
| `legend` | `boolean` |  | Show the legend. Defaults to on for more than one series. |
| `stacked` | `boolean` | `false` | One bar per category with the series stacked. |

## Example: Grouped

```tsx
import { BarChart } from '@nexub/react';

const data = [
  { month: 'May', thisYear: 42, lastYear: 35 },
  { month: 'Jun', thisYear: 48, lastYear: 37 },
  { month: 'Jul', thisYear: 45, lastYear: 40 },
  { month: 'Aug', thisYear: 56, lastYear: 41 },
  { month: 'Sep', thisYear: 61, lastYear: 47 },
  { month: 'Oct', thisYear: 68, lastYear: 50 },
];

export default function Example() {
  return (
    <BarChart
      className="w-full"
      title="Revenue by month"
      data={data}
      index="month"
      series={[{ key: 'thisYear', label: '2026' }, { key: 'lastYear', label: '2025' }]}
      valueFormat={(v) => `$${v}k`}
    />
  );
}
```

## Example: Stacked

```tsx
import { BarChart } from '@nexub/react';

const data = [
  { quarter: 'Q1', web: 120, ios: 80, android: 60 },
  { quarter: 'Q2', web: 140, ios: 95, android: 72 },
  { quarter: 'Q3', web: 150, ios: 110, android: 90 },
  { quarter: 'Q4', web: 170, ios: 128, android: 101 },
];

export default function Example() {
  return (
    <BarChart
      stacked
      className="w-full"
      title="Signups by platform"
      data={data}
      index="quarter"
      series={[{ key: 'web', label: 'Web' }, { key: 'ios', label: 'iOS' }, { key: 'android', label: 'Android' }]}
    />
  );
}
```

## Accessibility

- The chart is a `figure` named by `title`. The drawing is hidden from assistive tech; a visually hidden table carries every value.
- Colour is never the only cue: the legend and table name each series. Past six series, label directly or group the rest as "Other".

Related: [line-chart](line-chart.md), [donut-chart](donut-chart.md), [sparkline](sparkline.md)
