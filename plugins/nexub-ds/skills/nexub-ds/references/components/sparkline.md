# Sparkline

A tiny trend line with no axes, for stat cards and table cells.

- Package: `@nexub/react` · Category: Data Display · Status: beta
- Import: `import { Sparkline } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/sparkline

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `values` (required) | `number[]` |  | The points, oldest first. |
| `label` | `string` |  | Accessible summary, such as "Revenue, last 12 weeks, up 8%". Without it the sparkline is decorative. |
| `color` | `ChartColor` | `1` | Palette colour, 1–8. |
| `area` | `boolean` | `false` | Fill the area under the line. |

## Example: In a stat

```tsx
import { Sparkline } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex items-end gap-4 rounded-2xl border border-[var(--color-outline-variant)] p-4">
      <div>
        <p className="text-label-md text-[var(--color-on-surface-variant)]">Monthly revenue</p>
        <p className="text-title-lg text-[var(--color-on-surface)]">$68,420</p>
      </div>
      <Sparkline area values={[42, 48, 45, 56, 61, 68]} label="Up 62% over six months" color={2} />
    </div>
  );
}
```

## Accessibility

- The chart is a `figure` named by `title`. The drawing is hidden from assistive tech; a visually hidden table carries every value.
- Colour is never the only cue: the legend and table name each series. Past six series, label directly or group the rest as "Other".

Related: [line-chart](line-chart.md), [stat-card](stat-card.md)
