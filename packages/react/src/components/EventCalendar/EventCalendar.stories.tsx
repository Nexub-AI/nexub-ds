import type { Meta, StoryObj } from '@storybook/react';
import { EventCalendar, type CalendarEvent } from './EventCalendar.js';
import { ErrorState } from '../ErrorState/ErrorState.js';

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
