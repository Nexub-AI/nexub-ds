# Combobox Field

A labelled, searchable single choice that looks like a Select. For lists longer than about ten options.

- Package: `@nexub/react` · Category: Form Controls · Status: alpha
- Import: `import { ComboboxField } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/combobox-field

## When to use

- One choice from a long list: people, countries, companies, codes.
- A list the server searches (`onSearch` with `loading`).

## When not to use

- Ten options or fewer: use Select.
- Several choices: use MultiSelect.
- Free text with suggestions: use Autocomplete.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `ReactNode` |  | The field label. `ComboboxPicker` is the same control without it (name it with `aria-label`). |
| `options` (required) | `ComboboxOption[]` |  | `{ value, label, description?, keywords?, disabled?, group? }`. `description` is a second line; `keywords` and `description` are searched too; `group` lists the option under a heading. |
| `virtualizeAbove` | `number` | `100` | 12.1: with more options than this, only the rows in view render. Search (cmdk ranking), arrow keys, Home, End, Page Up/Down and screen readers (aria-setsize, aria-posinset) still cover the whole list. |
| `value / defaultValue` | `string \| null` |  | The picked value, `null` for none. |
| `onValueChange` | `(value: string \| null) => void` |  | Called with the picked value, or `null` from the none option. |
| `noneOption` | `string` |  | A first option that clears the value, e.g. "No manager". |
| `onSearch / loading` | `(text: string) => void / boolean` |  | Server search: the list is not filtered here while `onSearch` is set. |
| `selectedOption` | `ComboboxOption` |  | Labels the value when it is not in `options` (before an async search has run). |
| `description / error` | `ReactNode` |  | Help and the inline error under the field. `error` marks it invalid. |
| `name` | `string` |  | A hidden input posts the value with a plain form. Inside `Form`, also picks up the form error. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height of the field. |
| `sheet` | `boolean \| 'auto'` | `'auto'` | The list as a bottom sheet below 768px. |

## Example: Default

```tsx
import * as React from 'react';
import { ComboboxField } from '@nexub/react';

const countries = ['Australia', 'India', 'Indonesia', 'Malaysia', 'New Zealand', 'Philippines', 'Singapore', 'Thailand', 'United Kingdom', 'United States', 'Vietnam'].map((label) => ({
  value: label.toLowerCase().replace(/ /g, '-'),
  label,
}));

export default function Example() {
  const [value, setValue] = React.useState<string | null>('singapore');
  return (
    <div className="w-full max-w-sm">
      <ComboboxField label="Country" description="Where the company is registered" options={countries} value={value} onValueChange={setValue} />
    </div>
  );
}
```

## Example: Groups and a none option

```tsx
import { ComboboxField } from '@nexub/react';

const people = [
  { value: 'u1', label: 'Aisha Rahman', description: 'Finance lead', keywords: ['aisha@nexub.test'], group: 'Finance' },
  { value: 'u2', label: 'Ben Ong', description: 'Accountant', group: 'Finance' },
  { value: 'u3', label: 'Chen Wei', description: 'Account executive', group: 'Sales' },
  { value: 'u4', label: 'Dana Lee', description: 'On leave', group: 'Sales', disabled: true },
];

export default function Example() {
  return (
    <div className="w-full max-w-sm">
      <ComboboxField label="Manager" noneOption="No manager" options={people} error="Pick who approves leave" />
    </div>
  );
}
```

## Example: Server search

```tsx
import * as React from 'react';
import { ComboboxField, type ComboboxOption } from '@nexub/react';

const companies: ComboboxOption[] = ['Acme Corp', 'Apex Labs', 'Nexub Pte Ltd', 'Zeta Holdings'].map((label, i) => ({ value: `c${i}`, label }));

export default function Example() {
  const [options, setOptions] = React.useState<ComboboxOption[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [value, setValue] = React.useState<string | null>('c2');
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  return (
    <div className="w-full max-w-sm">
      <ComboboxField
        label="Company"
        options={options}
        loading={loading}
        value={value}
        onValueChange={setValue}
        selectedOption={companies.find((o) => o.value === value)}
        onSearch={(text) => {
          clearTimeout(timer.current);
          setLoading(true);
          timer.current = setTimeout(() => {
            setOptions(companies.filter((o) => o.label.toLowerCase().includes(text.toLowerCase())));
            setLoading(false);
          }, 300);
        }}
      />
    </div>
  );
}
```

## Accessibility

- `Enter / Space / Arrow Down`: Opens the list with focus in the search box.
- `Arrow Up / Arrow Down`: Moves through the options.
- `Enter`: Picks the highlighted option and closes.
- `Escape`: Closes without changing the value.
- The trigger is a `combobox` named by the label; the picked option is its text.
- Description and error are linked with `aria-describedby`.

Related: [select](select.md), [combobox](combobox.md), [autocomplete](autocomplete.md), [form-field](form-field.md)
