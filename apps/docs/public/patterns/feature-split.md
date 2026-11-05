# FeatureSplit

Text and a check list beside a visual; `reverse` swaps the sides on wide screens. Server component.

- Package: `@nexub/marketing` · Category: Marketing · Status: beta
- Import: `import { FeatureSplit } from '@nexub/marketing';`
- Docs: https://nexub-ds-docs.pages.dev/patterns/feature-split

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` (required) | `React.ReactNode` |  | The heading (h2). |
| `visual` (required) | `React.ReactNode` |  | Screenshot or illustration. |
| `eyebrow` | `React.ReactNode` |  | A string becomes a gradient EyebrowChip. |
| `description` | `React.ReactNode` |  | Body copy. |
| `points` | `string[]` |  | Benefit lines, shown as a check list. |
| `actions` | `React.ReactNode` |  | Buttons. |
| `reverse` | `boolean` | `false` | Visual on the left on wide screens. |

## Example: Default

```tsx
import { Card } from '@nexub/react';
import { FeatureSplit } from '@nexub/marketing';

export default function Example() {
  return (
    <div data-mode="marketing" className="w-full">
      <FeatureSplit
        eyebrow="Payroll"
        title="Pay your team on time, every time"
        description="Run payroll in minutes with tax and statutory filings handled for you."
        points={['CPF, EPF and BPJS filed for you', 'Payslips in every employee’s language', 'Approvals on your phone']}
        visual={<Card variant="showcase" accent="payub" className="aspect-[4/3] w-full" aria-label="Payroll screenshot" />}
      />
    </div>
  );
}
```
