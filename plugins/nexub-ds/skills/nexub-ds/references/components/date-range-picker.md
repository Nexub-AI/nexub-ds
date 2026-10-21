# Date Range Picker

Dual-calendar date range selector.

- Package: `@nexub/react` · Category: Form & Input · Status: stable
- Import: `import { DateRangePicker } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/date-range-picker

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `{ from: Date \| undefined; to: Date \| undefined }` |  | Controlled date range value. |
| `onChange` | `(range: { from: Date \| undefined; to: Date \| undefined }) => void` |  | Callback invoked when the selected range changes. |
| `placeholder` | `string` | `'Select date range'` | Placeholder text shown in the trigger input when no range is selected. |
| `disabled` | `boolean` | `false` | Disables the trigger input and calendar popover. |
| `minDate` | `Date` |  | Earliest selectable date. Dates before this are greyed out. |
| `maxDate` | `Date` |  | Latest selectable date. Dates after this are greyed out. |
| `numberOfMonths` | `number` | `2` | Number of months to display in the calendar popover. |
| `aria-label` | `string` |  | Field name for screen readers; the selected value is appended. |
| `id` | `string` |  | Id for the trigger button, e.g. to pair with a <label htmlFor>. |
| `error` | `string` |  | Error message displayed below the input. |

## Example: Default

```tsx
<DateRangePicker placeholder="Select date range…" />
```

## Example: Controlled

```tsx
function ControlledDateRangePicker() {
  const [range, setRange] = React.useState({
    from: new Date('2026-04-01'),
    to: new Date('2026-04-14'),
  });
  return (
    <DateRangePicker
      aria-label="Booking period"
      value={range}
      onChange={setRange}
      placeholder="Select date range…"
    />
  );
}
```
