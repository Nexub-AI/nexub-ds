# Donut Chart

Parts of a whole, with an optional total in the hole. Keep it to six slices or fewer.

- Package: `@nexub/react` · Category: Data Display · Status: beta
- Import: `import { DonutChart } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/donut-chart

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` (required) | `string` |  | Accessible name of the chart. |
| `data` (required) | `{ label: string; value: number; color?: ChartColor }[]` |  | One entry per slice. |
| `center` | `ReactNode` |  | Content in the hole, such as the total. |
| `valueFormat` | `(value: number) => string` |  | Formats the hover text and the data table. |
| `legend` | `boolean` | `true` | Show the legend beside the donut. |
| `maxSlices / otherLabel` | `number / string` |  | 11.3: group the smallest slices into one "Other". |
| `legendValues` | `boolean` |  | 11.3: value and share on each legend row. |
| `data[].href` | `string` |  | 11.3: makes the slice's legend row a link. |
| `data[].color` | `1–8 \| 'good' \| 'warning' \| 'danger' \| 'neutral'` |  | 11.3: a palette colour or a tone. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 11.3: diameter. |
| `tableView` | `boolean \| string` |  | 11.3: a visible "Show as table" disclosure. |

## Example: With total

```tsx
import { DonutChart } from '@nexub/react';

const plans = [
  { label: 'Pro', value: 540 },
  { label: 'Team', value: 310 },
  { label: 'Starter', value: 220 },
  { label: 'Free', value: 130 },
];

export default function Example() {
  return (
    <DonutChart
      title="Customers by plan"
      data={plans}
      center={
        <span>
          1,200
          <br />
          <span className="text-label-sm text-on-surface-muted">customers</span>
        </span>
      }
    />
  );
}
```

## Example: Other, legend values and links

```tsx
import { DonutChart } from '@nexub/react';

const plans = [
  { label: 'Enterprise', value: 42, href: '#enterprise' },
  { label: 'Team', value: 31, href: '#team' },
  { label: 'Starter', value: 15 },
  { label: 'Education', value: 6 },
  { label: 'Nonprofit', value: 4 },
  { label: 'Trial', value: 2 },
];

export default function Example() {
  return <DonutChart title="Plans" size="lg" legendValues maxSlices={4} data={plans} center="100" tableView />;
}
```

## Accessibility

- The chart is a `figure` named by `title`. The drawing is hidden from assistive tech; a visually hidden table carries every value.
- Colour is never the only cue: the legend and table name each series. Past six series, label directly or group the rest as "Other".

Related: [bar-chart](bar-chart.md)
