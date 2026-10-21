# Money Input

An amount field: locale-aware parsing as you type, grouped on blur, the currency symbol leading.

- Package: `@nexub/react` · Category: Form & Input · Status: beta
- Import: `import { MoneyInput } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/money-input

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `currency` (required) | `string` |  | ISO 4217 code, e.g. "EUR". |
| `locale` | `string` |  | BCP 47 locale for separators. Defaults to the user's. |
| `value / defaultValue` | `number \| null` |  | The amount, or null when empty. |
| `onValueChange` | `(value: number \| null) => void` |  | Parsed amount, rounded to the minor unit, as the person types. |

## Example: Default

```tsx
<MoneyInput aria-label="Amount to send" currency="USD" defaultValue={1250} onValueChange={setAmount} />
```

## Example: German separators

```tsx
<MoneyInput aria-label="Betrag" currency="EUR" locale="de-DE" defaultValue={1234.5} />
```

Related: [amount](amount.md), [number-input](number-input.md), [input](input.md)
