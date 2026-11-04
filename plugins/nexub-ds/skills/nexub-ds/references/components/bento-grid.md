# Bento Grid

A grid of card tiles in mixed sizes. Responds to its own width: 1 column, 2 at 480px, 4 at 768px.

- Package: `@nexub/patterns` · Category: Layout · Status: beta
- Import: `import { BentoGrid } from '@nexub/patterns';`
- Docs: https://nexub-ds-docs.pages.dev/patterns/bento-grid

## When to use

- Overview pages where a few items deserve more room than the rest.

## When not to use

- Lists the user scans in order: dense packing can move tiles out of reading order.
- Equal-weight items: use Grid.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `BentoGrid children` (required) | `ReactNode` |  | `BentoTile`s. Dense packing back-fills gaps left by large tiles, so visual order can differ from source order. |
| `size` | `'1x1' \| '2x1' \| '1x2' \| '2x2'` | `'1x1'` | Tile span, columns × rows. Two-wide spans apply from 2 columns up. |
| `...Card props` | `CardProps` |  | A tile is a surface Card (`variant` is fixed); `tone`, `surface` and `effect` pass through. |

## Example: Dashboard

```tsx
import { BentoGrid, BentoTile } from '@nexub/patterns';

function BentoStat({ label, value }: { label: string; value: string }) {
  return (
    <BentoTile className="flex flex-col justify-between">
      <span className="text-label-md text-[var(--color-on-surface-variant)]">{label}</span>
      <span className="text-title-lg text-[var(--color-on-surface)]">{value}</span>
    </BentoTile>
  );
}

export default function Example() {
  const bars = ['40%', '65%', '50%', '80%', '72%', '90%', '60%'];
  return (
    <BentoGrid className="w-full">
      <BentoTile size="2x2" className="flex flex-col gap-3">
        <h3 className="text-title-sm text-[var(--color-on-surface)]">Revenue, last 7 days</h3>
        <div role="img" aria-label={`Bar chart: ${bars.join(', ')}`} className="flex flex-1 items-end gap-2">
          {bars.map((h, i) => (
            <div key={i} className="flex-1 rounded-shape-min bg-[var(--color-primary-container)]" style={{ height: h }} />
          ))}
        </div>
      </BentoTile>
      <BentoStat label="Active users" value="12,480" />
      <BentoStat label="Conversion" value="3.2%" />
      <BentoTile size="2x1" className="flex items-center text-body-md text-[var(--color-on-surface-variant)]">
        3 invoices awaiting approval.
      </BentoTile>
      <BentoStat label="Churn" value="0.8%" />
      <BentoStat label="NPS" value="61" />
    </BentoGrid>
  );
}
```

Related: [card](card.md), [stat-card](stat-card.md)
