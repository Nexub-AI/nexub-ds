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
