'use client'; // docs preview: server pages import every example

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
