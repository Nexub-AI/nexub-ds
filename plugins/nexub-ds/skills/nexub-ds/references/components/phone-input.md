# Phone Input

A phone field with a country picker. Groups the number as you type and reports it in E.164.

- Package: `@nexub/react` · Category: Form Controls · Status: alpha
- Import: `import { PhoneInput } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/phone-input

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value / defaultValue` | `string` |  | The number in E.164 ("+919847012345"), or an empty string. |
| `onValueChange` | `(e164: string, details: { country: string; national: string; valid: boolean }) => void` |  | Called on every change. `valid` is a length check for the country, not proof the number exists. |
| `defaultCountry` | `string` |  | ISO 3166-1 alpha-2 code to start on. Defaults to the region of the provider locale, else `US`. |
| `country / onCountryChange` | `string` |  | Controls the selected country. |
| `countries` | `string[]` |  | Limits the picker to these countries, in this order. With one entry the picker becomes text. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height of the field. |
| `invalid / disabled` | `boolean` |  | Field states, with `readOnly` and `required`. Inside `FormField.Control` they come from the field. |
| `name` | `string` |  | Submits the E.164 value with a form. |
| `sheet` | `boolean \| 'auto'` | `false` | Shows the country list as a bottom sheet; `'auto'` only on phones. |

## Example: Default

```tsx
import * as React from 'react';
import { PhoneInput } from '@nexub/react';

export default function Example() {
  const [value, setValue] = React.useState('');
  const [valid, setValid] = React.useState(false);
  return (
    <div className="flex w-80 max-w-full flex-col gap-2">
      <PhoneInput
        aria-label="Phone number"
        defaultCountry="IN"
        value={value}
        onValueChange={(e164, details) => {
          setValue(e164);
          setValid(details.valid);
        }}
      />
      <p aria-live="polite" className="text-body-sm text-[var(--color-on-surface-muted)]">
        {value ? `${value}${valid ? '' : ' (incomplete)'}` : 'Type a number, or paste one with its country code'}
      </p>
    </div>
  );
}
```

## Example: Restricted countries in a form field

```tsx
import * as React from 'react';
import { FormField, PhoneInput } from '@nexub/react';

export default function Example() {
  const [valid, setValid] = React.useState(true);
  return (
    <FormField.Root name="mobile" required invalid={!valid} className="w-80 max-w-full">
      <FormField.Label>Mobile number</FormField.Label>
      <FormField.Control>
        <PhoneInput countries={['IN', 'AE', 'SA', 'QA']} sheet="auto" onValueChange={(e164, details) => setValid(!e164 || details.valid)} />
      </FormField.Control>
      <FormField.Description>We send a code to confirm it.</FormField.Description>
      <FormField.Error>That number looks too short or too long.</FormField.Error>
    </FormField.Root>
  );
}
```

## Accessibility

- `Tab`: Moves from the country picker to the number.
- `Enter / Space`: Opens the country list; type to filter it.
- The picker reads "Country code, India +91". The number field takes its name from the label or `aria-label`.
- Pasting a full international number picks its country and fills the rest.
- Validation is plausibility only: confirm the number on the server.

Related: [input](input.md), [select](select.md), [otp-input](otp-input.md), [form-field](form-field.md)
