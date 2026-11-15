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
