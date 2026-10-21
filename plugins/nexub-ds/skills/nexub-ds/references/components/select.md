# Select

Accessible dropdown select built on Radix UI. Supports groups and search.

- Package: `@nexub/react` · Category: Form Controls · Status: stable
- Import: `import { Select } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/select

## When to use

- Choosing a single option from a list of 5+ items
- When screen space is limited and a dropdown collapses the options
- Selecting a region, country, currency, or other enumerated value
- Filtering or configuring a setting with predefined choices

## When not to use

- Fewer than 5 options — use RadioGroup to keep choices visible
- Searching or typing to find an option — use Combobox instead
- Multi-select — use Combobox or a checkbox list
- Boolean on/off choices — use Switch or Checkbox

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` |  | Controlled selected value. |
| `onValueChange` | `(value: string) => void` |  | Callback when value changes. |
| `placeholder` | `string` |  | Placeholder when no value selected. |
| `disabled` | `boolean` | `false` | Disables the select. |

## Example: Default

```tsx
<Select.Root>
  <Select.Trigger placeholder="Pick a fruit" />
  <Select.Content>
    <Select.Item value="apple">Apple</Select.Item>
    <Select.Item value="banana">Banana</Select.Item>
    <Select.Item value="cherry">Cherry</Select.Item>
  </Select.Content>
</Select.Root>
```
