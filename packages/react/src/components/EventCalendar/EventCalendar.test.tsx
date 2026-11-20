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

describe('EventCalendar 10.7: day and agenda views', () => {
  const dayEvents: CalendarEvent[] = [
    { id: 'late', title: 'Review', start: new Date(2026, 10, 9, 14), end: new Date(2026, 10, 9, 15) },
    { id: 'a', title: 'Standup', start: new Date(2026, 10, 9, 9, 30), end: new Date(2026, 10, 9, 10) },
    { id: 'b', title: 'Sync', start: new Date(2026, 10, 9, 9, 30), end: new Date(2026, 10, 9, 10, 30) },
    { id: 'off', title: 'Offsite', start: new Date(2026, 10, 9), allDay: true },
    { id: 'next', title: 'Tomorrow', start: new Date(2026, 10, 10, 11) },
  ];
  const names = (els: HTMLElement[]) => els.map((el) => el.textContent);

  it('the switcher offers month and week unless `views` or the view adds more', () => {
    const { unmount } = renderCal();
    expect(names(screen.getAllByRole('radio'))).toEqual(['Month', 'Week']);
    unmount();
    renderCal({ views: ['day', 'agenda'], defaultView: 'week' });
    expect(names(screen.getAllByRole('radio'))).toEqual(['Day', 'Agenda', 'Week']);
  });

  it('day view: all-day strip, timed events in start order, overlaps side by side, a now line today', async () => {
    const onEventClick = vi.fn();
    const onDateChange = vi.fn();
    const { container } = renderCal({ events: dayEvents, defaultView: 'day', now: new Date(2026, 10, 9, 12), onEventClick, onDateChange });
    expect(screen.getByRole('heading', { name: /Monday,? 9 November 2026/ })).toBeInTheDocument();
    expect(screen.queryByRole('table')).toBeNull();
    expect(within(screen.getByRole('list', { name: 'All day' })).getByRole('button')).toHaveTextContent('Offsite');
    // DOM (and so Tab) order follows the start time, not the order of `events`.
    const timed = screen.getAllByRole('button', { name: /Standup|Sync|Review/ });
    expect(names(timed).map((n) => n!.replace(/^[\d:\s–-]+/, ''))).toEqual(['Standup', 'Sync', 'Review']);
    expect(timed[0]).toHaveTextContent(/09:30.*10:00/);
    expect(screen.queryByText('Tomorrow')).toBeNull();
    const box = (el: HTMLElement) => el.closest('li')!.style;
    expect(box(timed[0]!).width).toBe('50%');
    expect(box(timed[1]!).insetInlineStart).toBe('50%');
    expect(box(timed[2]!).width).toBe('100%');
    // 08:00–18:00 grid: 09:30 is 15% down, and the half hour gets 5%.
    expect(box(timed[0]!).top).toBe('15%');
    expect(box(timed[0]!).height).toBe('5%');
    expect(container.querySelector<HTMLElement>('[data-now]')!.style.top).toBe('40%');
    await userEvent.click(timed[0]!);
    expect(onEventClick).toHaveBeenCalledWith(dayEvents[1]);
    await userEvent.click(screen.getByRole('button', { name: 'Go to next day' }));
    expect(onDateChange).toHaveBeenCalledWith(new Date(2026, 10, 10));
    expect(screen.getByText(/Tomorrow/)).toBeInTheDocument();
    expect(container.querySelector('[data-now]')).toBeNull();
  });

  it('day view: the grid grows to hold early and late events, and an event without an end takes an hour', () => {
    renderCal({
      events: [
        { id: 'e', title: 'Early', start: new Date(2026, 10, 9, 6) },
        { id: 'l', title: 'Late', start: new Date(2026, 10, 9, 21), end: new Date(2026, 10, 9, 21, 5) },
      ],
      defaultView: 'day',
      now: new Date(2026, 10, 1),
    });
    // 06:00–22:00 = 16 hours.
    expect(screen.getByText('Early').closest('li')!.style.height).toBe('6.25%');
    // Five minutes still gets the 30-minute minimum.
    expect(screen.getByText('Late').closest('li')!.style.height).toBe('3.125%');
  });

  it('agenda: the month as a list grouped by day, days without events skipped', async () => {
    const onEventClick = vi.fn();
    const onDateChange = vi.fn();
    renderCal({ defaultView: 'agenda', onEventClick, onDateChange });
    expect(screen.getByRole('heading', { level: 2, name: 'November 2026' })).toBeInTheDocument();
    expect(screen.queryByRole('table')).toBeNull();
    const days = screen.getAllByRole('heading', { level: 3 });
    expect(days).toHaveLength(3);
    const monday = screen.getByRole('region', { name: /Monday,? 9 November 2026/ });
    const rows = within(monday).getAllByRole('listitem');
    expect(rows.map((r) => r.textContent)).toEqual(['09:30Standup', '14:00Review', '16:00Retro', '18:00Late']);
    expect(within(screen.getByRole('region', { name: /Wednesday,? 11 November 2026/ })).getByRole('listitem')).toHaveTextContent('All dayOffsite');
    await userEvent.click(within(monday).getByRole('button', { name: /Review/ }));
    expect(onEventClick).toHaveBeenCalledWith(events[2]);
    await userEvent.click(screen.getByRole('button', { name: 'Go to next month' }));
    expect(onDateChange).toHaveBeenCalledWith(new Date(2026, 11, 9));
  });

  it('emptyState shows when the day or the agenda month has no events; loading hides them', () => {
    const { unmount } = renderCal({ defaultView: 'agenda', defaultDate: new Date(2027, 0, 15), emptyState: 'Nothing this month' });
    expect(screen.getByText('Nothing this month')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 3 })).toBeNull();
    unmount();
    const day = renderCal({ defaultView: 'day', defaultDate: new Date(2026, 10, 12), emptyState: 'Nothing today' });
    expect(screen.getByText('Nothing today')).toBeInTheDocument();
    day.unmount();
    const { container } = renderCal({ defaultView: 'agenda', loading: true });
    expect(screen.queryByText('Standup')).toBeNull();
    expect(container.querySelector('[aria-busy="true"]')).not.toBeNull();
  });
});
