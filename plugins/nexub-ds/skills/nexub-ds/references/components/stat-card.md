# StatCard

Metric display card showing a KPI value, label, optional delta, and icon.

- Package: `@nexub/patterns` · Category: Data · Status: stable
- Import: `import { StatCard } from '@nexub/patterns';`
- Docs: https://nexub-ds-docs.pages.dev/patterns/stat-card

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` |  | Metric name label. |
| `value` (required) | `React.ReactNode` |  | Primary metric value. |
| `delta` | `string` |  | Change value (e.g. "+12.5%"). |
| `deltaType` | `'increase' \| 'decrease' \| 'neutral'` |  | Semantic direction of the delta. |
| `sentiment` | `'positive' \| 'negative' \| 'neutral'` |  | Colour of the delta, independent of the arrow. Defaults from `deltaType`; use it when a decrease is good news (e.g. churn down). |
| `icon` | `React.ReactNode` |  | Icon displayed in the card header. |
| `category` | `'accent' \| 'blue' \| 'amber' \| 'emerald' \| 'pink' \| 'violet' \| 'cyan' \| 'red' \| 'lime'` |  | Puts the icon on a tinted chip of this colour and colours the trend line to match. |
| `trend` | `number[]` |  | Recent values, drawn as a small trend line beside the delta. |
| `trendLabel` | `string` |  | Accessible summary of the trend. Without it the line is decorative. |
| `description` | `string` |  | Additional context below the value. |
| `animate` | `boolean` | `false` | Roll the digits when a number or string `value` changes (NumberTicker), announced politely. The first render never animates. |
| `size` | `'md' \| 'sm'` | `'md'` | Since 11.3. `sm` is the compact tile: less padding and a smaller value. |
| `note` | `ReactNode` |  | Since 11.3. An extra line inside the tile, under the change. |
| `tone` | `'default' \| 'bad-when-high'` | `'default'` | Since 11.3. `bad-when-high` inverts the derived colour, so an increase shows the danger tone (costs, churn, errors). `sentiment` still wins. |
| `change` | `number` |  | Since 11.3. The change as a number: sets the arrow from its sign and the text from `changeFormat`. Ignored when `delta` is set. |
| `changeFormat` | `'percent' \| 'absolute' \| ((change: number) => string)` | `'percent'` | Since 11.3. `percent` takes a fraction (0.125 → +12.5%); `absolute` signs the number (−12). |
| `changeLabel` | `ReactNode` |  | Since 11.3. Text after the change, e.g. "vs last month". |

## Example: Default

```tsx
import { StatCard } from '@nexub/patterns';

export default function Example() {
  return (
    <div className="w-60">
      <StatCard label="Total Revenue" value="$48,295" delta="+12.5%" deltaType="increase" description="vs last month" />
    </div>
  );
}
```

## Example: With icon

```tsx
import { StatCard } from '@nexub/patterns';

export default function Example() {
  return (
    <div className="flex gap-3 flex-wrap items-center justify-center">
      <StatCard label="Users" value="2,841" delta="+8.3%" deltaType="increase" />
      <StatCard label="Churn" value="3.2%" delta="-0.4%" deltaType="decrease" />
    </div>
  );
}
```

## Example: Animated

```tsx
import * as React from 'react';
import { StatCard } from '@nexub/patterns';
import { Button } from '@nexub/react';

export default function Example() {
  const [orders, setOrders] = React.useState(1284);
  return (
    <div className="flex flex-col gap-3 items-stretch w-60">
      <StatCard label="Orders today" value={orders.toLocaleString('en-US')} animate />
      <Button size="sm" variant="outlined" onClick={() => setOrders((o) => o + Math.ceil(Math.random() * 40))}>
        New orders
      </Button>
    </div>
  );
}
```

## Example: Category and trend

```tsx
import { StatCard } from '@nexub/patterns';
import { Wallet } from '@nexub/icons';

export default function Example() {
  return (
    <div className="w-65">
      <StatCard
        label="Saved"
        value="S$2,400"
        delta="12%"
        deltaType="increase"
        icon={<Wallet size={16} />}
        category="emerald"
        trend={[10, 12, 13, 15, 16, 19, 22]}
        trendLabel="Last 7 weeks, rising"
      />
    </div>
  );
}
```

## Example: Compact, absolute change and bad-when-high

```tsx
import { StatCard } from '@nexub/patterns';

export default function Example() {
  return (
    <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard size="sm" label="Revenue" value="S$84,320" change={0.125} changeLabel="vs last month" />
      <StatCard size="sm" label="Cloud costs" value="S$12,400" change={0.08} tone="bad-when-high" changeLabel="vs last month" note="Includes a one-off migration" />
      <StatCard size="sm" label="Open tickets" value="42" change={-12} changeFormat="absolute" tone="bad-when-high" changeLabel="since Monday" />
    </div>
  );
}
```
