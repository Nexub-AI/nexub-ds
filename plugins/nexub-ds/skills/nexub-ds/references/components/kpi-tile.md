# KPI Tile

A headline number with its change versus last period and a trend line.

- Package: `@nexub/react` · Category: Data Display · Status: beta
- Import: `import { KpiTile } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/kpi-tile

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` |  | What the number is. |
| `value` (required) | `ReactNode` |  | The formatted number. |
| `change` | `number` |  | Change as a fraction, e.g. 0.114 for +11.4%. |
| `invert` | `boolean` | `false` | Down is good (churn, costs): flips the colour. |
| `trend` | `number[]` |  | Recent values for the sparkline, oldest first. |

## Example: Dashboard row

```tsx
import { KpiTile } from '@nexub/react';

export default function Example() {
  return (
    <div className="grid w-full gap-3 sm:grid-cols-3">
      <KpiTile label="Monthly revenue" value="$68,420" change={0.114} trend={[42, 48, 45, 56, 61, 68]} />
      <KpiTile label="Customers" value="1,204" change={0.032} trend={[1080, 1100, 1150, 1170, 1190, 1204]} />
      <KpiTile label="Churn" value="2.1%" change={0.004} invert trend={[1.8, 1.9, 2.0, 1.9, 2.0, 2.1]} />
    </div>
  );
}
```

## Accessibility

- The drawing is hidden from assistive tech; a visually hidden table or caption carries every value.

Related: [bar-chart](bar-chart.md), [line-chart](line-chart.md)
