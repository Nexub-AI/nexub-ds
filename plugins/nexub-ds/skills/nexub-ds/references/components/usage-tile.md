# Usage Tile

Used of limit: the value, the limit and a bar that warns near and at the limit.

- Package: `@nexub/react` · Category: Data Display · Status: alpha
- Import: `import { UsageTile } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/usage-tile

## When to use

- Plan limits on a billing or settings page: seats, storage, API calls.
- A dashboard tile where the limit matters as much as the number.

## When not to use

- A table cell or fact grid: use UsageBar.
- A task moving toward done: use Progress.
- A number with its change over time: use KpiTile or StatCard.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `ReactNode` |  | What is being used, e.g. "Seats". Also names the meter. |
| `used` (required) | `number \| null` |  | The amount used. `null` or undefined shows the empty state. |
| `limit` (required) | `number \| null` |  | The limit. `null` or `Infinity` shows "Unlimited" and no bar. |
| `warnAt` | `number` | `0.8` | Share of the limit that turns the bar to the warning tone. At or over the limit it is the danger tone. |
| `valueFormat` | `(value: number) => string` | `toLocaleString` | Formats the value and the limit, e.g. `(n) => `${n} GB``. |
| `note` | `ReactNode` |  | An extra line under the bar, e.g. "Resets on 1 May". |
| `action` | `ReactNode` |  | A control beside the label, e.g. an Upgrade link. |
| `loading / emptyState / errorState` | `boolean / ReactNode / ReactNode` |  | The data states, same as KpiTile: a skeleton, the empty content, or the error content in place of the value. |

## Example: Under, near and at the limit

```tsx
import { UsageTile } from '@nexub/react';

export default function Example() {
  return (
    <div className="grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
      <UsageTile label="Seats" used={12} limit={50} />
      <UsageTile label="Storage" used={8.6} limit={10} valueFormat={(n) => `${n} GB`} />
      <UsageTile label="API calls" used={100000} limit={100000} />
    </div>
  );
}
```

## Example: Unlimited, note and action

```tsx
import { Button, UsageTile } from '@nexub/react';

export default function Example() {
  return (
    <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
      <UsageTile label="Projects" used={42} limit={null} note="Included in your plan" />
      <UsageTile label="Seats" used={46} limit={50} note="Billed per seat each month" action={<Button size="sm" variant="text">Add seats</Button>} />
    </div>
  );
}
```

## Accessibility

- Roles: The bar is a `meter` named by the label, with `aria-valuetext` such as "42 of 50, 84% used".
- The level is written out ("80% used", "Limit reached"), so colour is never the only signal.

Related: [usage-bar](usage-bar.md), [kpi-tile](kpi-tile.md), [progress](progress.md), [stat-card](stat-card.md)
