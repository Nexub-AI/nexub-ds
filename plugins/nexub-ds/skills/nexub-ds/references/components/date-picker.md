# Date Picker

Calendar date picker with text input. `granularity` picks a whole month or year.

- Package: `@nexub/react` · Category: Form & Input · Status: stable
- Import: `import { DatePicker } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/date-picker

## When to use

- One date, month or year, typed or picked from a calendar.

## When not to use

- On a page without React (server-rendered HTML, a plain `<form>`): use `<nx-date-picker>` from `@nexub/elements`, the same calendar as a web component.
- A range: use DateRangePicker. A date and a time: use DateTimePicker.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `granularity` | `'day' \| 'month' \| 'year'` | `'day'` | `'month'` and `'year'` show a grid of months or years; the value is then a string, `'YYYY-MM'` or `'YYYY'`. |
| `value` | `Date \| undefined` |  | Controlled selected date value. |
| `onValueChange` | `(date: Date \| undefined) => void` |  | Called with the picked date. |
| `locale` | `Locale (date-fns)` |  | Month and weekday names, week start and the trigger format. Defaults to the NexubProvider `dateLocale`; the calendar also follows the provider `dir`, so arrows flip in RTL. |
| `placeholder` | `string` | `'Pick a date'` | Placeholder text displayed in the input when no date is selected. |
| `disabled` | `boolean` | `false` | Disables the date picker input and calendar. |
| `minDate` | `Date` |  | Earliest selectable date. Dates before this are greyed out. |
| `maxDate` | `Date` |  | Latest selectable date. Dates after this are greyed out. |
| `aria-label` | `string` |  | Field name for screen readers; the selected value is appended. |
| `id` | `string` |  | Id for the trigger button, e.g. to pair with a <label htmlFor>. |

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
  return <DatePicker value={new Date('2026-01-15')} onValueChange={() => {}} />;
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

## Example: Month and year

Pay periods and tax years: `'2026-11'` and `'2026'`.

```tsx
import * as React from 'react';
import { DatePicker } from '@nexub/react';

export default function Example() {
  const [month, setMonth] = React.useState<string | undefined>('2026-11');
  const [year, setYear] = React.useState<string | undefined>();
  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <DatePicker granularity="month" aria-label="Pay period" value={month} onValueChange={setMonth} />
      <DatePicker granularity="year" aria-label="Tax year" value={year} onValueChange={setYear} />
    </div>
  );
}
```

Related: [date-picker-element](date-picker-element.md), [date-range-picker](date-range-picker.md), [date-time-picker](date-time-picker.md)
