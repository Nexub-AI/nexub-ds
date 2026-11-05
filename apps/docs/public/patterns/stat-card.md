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
| `description` | `string` |  | Additional context below the value. |
| `animate` | `boolean` | `false` | Roll the digits when a number or string `value` changes (NumberTicker), announced politely. The first render never animates. |

## Example: Default

```tsx
import { StatCard } from '@nexub/patterns';

export default function Example() {
  return (
    <div className="w-[240px]">
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
    <div className="flex flex-col gap-3 items-stretch w-[240px]">
      <StatCard label="Orders today" value={orders.toLocaleString('en-US')} animate />
      <Button size="sm" variant="outlined" onClick={() => setOrders((o) => o + Math.ceil(Math.random() * 40))}>
        New orders
      </Button>
    </div>
  );
}
```
