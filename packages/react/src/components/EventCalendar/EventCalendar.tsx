'use client';

import * as React from 'react';
import {
  addDays,
  addMonths,
  addWeeks,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
  type Day,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import { Button } from '../Button/Button.js';
import { IconButton } from '../IconButton/IconButton.js';
import { SegmentedControl } from '../SegmentedControl/SegmentedControl.js';
import { useControllableState } from '../../hooks/useControllableState.js';
import { useIntlLocale, useLocale, useNexubMessages } from '../NexubProvider/NexubProvider.js';

export type EventCalendarView = 'month' | 'week';
export type EventTone = 'primary' | 'success' | 'warning' | 'error' | 'info';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  /** Inclusive end; events spanning days show on each of them. */
  end?: Date;
  /** Hides the start time. */
  allDay?: boolean;
  /** @default 'primary' */
  tone?: EventTone;
}

export interface EventCalendarProps {
  events: CalendarEvent[];
  /** Any day inside the shown month or week. */
  date?: Date;
  defaultDate?: Date;
  onDateChange?: (date: Date) => void;
  view?: EventCalendarView;
  defaultView?: EventCalendarView;
  onViewChange?: (view: EventCalendarView) => void;
  onEventClick?: (event: CalendarEvent) => void;
  /** A day's number, or its "N more" link in month view. */
  onDayClick?: (date: Date) => void;
  /** Events shown per day in month view before "N more". @default 3 */
  maxEventsPerDay?: number;
  /** 0 = Sunday. Defaults to the locale's first day of the week. */
  weekStartsOn?: Day;
  className?: string;
}

const tones: Record<EventTone, string> = {
  primary: 'bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)]',
  success: 'bg-[var(--color-success-container)] text-[var(--color-on-success-container)]',
  warning: 'bg-[var(--color-warning-container)] text-[var(--color-on-warning-container)]',
  error: 'bg-[var(--color-error-container)] text-[var(--color-on-error-container)]',
  info: 'bg-[var(--color-info-container)] text-[var(--color-on-info-container)]',
};

function localeWeekStart(locale: string | undefined): Day {
  try {
    const loc = new Intl.Locale(locale ?? new Intl.DateTimeFormat().resolvedOptions().locale) as Intl.Locale & {
      getWeekInfo?: () => { firstDay: number };
      weekInfo?: { firstDay: number };
    };
    const firstDay = loc.getWeekInfo?.().firstDay ?? loc.weekInfo?.firstDay;
    return (firstDay ? firstDay % 7 : 0) as Day;
  } catch {
    return 0;
  }
}

/**
 * A month or week grid of events. Display only: your app owns the events and
 * decides what a click on an event or a day does.
 */
export function EventCalendar({
  events,
  date: dateProp,
  defaultDate,
  onDateChange,
  view: viewProp,
  defaultView = 'month',
  onViewChange,
  onEventClick,
  onDayClick,
  maxEventsPerDay = 3,
  weekStartsOn: weekStartsOnProp,
  className,
}: EventCalendarProps) {
  const t = useNexubMessages();
  const { dir } = useLocale();
  const intlLocale = useIntlLocale();
  const [date = new Date(), setDate] = useControllableState<Date>({
    value: dateProp,
    defaultValue: defaultDate ?? new Date(),
    onChange: onDateChange,
  });
  const [view = 'month', setView] = useControllableState<EventCalendarView>({
    value: viewProp,
    defaultValue: defaultView,
    onChange: onViewChange,
  });
  const weekStartsOn = weekStartsOnProp ?? localeWeekStart(intlLocale);
  const opts = { weekStartsOn };
  const month = view === 'month';

  const first = startOfWeek(month ? startOfMonth(date) : date, opts);
  const last = endOfWeek(month ? endOfMonth(date) : date, opts);
  const days: Date[] = [];
  for (let d = first; d <= last; d = addDays(d, 1)) days.push(d);
  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

  const sorted = React.useMemo(
    () => [...events].sort((a, b) => a.start.getTime() - b.start.getTime()),
    [events],
  );
  const eventsOn = (day: Date) =>
    sorted.filter((e) => e.start <= endOfDay(day) && (e.end ?? e.start) >= startOfDay(day));

  const fmt = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(intlLocale, o);
  const title = month
    ? fmt({ month: 'long', year: 'numeric' }).format(date)
    : fmt({ month: 'short', day: 'numeric', year: 'numeric' }).formatRange(days[0]!, days[6]!);
  const timeFmt = fmt({ timeStyle: 'short' });
  const fullFmt = fmt({ dateStyle: 'full' });
  const today = new Date();
  const step = (n: number) => setDate(month ? addMonths(date, n) : addWeeks(date, n));
  const [Back, Forward] = dir === 'rtl' ? [ChevronRight, ChevronLeft] : [ChevronLeft, ChevronRight];

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="flex flex-wrap items-center gap-2">
        <h2 aria-live="polite" className="me-auto text-title-lg font-semibold text-[var(--color-on-surface)]">
          {title}
        </h2>
        <Button variant="outlined" size="sm" onClick={() => setDate(new Date())}>
          {t.today}
        </Button>
        <IconButton variant="ghost" size="sm" label={month ? t.previousMonth : t.previousWeek} onClick={() => step(-1)}>
          <Back size="sm" aria-hidden="true" />
        </IconButton>
        <IconButton variant="ghost" size="sm" label={month ? t.nextMonth : t.nextWeek} onClick={() => step(1)}>
          <Forward size="sm" aria-hidden="true" />
        </IconButton>
        <SegmentedControl.Root
          size="sm"
          aria-label={t.calendarView}
          value={view}
          onValueChange={(v) => v && setView(v as EventCalendarView)}
        >
          <SegmentedControl.Item value="month">{t.monthView}</SegmentedControl.Item>
          <SegmentedControl.Item value="week">{t.weekView}</SegmentedControl.Item>
        </SegmentedControl.Root>
      </div>

      <table className="w-full table-fixed border-collapse text-body-sm">
        <caption className="sr-only">{title}</caption>
        <thead>
          <tr>
            {weeks[0]!.map((d) => (
              <th
                key={d.getDay()}
                scope="col"
                abbr={fmt({ weekday: 'long' }).format(d)}
                className="pb-2 text-label-md font-medium text-[var(--color-on-surface-muted)]"
              >
                {fmt({ weekday: 'short' }).format(d)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr key={week[0]!.toISOString()}>
              {week.map((day) => {
                const list = eventsOn(day);
                const shown = month ? list.slice(0, maxEventsPerDay) : list;
                const hidden = list.length - shown.length;
                const isToday = isSameDay(day, today);
                const outside = month && !isSameMonth(day, date);
                return (
                  <td
                    key={day.toISOString()}
                    aria-current={isToday ? 'date' : undefined}
                    className={cn(
                      'border border-[var(--color-outline-variant)] p-1 align-top',
                      month ? 'h-28' : 'h-80',
                      outside && 'bg-[var(--color-surface-container-low)]',
                    )}
                  >
                    <DayNumber
                      day={day}
                      label={fullFmt.format(day)}
                      isToday={isToday}
                      muted={outside}
                      onClick={onDayClick}
                    />
                    <ul className="mt-1 flex flex-col gap-0.5">
                      {shown.map((e) => {
                        const time = e.allDay || !isSameDay(e.start, day) ? '' : timeFmt.format(e.start);
                        const body = (
                          <>
                            {time && <span className="me-1 tabular-nums opacity-80">{time}</span>}
                            {e.title}
                          </>
                        );
                        const cls = cn(
                          'block w-full truncate rounded-shape-min px-1.5 py-0.5 text-start text-label-md',
                          tones[e.tone ?? 'primary'],
                        );
                        return (
                          <li key={e.id}>
                            {onEventClick ? (
                              <button type="button" className={cn(cls, 'hover:opacity-90')} onClick={() => onEventClick(e)}>
                                {body}
                              </button>
                            ) : (
                              <span className={cls}>{body}</span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                    {hidden > 0 &&
                      (onDayClick ? (
                        <button
                          type="button"
                          className="mt-0.5 px-1.5 text-label-md text-[var(--color-on-surface-variant)] hover:underline"
                          onClick={() => onDayClick(day)}
                        >
                          {t.moreCount(hidden)}
                        </button>
                      ) : (
                        <span className="mt-0.5 block px-1.5 text-label-md text-[var(--color-on-surface-variant)]">
                          {t.moreCount(hidden)}
                        </span>
                      ))}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DayNumber({
  day,
  label,
  isToday,
  muted,
  onClick,
}: {
  day: Date;
  label: string;
  isToday: boolean;
  muted: boolean;
  onClick?: (date: Date) => void;
}) {
  const cls = cn(
    'inline-flex size-7 items-center justify-center rounded-full text-label-md tabular-nums',
    isToday
      ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]'
      : muted
        ? 'text-[var(--color-on-surface-muted)]'
        : 'text-[var(--color-on-surface)]',
  );
  const n = day.getDate();
  return onClick ? (
    <button
      type="button"
      aria-label={label}
      className={cn(cls, !isToday && 'hover:bg-[var(--color-surface-container-high)]')}
      onClick={() => onClick(day)}
    >
      {n}
    </button>
  ) : (
    <time dateTime={format(day, 'yyyy-MM-dd')} className={cls}>
      <span aria-hidden="true">{n}</span>
      <span className="sr-only">{label}</span>
    </time>
  );
}
