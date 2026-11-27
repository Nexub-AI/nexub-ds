# Event Calendar

A month or week grid of events. Display only: your app owns the events and what a click does.

- Package: `@nexub/react` · Category: Data Display · Status: stable
- Import: `import { EventCalendar } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/event-calendar

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `events` (required) | `CalendarEvent[]` |  | `{ id, title, start, end?, allDay?, tone?, color? }`. Events spanning days show on each day; `tone` is primary, success, warning, error or info. 12.2: `color` takes any brand colour (hex, rgb(), hsl(), oklab(), oklch()) and wins over `tone`: the container is mixed from it into the surface and the text picked for 4.5:1 contrast, in light and dark. A colour that can’t be read keeps the tone and warns in development. |
| `date / defaultDate / onDateChange` | `Date` |  | Any day in the shown month or week; Today and the arrows change it. |
| `view / defaultView / onViewChange` | `'month' \| 'week'` | `'month'` | Week shows every event; month shows `maxEventsPerDay` then "N more". |
| `onEventClick` | `(event) => void` |  | Makes events buttons. |
| `onDayClick` | `(date) => void` |  | Makes day numbers and "N more" buttons, for example to open the day. |
| `maxEventsPerDay` | `number` | `3` | Month view only. |
| `weekStartsOn` | `0–6` |  | Defaults to the locale’s first day (Monday for en-GB, Sunday for en-US). |
| `onEventMove` | `(event, { start, end }) => void` |  | 11.4. Makes events movable: drag one to another day (month, week) or time (day view, 15-minute steps), or press Alt+Arrow on it, pick with the arrows and press Enter (Escape cancels). The duration is kept. Events with `editable: false` stay put. |
| `renderDayAction` | `(date) => ReactNode` |  | 11.4. A per-day slot, e.g. a small add button: in each day’s header (month, week), above the day view and beside each agenda day. |
| `eventActions` | `(event) => ReactNode` |  | 11.4. Controls for one event, e.g. a menu: beside it in day and agenda views, over its end on hover or focus in month and week cells (always shown on touch screens). |
| `legend` | `{ label, tone, color? }[]` |  | 11.4. A row under the toolbar naming what each tone means (12.2: or each `color`). Colour is never the only signal: titles still say what an event is. |

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
      <p aria-live="polite" className="text-body-sm text-on-surface-muted">{picked && `Opened: ${picked}`}</p>
    </div>
  );
}
```

## Example: Day and agenda views

`views` adds Day (an hour grid with a "now" line) and Agenda (the month as a list) to the switcher.

```tsx
import { EventCalendar, type CalendarEvent } from '@nexub/react';

// A fixed day, so the page renders the same on the server and in every time zone.
const at = (day: number, hour = 0, minute = 0) => new Date(2026, 10, 16 + day, hour, minute);

const events: CalendarEvent[] = [
  { id: '1', title: 'Offsite', start: at(0), allDay: true, tone: 'success' },
  { id: '2', title: 'Standup', start: at(0, 9, 30), end: at(0, 10) },
  { id: '3', title: 'Design review', start: at(0, 9, 30), end: at(0, 11), tone: 'info' },
  { id: '4', title: 'Launch', start: at(0, 14), end: at(0, 15, 30), tone: 'warning' },
  { id: '5', title: 'Retro', start: at(1, 16) },
];

export default function Example() {
  return (
    <div className="w-full">
      <EventCalendar events={events} defaultDate={at(0)} now={at(0, 11)} defaultView="day" views={['month', 'week', 'day', 'agenda']} />
    </div>
  );
}
```

## Example: Move, add and act on events

Drag an event, or press Alt+Arrow on it, to move it; a "+" per day, a menu per event and a legend.

```tsx
import * as React from 'react';
import { EventCalendar, IconButton, type CalendarEvent } from '@nexub/react';
import { MoreHorizontal, Plus } from '@nexub/icons';

// A fixed month, so the page renders the same on the server and in every time zone.
const at = (day: number, hour = 0, minute = 0) => new Date(2026, 10, day, hour, minute);

const initial: CalendarEvent[] = [
  { id: '1', title: 'Design review', start: at(3, 10), end: at(3, 11) },
  { id: '2', title: 'Offsite', start: at(11), end: at(12), allDay: true, tone: 'success' },
  { id: '3', title: 'Standup', start: at(16, 9, 30), end: at(16, 10) },
  { id: '4', title: 'Launch', start: at(16, 14), tone: 'warning' },
  { id: '5', title: 'Payroll', start: at(25), allDay: true, tone: 'info', editable: false },
];

export default function Example() {
  const [events, setEvents] = React.useState(initial);
  return (
    <div className="w-full">
      <EventCalendar
        events={events}
        defaultDate={at(16)}
        now={at(16, 11)}
        views={['month', 'week', 'day', 'agenda']}
        onEventMove={(event, range) => setEvents((list) => list.map((e) => (e.id === event.id ? { ...e, ...range } : e)))}
        renderDayAction={(date) => (
          <IconButton variant="ghost" size="xs" label={`Add event on ${date.toDateString()}`}>
            <Plus size="sm" aria-hidden="true" />
          </IconButton>
        )}
        eventActions={(event) => (
          <IconButton variant="ghost" size="xs" label={`Actions for ${event.title}`}>
            <MoreHorizontal size="sm" aria-hidden="true" />
          </IconButton>
        )}
        legend={[
          { label: 'Meetings', tone: 'primary' },
          { label: 'Away', tone: 'success' },
          { label: 'Deadlines', tone: 'warning' },
          { label: 'Payroll (fixed)', tone: 'info' },
        ]}
      />
    </div>
  );
}
```

## Example: Company colours

12.2. `color` per event: six brand colours in different syntaxes, readable in light and dark.

```tsx
'use client';

import { EventCalendar, type CalendarEvent } from '@nexub/react';

const today = new Date();
const on = (day: number, hour?: number) => new Date(today.getFullYear(), today.getMonth(), day, hour ?? 0);

// One brand colour per company, in any CSS colour syntax.
const companies = [
  { label: 'Acme', color: '#ffd400' },
  { label: 'Globex', color: '#0b1f4d' },
  { label: 'Initech', color: 'rgb(228, 0, 43)' },
  { label: 'Umbrella', color: 'hsl(160 100% 33%)' },
  { label: 'Hooli', color: 'oklch(0.62 0.2 300)' },
  { label: 'Stark', color: '#ff7a00' },
];

const events: CalendarEvent[] = companies.flatMap((c, i) => [
  { id: `${c.label}-board`, title: `${c.label} board`, start: on(14 + (i % 3), 9 + i), color: c.color },
  { id: `${c.label}-payroll`, title: `${c.label} payroll`, start: on(2 + i * 4), allDay: true, color: c.color },
]);

export default function Example() {
  return (
    <EventCalendar
      events={events}
      onEventClick={() => {}}
      maxEventsPerDay={4}
      legend={companies.map((c) => ({ ...c, tone: 'primary' as const }))}
      className="w-full"
    />
  );
}
```

## Accessibility

- `Alt + Arrow keys`: With `onEventMove`, on an event: starts a move and takes the first step.
- `Arrow keys`: While moving: left and right a day; up and down a week, or 15 minutes in day view.
- `Enter / Escape`: Drops the event there, or cancels the move.
- A table with weekday column headers; today has `aria-current="date"` and each day reads its full date.
- The title is a polite live region, so Today and the arrows announce the new month or week.
- `color` changes only the paint: the event’s accessible name is still its title (and time).
- Movable events describe the keyboard move (Alt+Arrow, then arrows, Enter or Escape); each step and the drop are announced in a polite live region.

Related: [date-picker](date-picker.md), [date-time-picker](date-time-picker.md)
