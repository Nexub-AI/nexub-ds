# Date Time Picker

A DatePicker and a TimePicker that edit one Date, with an optional time-zone label.

- Package: `@nexub/react` · Category: Form & Input · Status: beta
- Import: `import { DateTimePicker } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/date-time-picker

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value / onValueChange` | `Date \| undefined` |  | Date and time in the reader’s local time. |
| `defaultTime` | `string` | `'09:00'` | Time used when the date is picked first. |
| `minuteStep` | `number` |  | Passed to the TimePicker. |
| `minDate / maxDate` | `Date` |  | Limits the calendar. |
| `timeZone` | `string` |  | IANA zone named next to the fields, e.g. "Time zone: GMT+8 (Asia/Singapore)". Label only. |
| `aria-label` | `string` |  | Names the group; the parts read "Date" and "Time". |

## Example: Meeting start

```tsx
'use client';

import * as React from 'react';
import { DateTimePicker } from '@nexub/react';

export default function Example() {
  const [starts, setStarts] = React.useState<Date | undefined>();
  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <DateTimePicker aria-label="Meeting starts" value={starts} onValueChange={setStarts} minuteStep={15} timeZone="Asia/Singapore" />
      <p className="text-body-sm text-[var(--color-on-surface-muted)]">{starts ? starts.toString() : 'Pick a date first; the time defaults to 09:00.'}</p>
    </div>
  );
}
```

## Accessibility

- A labelled group holding the DatePicker button and the native time input.

Related: [date-picker](date-picker.md), [time-picker](time-picker.md)
