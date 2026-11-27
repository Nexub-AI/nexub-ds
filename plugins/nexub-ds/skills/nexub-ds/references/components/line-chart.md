# Line Chart

Show a trend over ordered categories such as time. Server-rendered SVG on the chart palette.

- Package: `@nexub/react` · Category: Data Display · Status: stable
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
| `series[].color` | `1–8 \| 'good' \| 'warning' \| 'danger' \| 'neutral'` |  | 11.3: a palette colour or a semantic tone. |
| `series[].valueFormat` | `(value: number) => string` |  | 11.3: formats this series in the tooltip and table (one currency per series). |
| `integerTicks` | `boolean` |  | 11.3: gridlines on whole numbers only (counts). Also 11.3: a `null` or missing value is drawn as a gap (no bar, a break in the line) and listed as "—", not counted as 0. |
| `tableView` | `boolean \| string` |  | 11.3: a visible "Show as table" disclosure with the same data. Works without JS. |
| `annotations` | `ChartAnnotation[]` |  | 12.3: labelled notes on the plot. `{ at, label }` marks one category with a dashed guide (add `series` to dot that series' value); `{ at, to, label }` shades a range. Notes on categories not in `data` are skipped. |
| `referenceLines` | `ChartReferenceLine[]` |  | 12.3: labelled straight lines. `{ value: 5000, label: 'Target' }` is horizontal and widens the axis to stay in view; `{ value: 'Mar', axis: 'category', label }` is vertical. `tone` (`good`, `warning`, `danger`, default `neutral`) colours the line only; labels stay neutral text. |
| `change` | `ChartChange` |  | 12.3: a callout above the plot, e.g. "Up 12% (+$1,200) since March": `{ from, to?, series?, invert?, locale?, label?, text? }`. The amount uses the series' `valueFormat`, then the chart's; the percentage uses `Intl` in `locale`. Rises are success, falls error (`invert` for costs and churn), no change is neutral. `text` replaces the sentence (translation). |

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

## Example: Gaps and one currency per series

```tsx
import { LineChart } from '@nexub/react';

const months = [
  { month: 'Jan', usd: 12400, myr: 31000 },
  { month: 'Feb', usd: 13100, myr: null },
  { month: 'Mar', usd: null, myr: 35500 },
  { month: 'Apr', usd: 15800, myr: 38200 },
];
const usd = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);
const myr = (v: number) => new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR', maximumFractionDigits: 0 }).format(v);

export default function Example() {
  return (
    <LineChart
      className="w-full max-w-2xl"
      title="Revenue by currency"
      data={months}
      index="month"
      tableView
      series={[{ key: 'usd', label: 'USD', valueFormat: usd }, { key: 'myr', label: 'MYR', valueFormat: myr }]}
    />
  );
}
```

## Example: Telling a story

A change callout, a point and a range annotation, and a target line (12.3).

```tsx
import { LineChart } from '@nexub/react';

const months = [
  { month: 'Jan', revenue: 9000 },
  { month: 'Feb', revenue: 9500 },
  { month: 'Mar', revenue: 10000 },
  { month: 'Apr', revenue: 10600 },
  { month: 'May', revenue: 11200 },
  { month: 'Jun', revenue: 11800 },
];
const usd = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);

export default function Example() {
  return (
    <LineChart
      className="w-full max-w-2xl"
      title="Revenue against target"
      data={months}
      index="month"
      valueFormat={usd}
      series={[{ key: 'revenue', label: 'Revenue' }]}
      change={{ from: 'Mar', label: 'March' }}
      annotations={[{ at: 'Feb', label: 'Launch', series: 'revenue' }, { at: 'Apr', to: 'May', label: 'Spring promo' }]}
      referenceLines={[{ value: 11000, label: 'Target', tone: 'good' }]}
    />
  );
}
```

## Accessibility

- The chart is a `figure` named by `title`. The drawing is hidden from assistive tech; a visually hidden table carries every value.
- Colour is never the only cue: the legend and table name each series. Past six series, label directly or group the rest as "Other".
- 12.3: the change callout is visible text and describes the figure (`aria-describedby`). Annotations and reference lines are drawn and also listed in a visually hidden "Chart notes" list that describes the figure too.
- 12.3: the product accent stays out of charts, notes included: guides and labels use the outline and on-surface tokens, and only the change callout and a reference line `tone` take success or error, where the colour means good or bad.

Related: [bar-chart](bar-chart.md), [sparkline](sparkline.md)
