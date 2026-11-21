# Funnel

Drop-off through ordered steps, with conversion from the first step.

- Package: `@nexub/react` · Category: Data Display · Status: beta
- Import: `import { Funnel } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/funnel

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` (required) | `{ label: string; value: number }[]` |  | Steps in order, largest first. |
| `title` (required) | `string` |  | Accessible name and table caption. |
| `data[].values` | `Record<string, number>` |  | 11.3: the other series' numbers for this step, keyed by series key. |
| `series` | `{ key: string; label?: string; color?: ChartColor }[]` |  | 11.3: several series per step, drawn as thin bars with a legend. `key: 'value'` reads each step's `value`; other keys read `values[key]`. The interactive tooltip uses `value`. |
| `show` | `'conversion' \| 'drop-off' \| 'both'` |  | 11.3: visible numbers under each step: share of the first and the previous step, how many dropped off, or both. Unset draws the bars only. |
| `tableView` | `boolean \| string` |  | 11.3: a "Show as table" disclosure under the drawing with the same data; a string sets its label. |

## Example: Signup funnel

```tsx
import { Funnel } from '@nexub/react';

export default function Example() {
  return (
    <Funnel
      className="w-full"
      title="Signup funnel, October"
      data={[{ label: 'Visited', value: 12400 }, { label: 'Started signup', value: 4100 }, { label: 'Verified email', value: 2900 }, { label: 'First payment', value: 1240 }]}
    />
  );
}
```

## Example: Conversion and drop-off

`show="both"` with `tableView`.

```tsx
import { Funnel } from '@nexub/react';

export default function Example() {
  return (
    <Funnel
      className="w-full"
      title="Signup funnel, October"
      show="both"
      tableView
      data={[{ label: 'Visited', value: 12400 }, { label: 'Started signup', value: 4100 }, { label: 'Verified email', value: 2900 }, { label: 'First payment', value: 1240 }]}
    />
  );
}
```

## Example: Several series

Web and app side by side, with conversion.

```tsx
import { Funnel } from '@nexub/react';

export default function Example() {
  return (
    <Funnel
      className="w-full"
      title="Signup funnel by channel"
      show="conversion"
      series={[{ key: 'value', label: 'Web' }, { key: 'app', label: 'App', color: 3 }]}
      data={[
        { label: 'Visited', value: 12400, values: { app: 8200 } },
        { label: 'Started signup', value: 4100, values: { app: 3900 } },
        { label: 'First payment', value: 1240, values: { app: 1500 } },
      ]}
    />
  );
}
```

## Accessibility

- The drawing is hidden from assistive tech; a visually hidden table or caption carries every value.

Related: [bar-chart](bar-chart.md), [line-chart](line-chart.md)
