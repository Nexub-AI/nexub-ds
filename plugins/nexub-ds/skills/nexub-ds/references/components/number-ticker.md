# Number Ticker

A number whose digits roll to new values on the spatial spring. The first render never animates.

- Package: `@nexub/react` · Category: Data Display · Status: beta
- Import: `import { NumberTicker } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/number-ticker

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` (required) | `number \| string \| NumberTickerPart[]` |  | A number (formatted with `format` and `locale`), an already-formatted string, or styled parts. |
| `format` | `Intl.NumberFormatOptions` |  | Formatting for a number `value`. |
| `locale` | `string` |  | BCP 47 locale. Defaults to the user's. |
| `aria-live` | `'off' \| 'polite'` | `'off'` | Announce changes to screen readers. Use `polite` only for values the user is waiting on. |

## Example: Formatted number

Each digit is a 0–9 strip; separators and symbols stay still.

```tsx
import * as React from 'react';
import { NumberTicker, Button } from '@nexub/react';

export default function Example() {
  const [n, setN] = React.useState(12480);
  return (
    <div className="flex flex-col gap-3 items-center">
      <NumberTicker value={n} format={{ maximumFractionDigits: 0 }} className="text-title-lg" />
      <Button size="sm" variant="outlined" onClick={() => setN(Math.round(Math.random() * 100000))}>
        Change
      </Button>
    </div>
  );
}
```

## Example: Amount

`Amount animate` uses the ticker and keeps the quieter symbol and minor units.

```tsx
import * as React from 'react';
import { Amount, Button } from '@nexub/react';

export default function Example() {
  const [balance, setBalance] = React.useState(128450.75);
  return (
    <div className="flex flex-col gap-3 items-center">
      <Amount value={balance} currency="USD" size="display" animate />
      <Button size="sm" variant="outlined" onClick={() => setBalance(Math.round(Math.random() * 20000000) / 100)}>
        Change
      </Button>
    </div>
  );
}
```

## Accessibility

- The full value is read as one string; the rolling digits are hidden from assistive tech.
- Under reduced motion digits change instantly.

Related: [amount](amount.md), [stat-card](stat-card.md)
