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
| `locale` | `Locale (date-fns)` |  | Month and weekday names, week start and the trigger format. Defaults to the NexubProvider `dateLocale`; the calendar also follows the provider `dir`, so arrows flip in RTL. |
| `placeholder` | `string` | `'Select date range'` | Placeholder text shown in the trigger input when no range is selected. |
| `disabled` | `boolean` | `false` | Disables the trigger input and calendar popover. |
| `minDate` | `Date` |  | Earliest selectable date. Dates before this are greyed out. |
| `maxDate` | `Date` |  | Latest selectable date. Dates after this are greyed out. |
| `aria-label` | `string` |  | Field name for screen readers; the selected value is appended. |
| `id` | `string` |  | Id for the trigger button, e.g. to pair with a <label htmlFor>. |
| `presets` | `boolean \| { label: string; range: (today: Date) => DateRange }[]` |  | `true` adds Today, Last 7 days, Last 30 days, Month to date and Last month beside the calendar; or pass your own (5.5). |
| `timeZone` | `string` |  | IANA zone the dates mean, e.g. `Europe/London`. Shown under the calendar; presets count "today" there (5.5). `todayIn(zone)` is exported. |
| `endExclusive` | `boolean` |  | 11.2: `to` is the day after the last day (half-open), in and out; the calendar still shows the last day. |
| `onComplete` | `(range: { from: Date; to: Date }) => void` |  | 11.2: called once both ends are set (the second day picked, or a preset). |

## Example: Default

```tsx
import { DateRangePicker } from '@nexub/react';

export default function Example() {
  return <DateRangePicker placeholder="Select date range…" />;
}
```

## Example: Controlled

```tsx
import * as React from 'react';
import { DateRangePicker } from '@nexub/react';

export default function Example() {
  const [range, setRange] = React.useState<{ from: Date | undefined; to: Date | undefined }>({
    from: new Date('2026-04-01'),
    to: new Date('2026-04-14'),
  });
  return (
    <DateRangePicker
      value={range}
      onChange={(r) => setRange({ from: r?.from, to: r?.to })}
      placeholder="Select date range…"
    />
  );
}
```

## Example: Presets and time zone

Quick ranges counted in the chosen time zone, which is labelled under the calendar.

```tsx
'use client';

import * as React from 'react';
import { DateRangePicker, type DateRange } from '@nexub/react';

export default function Example() {
  const [range, setRange] = React.useState<DateRange | undefined>();
  return (
    <div className="w-75">
      <DateRangePicker aria-label="Report period" value={range} onChange={setRange} presets timeZone="Europe/London" />
    </div>
  );
}
```

## Example: Half-open stay

endExclusive and onComplete.

```tsx
import * as React from 'react';
import { DateRangePicker, type DateRange } from '@nexub/react';

export default function Example() {
  // Stored half-open, as the booking API does: 1–3 March is { from: 1 Mar, to: 4 Mar }.
  const [stay, setStay] = React.useState<DateRange | undefined>();
  const [nights, setNights] = React.useState<number | null>(null);
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <DateRangePicker
        aria-label="Stay"
        endExclusive
        value={stay}
        onChange={setStay}
        onComplete={({ from, to }) => setNights(Math.round((to.getTime() - from.getTime()) / 86400000))}
      />
      <p className="text-body-sm text-on-surface-muted">{nights === null ? 'Pick check-in and check-out' : `${nights} nights`}</p>
    </div>
  );
}
```
