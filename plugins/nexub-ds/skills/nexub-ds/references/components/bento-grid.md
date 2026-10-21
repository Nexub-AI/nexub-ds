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
<BentoGrid>
  <BentoTile size="2x2">
    <h3 className="text-title-sm">Revenue, last 7 days</h3>
    <RevenueChart />
  </BentoTile>
  <BentoTile><StatTile label="Active users" value="12,480" /></BentoTile>
  <BentoTile><StatTile label="Conversion" value="3.2%" /></BentoTile>
  <BentoTile size="2x1">3 invoices awaiting approval.</BentoTile>
  <BentoTile><StatTile label="Churn" value="0.8%" /></BentoTile>
  <BentoTile><StatTile label="NPS" value="61" /></BentoTile>
</BentoGrid>
```

Related: [card](card.md), [stat-card](stat-card.md)
