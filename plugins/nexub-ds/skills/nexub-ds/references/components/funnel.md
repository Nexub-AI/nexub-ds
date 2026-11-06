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

## Accessibility

- The drawing is hidden from assistive tech; a visually hidden table or caption carries every value.

Related: [bar-chart](bar-chart.md), [line-chart](line-chart.md)
