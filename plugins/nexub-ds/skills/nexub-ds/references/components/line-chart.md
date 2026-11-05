# Line Chart

Show a trend over ordered categories such as time. Server-rendered SVG on the chart palette.

- Package: `@nexub/react` · Category: Data Display · Status: beta
- Import: `import { LineChart } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/line-chart

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
| `area` | `boolean` | `false` | Fill the area under each line. |

## Example: Two series

```tsx
import { LineChart } from '@nexub/react';

const data = [
  { week: 'W1', active: 820, trial: 310 },
  { week: 'W2', active: 870, trial: 290 },
  { week: 'W3', active: 905, trial: 340 },
  { week: 'W4', active: 960, trial: 330 },
  { week: 'W5', active: 1010, trial: 360 },
  { week: 'W6', active: 1080, trial: 355 },
];

export default function Example() {
  return (
    <LineChart
      className="w-full"
      title="Weekly users"
      data={data}
      index="week"
      series={[{ key: 'active', label: 'Active' }, { key: 'trial', label: 'Trial' }]}
    />
  );
}
```

## Example: Area

```tsx
import { LineChart } from '@nexub/react';

const data = [
  { day: 'Mon', p95: 210 },
  { day: 'Tue', p95: 190 },
  { day: 'Wed', p95: 240 },
  { day: 'Thu', p95: 205 },
  { day: 'Fri', p95: 180 },
];

export default function Example() {
  return (
    <LineChart
      area
      size="sm"
      className="w-full"
      title="API latency, p95"
      data={data}
      index="day"
      series={[{ key: 'p95', label: 'p95 latency', color: 6 }]}
      valueFormat={(v) => `${v} ms`}
    />
  );
}
```

## Accessibility

- The chart is a `figure` named by `title`. The drawing is hidden from assistive tech; a visually hidden table carries every value.
- Colour is never the only cue: the legend and table name each series. Past six series, label directly or group the rest as "Other".

Related: [bar-chart](bar-chart.md), [sparkline](sparkline.md)
