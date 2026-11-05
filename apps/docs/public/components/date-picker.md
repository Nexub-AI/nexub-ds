# Date Picker

Calendar date picker with text input.

- Package: `@nexub/react` · Category: Form & Input · Status: stable
- Import: `import { DatePicker } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/date-picker

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `Date \| undefined` |  | Controlled selected date value. |
| `onChange` | `(date: Date \| undefined) => void` |  | Callback invoked when the selected date changes. |
| `locale` | `Locale (date-fns)` |  | Month and weekday names, week start and the trigger format. Defaults to the NexubProvider `dateLocale`; the calendar also follows the provider `dir`, so arrows flip in RTL. |
| `placeholder` | `string` | `'Pick a date'` | Placeholder text displayed in the input when no date is selected. |
| `disabled` | `boolean` | `false` | Disables the date picker input and calendar. |
| `minDate` | `Date` |  | Earliest selectable date. Dates before this are greyed out. |
| `maxDate` | `Date` |  | Latest selectable date. Dates after this are greyed out. |
| `format` | `string` | `'dd/MM/yyyy'` | Date format string for the text input display. |
| `aria-label` | `string` |  | Field name for screen readers; the selected value is appended. |
| `id` | `string` |  | Id for the trigger button, e.g. to pair with a <label htmlFor>. |
| `error` | `string` |  | Error message displayed below the input. |

## Example: Default

```tsx
import { DatePicker } from '@nexub/react';

export default function Example() {
  return <DatePicker placeholder="Select a date…" />;
}
```

## Example: With value

```tsx
import { DatePicker } from '@nexub/react';

export default function Example() {
  return <DatePicker value={new Date('2026-01-15')} onChange={() => {}} />;
}
```

## Example: With constraints

```tsx
import { DatePicker } from '@nexub/react';

export default function Example() {
  return (
    <DatePicker
      aria-label="Schedule for"
      placeholder="Select a future date…"
      minDate={new Date()}
      maxDate={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)}
    />
  );
}
```
