# Gauge

Progress toward a target on a 270° arc.

- Package: `@nexub/react` · Category: Data Display · Status: beta
- Import: `import { Gauge } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/gauge

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` (required) | `number` |  | Current value. |
| `max` | `number` | `100` | Target. |
| `title` (required) | `string` |  | Accessible name. |
| `label` | `ReactNode` |  | Centre text; defaults to the percentage. |
| `color` | `ChartColor` | `1` | Palette colour, 1–8. |
| `tone` | `'good' \| 'warning' \| 'danger'` |  | 11.3: success, warning or error colour for the arc; wins over `color`. Pair it with a `caption` so colour is not the only signal. |
| `caption` | `ReactNode` |  | 11.3: a short line under the value, such as "41 of 50 GB" or "Over budget". Also read with the value. |

## Example: Storage used

```tsx
import { Gauge } from '@nexub/react';

export default function Example() {
  return <Gauge title="Storage used" value={68} max={100} label="68 GB" color={2} />;
}
```

## Example: Tone and caption

```tsx
import { Gauge } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-wrap justify-center gap-6">
      <Gauge title="Uptime" value={99} tone="good" caption="On target" />
      <Gauge title="Storage used" value={82} tone="warning" caption="41 of 50 GB" />
      <Gauge title="Budget spent" value={104} label="104%" tone="danger" caption="Over budget" />
    </div>
  );
}
```

## Accessibility

- The drawing is hidden from assistive tech; a visually hidden table or caption carries every value.

Related: [bar-chart](bar-chart.md), [line-chart](line-chart.md)
