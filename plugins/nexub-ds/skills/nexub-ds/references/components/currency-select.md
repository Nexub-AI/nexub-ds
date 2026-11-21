# Currency Select

A searchable ISO 4217 currency picker built from Intl: code, name and symbol. Also sits next to a MoneyInput.

- Package: `@nexub/react` · Category: Form Controls · Status: alpha
- Import: `import { CurrencySelect } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/currency-select

## When to use

- Picking the currency of a price, an invoice or an account.
- Letting people change the currency next to an amount (`MoneyInput currencySlot`).

## When not to use

- Two or three fixed currencies: use SegmentedControl or Select.
- Showing an amount: use Amount.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value / defaultValue` | `string \| null` |  | The ISO 4217 code, e.g. `"USD"`. |
| `onValueChange` | `(code: string \| null) => void` |  | Called with the picked code. |
| `currencies` | `string[]` |  | Only these codes, in this order. Default: every code the browser knows (`Intl.supportedValuesOf`). |
| `priority / priorityLabel / restLabel` | `string[] / string / string` |  | Codes listed first; with `priorityLabel`, under that heading and the rest under `restLabel`. |
| `locale` | `string` |  | BCP 47 locale for names and symbols. Defaults to the user's. |
| `name` | `string` |  | A hidden input posts the code with a plain form. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height of the field. |
| `sheet` | `boolean \| 'auto'` | `'auto'` | The list as a bottom sheet below 768px. |

## Example: Default

```tsx
import * as React from 'react';
import { CurrencySelect } from '@nexub/react';

export default function Example() {
  const [currency, setCurrency] = React.useState<string | null>('EUR');
  return (
    <div className="w-full max-w-xs">
      <CurrencySelect aria-label="Currency" value={currency} onValueChange={setCurrency} />
    </div>
  );
}
```

## Example: Labelled field

`CurrencyField` adds `label`, `description` and `error`, as ComboboxField.

```tsx
import * as React from 'react';
import { CurrencyField } from '@nexub/react';

export default function Example() {
  const [currency, setCurrency] = React.useState<string | null>('USD');
  return (
    <div className="w-full max-w-sm">
      <CurrencyField
        label="Billing currency"
        description="Invoices are issued in this currency"
        priority={['USD', 'EUR', 'GBP', 'MYR', 'SGD']}
        priorityLabel="Common"
        restLabel="All currencies"
        value={currency}
        onValueChange={setCurrency}
      />
    </div>
  );
}
```

## Example: Next to an amount

MoneyInput `currencySlot` puts the picker before the amount.

```tsx
import * as React from 'react';
import { CurrencySelect, MoneyInput } from '@nexub/react';

export default function Example() {
  const [currency, setCurrency] = React.useState('EUR');
  const [amount, setAmount] = React.useState<number | null>(1250);
  return (
    <div className="w-full max-w-md">
      <MoneyInput
        aria-label="Amount"
        currency={currency}
        value={amount}
        onValueChange={setAmount}
        currencySlot={<CurrencySelect aria-label="Currency" value={currency} onValueChange={(c) => c && setCurrency(c)} />}
      />
    </div>
  );
}
```

## Accessibility

- `Enter / Space / Arrow Down`: Opens the list with focus in the search box.
- `Type`: Finds by code, name or symbol.
- `Enter`: Picks the highlighted currency.
- Built on ComboboxField: the trigger is a `combobox` named by the label.
- `currencyOptions(locale)` returns the same list for your own ComboboxField.

Related: [combobox-field](combobox-field.md), [money-input](money-input.md), [amount](amount.md)
