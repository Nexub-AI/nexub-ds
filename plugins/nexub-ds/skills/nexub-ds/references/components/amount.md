# Amount

Honest money: Intl formatting, tabular numerals, the currency’s minor unit and a true minus sign.

- Package: `@nexub/react` · Category: Data Display · Status: beta
- Import: `import { Amount } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/amount

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` (required) | `number` |  | The amount. |
| `currency` (required) | `string` |  | ISO 4217 code, e.g. "USD". |
| `locale` | `string` |  | BCP 47 locale. Defaults to the user's. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'display'` | `'md'` | `display` is a hero figure with a quieter symbol and minor units. |
| `tone` | `'neutral' \| 'auto'` | `'neutral'` | `auto` colours gains success and losses error. |
| `signDisplay` | `Intl signDisplay` |  | e.g. 'exceptZero' to show + on gains. |
| `animate` | `boolean` | `false` | Roll the digits to new values (NumberTicker). The first render never animates. |

## Example: Display

```tsx
<Amount value={128450.75} currency="USD" size="display" />
```

## Example: Gains and losses

```tsx
<Amount value={312.4} currency="USD" tone="auto" signDisplay="exceptZero" />
<Amount value={-89.99} currency="USD" tone="auto" />
```

Related: [money-input](money-input.md), [number-ticker](number-ticker.md)
