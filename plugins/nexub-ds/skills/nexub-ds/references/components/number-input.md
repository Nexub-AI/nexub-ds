# Number Input

A numeric input with optional steppers. Limits apply when the field loses focus; `nullable` lets it be empty.

- Package: `@nexub/react` · Category: Form & Input · Status: stable
- Import: `import { NumberInput } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/number-input

## When to use

- A quantity people type or step: seats, limits, percentages.
- A value that may be empty (`nullable`) and must stay inside `min` and `max`.

## When not to use

- On a page without React (server-rendered HTML, a plain `<form>`): use `<nx-number-input>` from `@nexub/elements`, the same rules as a web component.
- Money: use MoneyInput. Phone numbers and codes: use a text input.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number \| null` |  | Controlled value. `null` (with `nullable`) shows an empty field. |
| `nullable` | `boolean` | `false` | The field can be empty: clearing it reports `null`, not 0, and a half-typed `2.` or `-` stays while focused. |
| `onValueChange` | `(value: number) => void \| (value: number \| null) => void` |  | Called while typing (not yet clamped) and with the clamped value on blur, steppers and arrow keys. With `nullable`, `null` when cleared. |
| `min` | `number` |  | Lowest value, applied on blur, steppers and arrow keys (never mid-typing, so 30 can be typed with a minimum of 15). |
| `max` | `number` |  | Highest value, applied the same way. |
| `step` | `number \| 'any'` | `1` | Increment for steppers and arrow keys. `'any'` allows any decimal (steppers then move by 1). |
| `disabled` | `boolean` |  | Disables the input and its controls. |
| `size` | `'sm' \| 'md' \| 'lg'` |  | Controls font size and padding. |

## Example: Default

```tsx
import { NumberInput } from '@nexub/react';

export default function Example() {
  return <div className="w-45"><NumberInput defaultValue={0} /></div>;
}
```

## Example: With range

```tsx
import { NumberInput } from '@nexub/react';

export default function Example() {
  return <div className="w-45"><NumberInput defaultValue={5} min={0} max={10} /></div>;
}
```

## Example: Can be empty

`nullable`: cleared means null. The limits apply on blur.

```tsx
import * as React from 'react';
import { NumberInput } from '@nexub/react';

export default function Example() {
  const [value, setValue] = React.useState<number | null>(null);
  return (
    <div className="flex w-56 flex-col gap-2">
      <NumberInput nullable aria-label="Seat limit" placeholder="No limit" min={15} max={500} step="any" showSteppers value={value} onValueChange={setValue} />
      <span className="text-body-sm text-on-surface-muted">{value === null ? 'No limit (null)' : `${value} seats`}</span>
    </div>
  );
}
```

Related: [number-input-element](number-input-element.md), [money-input](money-input.md), [slider](slider.md)
