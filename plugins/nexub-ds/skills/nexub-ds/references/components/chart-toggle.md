# Chart Toggle

A legend whose entries switch series on and off, wrapped around any chart.

- Package: `@nexub/react` · Category: Data Display · Status: beta
- Import: `import { ChartToggle } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/chart-toggle

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `series` (required) | `ChartSeries[]` |  | The same series the chart takes. |
| `children` (required) | `(visible: ChartSeries[]) => ReactNode` |  | Renders the chart with the series that are on. Colours stay stable. |
| `label` | `string` | `'Series'` | Accessible name for the group of toggles. |

## Example: Toggle series

```tsx
'use client';

import { ChartToggle, LineChart } from '@nexub/react';

const data = [
  { m: 'May', web: 120, ios: 80, android: 60 },
  { m: 'Jun', web: 140, ios: 95, android: 72 },
  { m: 'Jul', web: 150, ios: 110, android: 90 },
  { m: 'Aug', web: 170, ios: 128, android: 101 },
];
const series = [{ key: 'web', label: 'Web' }, { key: 'ios', label: 'iOS' }, { key: 'android', label: 'Android' }];

export default function Example() {
  return (
    <ChartToggle series={series} className="w-full">
      {(visible) => <LineChart legend={false} title="Signups by platform" data={data} index="m" series={visible} />}
    </ChartToggle>
  );
}
```

## Accessibility

- `Tab / Space`: Move between series and switch one on or off.
- Each series is a toggle button with `aria-pressed`. The last visible series cannot be switched off.

Related: [bar-chart](bar-chart.md), [line-chart](line-chart.md)
