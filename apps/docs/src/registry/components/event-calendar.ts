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
    { name: 'onEventMove', type: '(event, { start, end }) => void', required: false, description: '11.4. Makes events movable: drag one to another day (month, week) or time (day view, 15-minute steps), or press Alt+Arrow on it, pick with the arrows and press Enter (Escape cancels). The duration is kept. Events with `editable: false` stay put.' },
    { name: 'renderDayAction', type: '(date) => ReactNode', required: false, description: '11.4. A per-day slot, e.g. a small add button: in each day’s header (month, week), above the day view and beside each agenda day.' },
    { name: 'eventActions', type: '(event) => ReactNode', required: false, description: '11.4. Controls for one event, e.g. a menu: beside it in day and agenda views, over its end on hover or focus in month and week cells (always shown on touch screens).' },
    { name: 'legend', type: '{ label, tone }[]', required: false, description: '11.4. A row under the toolbar naming what each tone means. Colour is never the only signal: titles still say what an event is.' },
  ],
  examples: [
    { title: 'Team calendar' },
    { title: 'Day and agenda views', description: '`views` adds Day (an hour grid with a "now" line) and Agenda (the month as a list) to the switcher.' },
    { title: 'Move, add and act on events', description: 'Drag an event, or press Alt+Arrow on it, to move it; a "+" per day, a menu per event and a legend.' },
  ],
  a11y: {
    keyboard: [
      { key: 'Alt + Arrow keys', description: 'With `onEventMove`, on an event: starts a move and takes the first step.' },
      { key: 'Arrow keys', description: 'While moving: left and right a day; up and down a week, or 15 minutes in day view.' },
      { key: 'Enter / Escape', description: 'Drops the event there, or cancels the move.' },
    ],
    notes: [
      'A table with weekday column headers; today has `aria-current="date"` and each day reads its full date.',
      'The title is a polite live region, so Today and the arrows announce the new month or week.',
      'Movable events describe the keyboard move (Alt+Arrow, then arrows, Enter or Escape); each step and the drop are announced in a polite live region.',
    ],
  },
};

export default entry;
