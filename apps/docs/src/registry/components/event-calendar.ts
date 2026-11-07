import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'event-calendar',
    title: 'Event Calendar',
    description: 'A month or week grid of events. Display only: your app owns the events and what a click does.',
    category: 'Data Display',
    package: '@nexub/react',
    status: 'beta',
    addedIn: '6.2.0',
    related: ['date-picker', 'date-time-picker'],
  },
  props: [
    { name: 'events', type: 'CalendarEvent[]', required: true, description: '`{ id, title, start, end?, allDay?, tone? }`. Events spanning days show on each day; `tone` is primary, success, warning, error or info.' },
    { name: 'date / defaultDate / onDateChange', type: 'Date', required: false, description: 'Any day in the shown month or week; Today and the arrows change it.' },
    { name: 'view / defaultView / onViewChange', type: "'month' | 'week'", default: "'month'", required: false, description: 'Week shows every event; month shows `maxEventsPerDay` then "N more".' },
    { name: 'onEventClick', type: '(event) => void', required: false, description: 'Makes events buttons.' },
    { name: 'onDayClick', type: '(date) => void', required: false, description: 'Makes day numbers and "N more" buttons, for example to open the day.' },
    { name: 'maxEventsPerDay', type: 'number', default: '3', required: false, description: 'Month view only.' },
    { name: 'weekStartsOn', type: '0–6', required: false, description: 'Defaults to the locale’s first day (Monday for en-GB, Sunday for en-US).' },
  ],
  examples: [{ title: 'Team calendar' }],
  a11y: {
    notes: [
      'A table with weekday column headers; today has `aria-current="date"` and each day reads its full date.',
      'The title is a polite live region, so Today and the arrows announce the new month or week.',
    ],
  },
};

export default entry;
