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
import { Select } from '@nexub/react';

export default function Example() {
  return (
    <div className="w-[220px]">
      <Select.Root>
        <Select.Trigger><Select.Value placeholder="Select an option…" /></Select.Trigger>
        <Select.Content>
          <Select.Item value="option-1">Option 1</Select.Item>
          <Select.Item value="option-2">Option 2</Select.Item>
          <Select.Item value="option-3">Option 3</Select.Item>
        </Select.Content>
      </Select.Root>
    </div>
  );
}
```

## Example: Sizes and read-only

size on Select.Trigger matches Input. A readOnly trigger keeps its value readable and does not open.

```tsx
import { Select } from '@nexub/react';

const sizes = ['sm', 'md', 'lg'] as const;

export default function Example() {
  return (
    <div className="flex w-56 flex-col gap-3">
      {sizes.map((size) => (
        <Select.Root key={size}>
          <Select.Trigger size={size} aria-label={`Size ${size}`}><Select.Value placeholder={`Size ${size}`} /></Select.Trigger>
          <Select.Content>
            <Select.Item value="inr">INR</Select.Item>
            <Select.Item value="usd">USD</Select.Item>
          </Select.Content>
        </Select.Root>
      ))}
      <Select.Root defaultValue="inr">
        <Select.Trigger readOnly aria-label="Currency"><Select.Value /></Select.Trigger>
        <Select.Content>
          <Select.Item value="inr">INR (read-only)</Select.Item>
          <Select.Item value="usd">USD</Select.Item>
        </Select.Content>
      </Select.Root>
    </div>
  );
}
```
