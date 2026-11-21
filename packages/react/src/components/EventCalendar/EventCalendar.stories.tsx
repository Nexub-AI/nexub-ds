import type { Meta, StoryObj } from '@storybook/react';
import { EventCalendar, type CalendarEvent } from './EventCalendar.js';
import { ErrorState } from '../ErrorState/ErrorState.js';
import * as React from 'react';
import { Plus, MoreHorizontal } from '@nexub/icons';
import { IconButton } from '../IconButton/IconButton.js';

const meta: Meta = {
  title: 'Components/EventCalendar',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

// Pinned dates keep the screenshots stable.
const events: CalendarEvent[] = [
  { id: '1', title: 'Design review', start: new Date(2026, 10, 3, 10) },
  { id: '2', title: 'Offsite', start: new Date(2026, 10, 11), end: new Date(2026, 10, 12), allDay: true, tone: 'success' },
  { id: '3', title: 'Standup', start: new Date(2026, 10, 16, 9, 30) },
  { id: '4', title: 'Launch', start: new Date(2026, 10, 16, 14), tone: 'warning' },
  { id: '5', title: 'Retro', start: new Date(2026, 10, 16, 16) },
  { id: '6', title: 'Incident review', start: new Date(2026, 10, 16, 17), tone: 'error' },
  { id: '7', title: 'Payroll', start: new Date(2026, 10, 25), allDay: true, tone: 'info' },
];

export const Month: Story = {
  render: () => <EventCalendar events={events} defaultDate={new Date(2026, 10, 16)} weekStartsOn={1} onEventClick={() => {}} onDayClick={() => {}} />,
};
export const Week: Story = {
  render: () => <EventCalendar events={events} defaultDate={new Date(2026, 10, 16)} defaultView="week" weekStartsOn={1} />,
};

/** Loading keeps the grid; the empty state sits under it; an error replaces it. */
export const DataStates: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <EventCalendar events={[]} defaultDate={new Date(2026, 10, 16)} defaultView="week" weekStartsOn={1} loading />
      <EventCalendar events={[]} defaultDate={new Date(2026, 10, 16)} defaultView="week" weekStartsOn={1} emptyState="No events this week." />
      <EventCalendar
        events={[]}
        defaultDate={new Date(2026, 10, 16)}
        defaultView="week"
        weekStartsOn={1}
        errorState={<ErrorState title="Could not load events" onRetry={() => {}} />}
      />
    </div>
  ),
};

const dayEvents: CalendarEvent[] = [
  { id: 'd1', title: 'Offsite', start: new Date(2026, 10, 16), allDay: true, tone: 'success' },
  { id: 'd2', title: 'Standup', start: new Date(2026, 10, 16, 9, 30), end: new Date(2026, 10, 16, 10) },
  { id: 'd3', title: 'Design review', start: new Date(2026, 10, 16, 9, 30), end: new Date(2026, 10, 16, 11), tone: 'info' },
  { id: 'd4', title: 'Launch', start: new Date(2026, 10, 16, 14), end: new Date(2026, 10, 16, 15, 30), tone: 'warning' },
  { id: 'd5', title: 'Incident review', start: new Date(2026, 10, 16, 17), tone: 'error' },
];
const allViews = ['month', 'week', 'day', 'agenda'] as const;

/** 10.7: one day by the hour. `now` is pinned so the line stays put in screenshots. */
export const Day: Story = {
  render: () => (
    <EventCalendar
      events={dayEvents}
      defaultDate={new Date(2026, 10, 16)}
      now={new Date(2026, 10, 16, 11, 15)}
      defaultView="day"
      views={[...allViews]}
      onEventClick={() => {}}
    />
  ),
};

/** 10.7: the month's events as a list grouped by day. */
export const Agenda: Story = {
  render: () => (
    <EventCalendar
      events={events}
      defaultDate={new Date(2026, 10, 16)}
      now={new Date(2026, 10, 16, 11, 15)}
      defaultView="agenda"
      views={[...allViews]}
      onEventClick={() => {}}
    />
  ),
};

/** 11.4: drag an event (or Alt+Arrow, arrows, Enter) to move it; a "+" per day, a menu per event and a legend. */
export const Editable: Story = {
  render: function Render() {
    const [list, setList] = React.useState(events);
    return (
      <EventCalendar
        events={list}
        defaultDate={new Date(2026, 10, 16)}
        now={new Date(2026, 10, 16, 11, 15)}
        weekStartsOn={1}
        views={[...allViews]}
        onEventMove={(e, range) => setList((l) => l.map((x) => (x.id === e.id ? { ...x, ...range } : x)))}
        renderDayAction={(d) => (
          <IconButton variant="ghost" size="xs" label={`Add event on ${d.toDateString()}`}>
            <Plus size="sm" aria-hidden="true" />
          </IconButton>
        )}
        eventActions={(e) => (
          <IconButton variant="ghost" size="xs" label={`Actions for ${e.title}`}>
            <MoreHorizontal size="sm" aria-hidden="true" />
          </IconButton>
        )}
        legend={[
          { label: 'Meetings', tone: 'primary' },
          { label: 'Away', tone: 'success' },
          { label: 'Deadlines', tone: 'warning' },
          { label: 'Incidents', tone: 'error' },
          { label: 'Payroll', tone: 'info' },
        ]}
      />
    );
  },
};
