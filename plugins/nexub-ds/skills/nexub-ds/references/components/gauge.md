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

## Example: Storage used

```tsx
import { Gauge } from '@nexub/react';

export default function Example() {
  return <Gauge title="Storage used" value={68} max={100} label="68 GB" color={2} />;
}
```

## Accessibility

- The drawing is hidden from assistive tech; a visually hidden table or caption carries every value.

Related: [bar-chart](bar-chart.md), [line-chart](line-chart.md)
