'use client'; // docs preview: server pages import every example

import { EventCalendar, type CalendarEvent } from '@nexub/react';

const today = new Date();
const at = (day: number, hour = 0, minute = 0) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + day, hour, minute);

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
      <EventCalendar events={events} defaultView="day" views={['month', 'week', 'day', 'agenda']} />
    </div>
  );
}
