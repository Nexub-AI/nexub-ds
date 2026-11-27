# Bar Chart

Compare values across categories, grouped or stacked. Server-rendered SVG on the chart palette.

- Package: `@nexub/react` · Category: Data Display · Status: stable
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
| `series[].color` | `1–8 \| 'good' \| 'warning' \| 'danger' \| 'neutral'` |  | 11.3: a palette colour or a semantic tone. |
| `series[].valueFormat` | `(value: number) => string` |  | 11.3: formats this series in the tooltip and table (one currency per series). |
| `integerTicks` | `boolean` |  | 11.3: gridlines on whole numbers only (counts). Also 11.3: a `null` or missing value is drawn as a gap (no bar, a break in the line) and listed as "—", not counted as 0. |
| `tableView` | `boolean \| string` |  | 11.3: a visible "Show as table" disclosure with the same data. Works without JS. |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | 11.3: categories down the side for long names and ranked lists. |
| `variant / totalKey` | `'default' \| 'waterfall' / keyof T` |  | 11.3: a waterfall of the first series from a running total; `totalKey` marks rows drawn from zero. |
| `colorOf` | `(row, series, index) => colour \| tone \| undefined` |  | 11.3: a colour per bar (e.g. over budget in danger). |
| `annotations` | `ChartAnnotation[]` |  | 12.3: labelled notes on the plot. `{ at, label }` marks one category with a dashed guide (add `series` to dot that series' value); `{ at, to, label }` shades a range. Notes on categories not in `data` are skipped. These three props apply to vertical bars. |
| `referenceLines` | `ChartReferenceLine[]` |  | 12.3: labelled straight lines. `{ value: 5000, label: 'Target' }` is horizontal and widens the axis to stay in view; `{ value: 'Mar', axis: 'category', label }` is vertical. `tone` (`good`, `warning`, `danger`, default `neutral`) colours the line only; labels stay neutral text. |
| `change` | `ChartChange` |  | 12.3: a callout above the plot, e.g. "Up 12% (+$1,200) since March": `{ from, to?, series?, invert?, locale?, label?, text? }`. The amount uses the series' `valueFormat`, then the chart's; the percentage uses `Intl` in `locale`. Rises are success, falls error (`invert` for costs and churn), no change is neutral. `text` replaces the sentence (translation). |

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

## Example: Interactive

A crosshair and tooltip, keyboard point navigation, a toggle legend and `onPointClick`.

```tsx
import * as React from 'react';
import { BarChart } from '@nexub/react';

type Row = { quarter: string; web: number; ios: number; android: number };

const data: Row[] = [
  { quarter: 'Q1', web: 120, ios: 80, android: 60 },
  { quarter: 'Q2', web: 140, ios: 95, android: 72 },
  { quarter: 'Q3', web: 150, ios: 110, android: 90 },
  { quarter: 'Q4', web: 170, ios: 128, android: 101 },
];

export default function Example() {
  const [picked, setPicked] = React.useState('Click a bar, or focus the chart and press Enter.');
  const pick = (point: { datum: Row; series?: { label?: string }; value?: number }) =>
    setPicked(`${point.datum.quarter}${point.series ? `, ${point.series.label}: ${point.value}` : ''}`);
  return (
    <div className="flex w-full flex-col gap-3">
      <BarChart
        interactive
        legend="toggle"
        onPointClick={pick}
        title="Signups by platform"
        data={data}
        index="quarter"
        series={[{ key: 'web', label: 'Web' }, { key: 'ios', label: 'iOS' }, { key: 'android', label: 'Android' }]}
      />
      <p className="m-0 text-body-sm text-on-surface-variant">{picked}</p>
    </div>
  );
}
```

## Example: Waterfall

Rises in the good tone, falls in danger, totals from zero.

```tsx
import { BarChart } from '@nexub/react';

const cash = [
  { step: 'Opening', v: 120000, total: true },
  { step: 'Sales', v: 64000, total: false },
  { step: 'Payroll', v: -52000, total: false },
  { step: 'Refunds', v: -6000, total: false },
  { step: 'Closing', v: 126000, total: true },
];
const usd = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(v);

export default function Example() {
  return <BarChart className="w-full max-w-2xl" title="Cash flow, Q3" variant="waterfall" totalKey="total" valueFormat={usd} data={cash} index="step" series={[{ key: 'v', label: 'Cash', color: 2 }]} tableView />;
}
```

## Example: Horizontal and per-bar tones

```tsx
import { BarChart } from '@nexub/react';

const products = [
  { product: 'Enterprise plan (annual)', revenue: 48200 },
  { product: 'Team plan', revenue: 31900 },
  { product: 'Starter', revenue: 12800 },
];
const spend = [
  { month: 'Jan', spend: 82 },
  { month: 'Feb', spend: 97 },
  { month: 'Mar', spend: 118 },
];

export default function Example() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-8">
      <BarChart title="Top products" orientation="horizontal" data={products} index="product" series={[{ key: 'revenue', label: 'Revenue' }]} />
      <BarChart title="Spend against a budget of 100" data={spend} index="month" series={[{ key: 'spend', label: 'Spend', color: 'good' }]} colorOf={(row) => (row.spend > 100 ? 'danger' : undefined)} />
    </div>
  );
}
```

## Example: Change and reference lines

A fall shown as good with `invert`, an average line and a vertical marker (12.3).

```tsx
import { BarChart } from '@nexub/react';

const months = [
  { month: 'Jan', cost: 5000 },
  { month: 'Feb', cost: 5200 },
  { month: 'Mar', cost: 5100 },
  { month: 'Apr', cost: 4800 },
  { month: 'May', cost: 4600 },
  { month: 'Jun', cost: 4700 },
];
const usd = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);

export default function Example() {
  return (
    <BarChart
      className="w-full max-w-2xl"
      title="Costs"
      data={months}
      index="month"
      valueFormat={usd}
      series={[{ key: 'cost', label: 'Cost', color: 2 }]}
      // Down is good for costs: `invert` shows the fall in the success colour.
      change={{ from: 'Jan', label: 'January', invert: true }}
      referenceLines={[{ value: 4900, label: 'Average' }, { value: 'Apr', axis: 'category', label: 'New supplier' }]}
    />
  );
}
```

## Accessibility

- The chart is a `figure` named by `title`. The drawing is hidden from assistive tech; a visually hidden table carries every value.
- Colour is never the only cue: the legend and table name each series. Past six series, label directly or group the rest as "Other".
- 12.3: the change callout is visible text and describes the figure (`aria-describedby`). Annotations and reference lines are drawn and also listed in a visually hidden "Chart notes" list that describes the figure too.
- 12.3: the product accent stays out of charts, notes included: guides and labels use the outline and on-surface tokens, and only the change callout and a reference line `tone` take success or error, where the colour means good or bad.

Related: [line-chart](line-chart.md), [donut-chart](donut-chart.md), [sparkline](sparkline.md)
