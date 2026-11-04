# Radio Group

Group of mutually exclusive radio inputs.

- Package: `@nexub/react` · Category: Form Controls · Status: stable
- Import: `import { RadioGroup } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/radio-group

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `RadioGroup.Root` | `compound` |  | Root provider that manages selection state. |
| `RadioGroup.Item` | `compound` |  | Individual radio option within the group. |
| `value` | `string` |  | The controlled selected value. |
| `defaultValue` | `string` |  | The initial selected value when uncontrolled. |
| `onValueChange` | `(value: string) => void` |  | Callback fired when the selection changes. |
| `disabled` | `boolean` |  | Disables all items in the group. |
| `orientation` | `'horizontal' \| 'vertical'` |  | Layout orientation of the radio items. |

## Example: Default

```tsx
import { RadioGroup, Label } from '@nexub/react';

export default function Example() {
  return (
    <RadioGroup.Root defaultValue="monthly">
      <div className="flex flex-col gap-2 items-start">
        {['Monthly', 'Yearly', 'Lifetime'].map((opt) => (
          <div key={opt} className="flex items-center gap-2">
            <RadioGroup.Item value={opt.toLowerCase()} id={`rg-${opt}`} />
            <Label htmlFor={`rg-${opt}`}>{opt}</Label>
          </div>
        ))}
      </div>
    </RadioGroup.Root>
  );
}
```

## Example: Horizontal

```tsx
import { RadioGroup, Label } from '@nexub/react';

export default function Example() {
  return (
    <RadioGroup.Root defaultValue="monthly" orientation="horizontal">
      <div className="flex gap-4">
        {[{ value: 'monthly', label: 'Monthly' }, { value: 'annual', label: 'Annual' }].map(({ value, label }) => (
          <div key={value} className="flex items-center gap-2">
            <RadioGroup.Item value={value} id={`rgh-${value}`} />
            <Label htmlFor={`rgh-${value}`}>{label}</Label>
          </div>
        ))}
      </div>
    </RadioGroup.Root>
  );
}
```
