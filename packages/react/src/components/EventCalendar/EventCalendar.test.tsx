import { ErrorState } from '../ErrorState/ErrorState.js';
import * as React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { EventCalendar, type CalendarEvent } from './EventCalendar.js';
import { NexubProvider } from '../NexubProvider/NexubProvider.js';

const events: CalendarEvent[] = [
  { id: 'a', title: 'Standup', start: new Date(2026, 10, 9, 9, 30) },
  { id: 'b', title: 'Offsite', start: new Date(2026, 10, 10), end: new Date(2026, 10, 11), allDay: true, tone: 'success' },
  { id: 'c', title: 'Review', start: new Date(2026, 10, 9, 14) },
  { id: 'd', title: 'Retro', start: new Date(2026, 10, 9, 16) },
  { id: 'e', title: 'Late', start: new Date(2026, 10, 9, 18) },
];

const renderCal = (props: Partial<React.ComponentProps<typeof EventCalendar>> = {}) =>
  render(
    <NexubProvider locale="en-GB">
      <EventCalendar events={events} defaultDate={new Date(2026, 10, 9)} {...props} />
    </NexubProvider>,
  );

describe('EventCalendar', () => {
  it('month view: Monday-first for en-GB, multi-day events on each day, overflow as "N more"', async () => {
    const onDayClick = vi.fn();
    const onEventClick = vi.fn();
    renderCal({ onDayClick, onEventClick });
    expect(screen.getByRole('heading', { name: 'November 2026' })).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader')[0]).toHaveTextContent('Mon');
    expect(screen.getAllByRole('button', { name: 'Offsite' })).toHaveLength(2);
    await userEvent.click(screen.getByRole('button', { name: '1 more' }));
    expect(onDayClick).toHaveBeenCalledWith(new Date(2026, 10, 9));
    await userEvent.click(screen.getByRole('button', { name: /Standup/ }));
    expect(onEventClick).toHaveBeenCalledWith(events[0]);
  });

  it('week view lists every event and the arrows move by a week', async () => {
    const onDateChange = vi.fn();
    renderCal({ defaultView: 'week', onDateChange });
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(2);
    expect(within(rows[1]!).getByText('Late')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Go to next week' }));
    expect(onDateChange).toHaveBeenCalledWith(new Date(2026, 10, 16));
    await userEvent.click(screen.getByRole('radio', { name: 'Month' }));
    expect(screen.getByRole('heading', { name: 'November 2026' })).toBeInTheDocument();
  });
});

describe('EventCalendar 10.5: data states', () => {
  it('loading keeps the grid, sets aria-busy and hides the events', () => {
    const { container } = renderCal({ loading: true });
    expect(screen.getByRole('table').getAttribute('aria-busy')).toBe('true');
    expect(screen.queryByText('Standup')).toBeNull();
    expect(container.querySelectorAll('td > span[aria-hidden="true"]').length).toBeGreaterThan(27);
  });

  it('emptyState shows under the grid only when the visible range has no events', () => {
    renderCal({ emptyState: 'No events' });
    expect(screen.queryByText('No events')).toBeNull();
    renderCal({ emptyState: 'No events here', defaultDate: new Date(2027, 0, 15) });
    expect(screen.getByText('No events here')).toBeTruthy();
    expect(screen.getAllByRole('table')).toHaveLength(2);
  });

  it('errorState replaces the grid and wins over loading', () => {
    renderCal({ loading: true, errorState: <ErrorState title="Failed" /> });
    expect(screen.getByRole('heading', { name: 'Failed' })).toBeTruthy();
    expect(screen.queryByRole('table')).toBeNull();
  });
});
