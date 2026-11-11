# StatBand

A band of headline numbers that count up as they scroll into view. StatBandItem is named apart from the StatCard pattern. Server component.

- Package: `@nexub/marketing` · Category: Marketing · Status: beta
- Import: `import { StatBand } from '@nexub/marketing';`
- Docs: https://nexub-ds-docs.pages.dev/patterns/stat-band

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `React.ReactNode` |  | A heading above the stats. |
| `StatBandItem value` (required) | `number \| string` |  | A number counts up from zeros when it scrolls into view; the server HTML keeps the real value. |
| `StatBandItem label` (required) | `React.ReactNode` |  | What the number counts. |
| `StatBandItem prefix / suffix` | `string` |  | E.g. "$" or "+". |
| `StatBandItem tone` | `ToneValue` | `'info'` | The number's colour (accent roles, AA as large text). |
| `StatBandItem format` | `Intl.NumberFormatOptions` |  | Number formatting. |

## Example: Default

```tsx
import { StatBand, StatBandItem } from '@nexub/marketing';

export default function Example() {
  return (
    <div data-mode="marketing" className="w-full">
      <StatBand title="Teams run on Nexub">
        <StatBandItem value={2000} suffix="+" label="Companies" />
        <StatBandItem value={5} label="Countries" tone="success" />
        <StatBandItem value={98} suffix="%" label="On-time payroll" tone="payub" />
        <StatBandItem value={4.9} label="Average rating" tone="founderub" format={{ minimumFractionDigits: 1 }} />
      </StatBand>
    </div>
  );
}
```
