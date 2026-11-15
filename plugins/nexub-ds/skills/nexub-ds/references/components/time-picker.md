# Time Picker

A time field on the native time input: 12 or 24 hours from the reader’s locale, and the platform picker on phones.

- Package: `@nexub/react` · Category: Form & Input · Status: beta
- Import: `import { TimePicker } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/time-picker

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value / defaultValue / onValueChange` | `string` |  | 24-hour `"HH:mm"`, whatever the display format. |
| `minuteStep` | `number` | `1` | Minutes per step for the arrow keys and the picker. |
| `min / max / required / name` | `string \| boolean` |  | Native attributes; Form validates them. |

## Example: Reminder time

```tsx
import { FormField, TimePicker } from '@nexub/react';

export default function Example() {
  return (
    <FormField.Root name="reminder" className="w-40">
      <FormField.Label>Remind me at</FormField.Label>
      <FormField.Control>
        <TimePicker defaultValue="09:00" minuteStep={15} />
      </FormField.Control>
    </FormField.Root>
  );
}
```

## Accessibility

- `ArrowUp / ArrowDown`: Changes the focused segment (hour, minute, AM/PM).
- `ArrowLeft / ArrowRight`: Moves between segments.
- Native `<input type="time">`: screen readers announce each segment, and phones open their own time picker.

Related: [date-time-picker](date-time-picker.md), [date-picker](date-picker.md)
