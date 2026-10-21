# Number Input

A numeric input with increment and decrement controls, supporting min/max clamping and step.

- Package: `@nexub/react` · Category: Form & Input · Status: stable
- Import: `import { NumberInput } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/number-input

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number` |  | Controlled value of the input. |
| `min` | `number` |  | Minimum allowed value. |
| `max` | `number` |  | Maximum allowed value. |
| `step` | `number` | `1` | Amount to increment or decrement on each step. |
| `disabled` | `boolean` |  | Disables the input and its controls. |
| `size` | `'sm' \| 'md' \| 'lg'` |  | Controls font size and padding. |

## Example: Default

```tsx
<NumberInput defaultValue={0} />
```

## Example: With range

```tsx
<NumberInput defaultValue={5} min={0} max={10} />
```
