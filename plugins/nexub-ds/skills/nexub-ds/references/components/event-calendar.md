# Event Calendar

A month or week grid of events. Display only: your app owns the events and what a click does.

- Package: `@nexub/react` · Category: Data Display · Status: beta
- Import: `import { EventCalendar } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/event-calendar

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `events` (required) | `CalendarEvent[]` |  | `{ id, title, start, end?, allDay?, tone? }`. Events spanning days show on each day; `tone` is primary, success, warning, error or info. |
| `date / defaultDate / onDateChange` | `Date` |  | Any day in the shown month or week; Today and the arrows change it. |
| `view / defaultView / onViewChange` | `'month' \| 'week'` | `'month'` | Week shows every event; month shows `maxEventsPerDay` then "N more". |
| `onEventClick` | `(event) => void` |  | Makes events buttons. |
| `onDayClick` | `(date) => void` |  | Makes day numbers and "N more" buttons, for example to open the day. |
| `maxEventsPerDay` | `number` | `3` | Month view only. |
| `weekStartsOn` | `0–6` |  | Defaults to the locale’s first day (Monday for en-GB, Sunday for en-US). |

## Example: Team calendar

```tsx
'use client';

import * as React from 'react';
import { EventCalendar, type CalendarEvent } from '@nexub/react';

const today = new Date();
const on = (day: number, hour?: number) => new Date(today.getFullYear(), today.getMonth(), day, hour ?? 0);

const events: CalendarEvent[] = [
  { id: '1', title: 'Design review', start: on(3, 10) },
  { id: '2', title: 'Offsite', start: on(11), end: on(12), allDay: true, tone: 'success' },
  { id: '3', title: 'Standup', start: on(16, 9) },
  { id: '4', title: 'Launch', start: on(16, 14), tone: 'warning' },
  { id: '5', title: 'Retro', start: on(16, 16) },
  { id: '6', title: 'Incident review', start: on(16, 17), tone: 'error' },
];

export default function Example() {
  const [picked, setPicked] = React.useState('');
  return (
    <div className="flex w-full flex-col gap-2">
      <EventCalendar
        events={events}
        onEventClick={(e) => setPicked(e.title)}
        onDayClick={(d) => setPicked(d.toDateString())}
      />
      <p aria-live="polite" className="text-body-sm text-[var(--color-on-surface-muted)]">{picked && `Opened: ${picked}`}</p>
    </div>
  );
}
```

## Accessibility

- A table with weekday column headers; today has `aria-current="date"` and each day reads its full date.
- The title is a polite live region, so Today and the arrows announce the new month or week.

Related: [date-picker](date-picker.md), [date-time-picker](date-time-picker.md)
