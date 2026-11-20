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
import { Skeleton } from '../Skeleton/Skeleton.js';
import { dataBusy, dataState, type DataStateProps } from '../../utils/dataState.js';

export type EventCalendarView = 'month' | 'week' | 'day' | 'agenda';
export type EventTone = 'primary' | 'success' | 'warning' | 'error' | 'info';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  /** Inclusive end; events spanning days show on each of them. */
  end?: Date;
  /** Hides the start time. In day view the event sits in the strip above the hours. */
  allDay?: boolean;
  /** @default 'primary' */
  tone?: EventTone;
}

export interface EventCalendarProps extends DataStateProps {
  events: CalendarEvent[];
  /**
   * Shown under the grid when no event falls in the visible range (the month, week or
   * day; agenda covers the month). The grid stays, and an empty range is normal, so there is no default.
   */
  emptyState?: React.ReactNode;
  /** Any day inside the shown month or week. */
  date?: Date;
  defaultDate?: Date;
  onDateChange?: (date: Date) => void;
  view?: EventCalendarView;
  defaultView?: EventCalendarView;
  onViewChange?: (view: EventCalendarView) => void;
  /**
   * Views offered in the switcher. `'day'` (an hour grid for one day) and `'agenda'` (the
   * month's events as a list) are opt-in; the current view is always offered. @default ['month', 'week']
   */
  views?: EventCalendarView[];
  /** The current time: marks today and draws the "now" line in day view. Pass a fixed date in tests and screenshots. @default new Date() */
  now?: Date;
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

// Solid, for the agenda's small marker: the container tones are too faint at that size.
const markers: Record<EventTone, string> = {
  primary: 'bg-[var(--color-primary)]',
  success: 'bg-[var(--color-success)]',
  warning: 'bg-[var(--color-warning)]',
  error: 'bg-[var(--color-error)]',
  info: 'bg-[var(--color-info)]',
};

const DEFAULT_VIEWS: EventCalendarView[] = ['month', 'week'];
const MINUTE = 60_000;
/** Day view: the shortest box an event gets (minutes), so its one line of text fits. */
const MIN_EVENT = 30;

/** CSSOM, not a style attribute: strict CSP pages block inline styles. */
const place = (css: Partial<CSSStyleDeclaration>) => (el: HTMLElement | null) => {
  if (el) Object.assign(el.style, css);
};
const pct = (n: number) => `${n * 100}%`;

/**
 * Side-by-side columns for overlapping events (minutes from midnight, sorted by start):
 * each takes the first free column, and events that overlap in a chain share one column count.
 */
function dayColumns<T extends { from: number; to: number }>(items: T[]): (T & { col: number; cols: number })[] {
  const out: (T & { col: number; cols: number })[] = [];
  let ends: number[] = [];
  let group: (T & { col: number; cols: number })[] = [];
  const flush = () => {
    for (const g of group) g.cols = ends.length;
    out.push(...group);
    ends = [];
    group = [];
  };
  for (const item of items) {
    if (group.length && item.from >= Math.max(...ends)) flush();
    let col = ends.findIndex((end) => end <= item.from);
    if (col < 0) col = ends.length;
    ends[col] = item.to;
    group.push({ ...item, col, cols: 1 });
  }
  flush();
  return out;
}

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
 * A month or week grid of events, one day by the hour, or an agenda list. Display only: your app owns the events and
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
  views = DEFAULT_VIEWS,
  now,
  className,
  loading,
  emptyState,
  errorState,
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
  const oneDay = view === 'day';
  const agenda = view === 'agenda';

  const first = oneDay ? startOfDay(date) : agenda ? startOfMonth(date) : startOfWeek(month ? startOfMonth(date) : date, opts);
  const last = oneDay ? endOfDay(date) : agenda ? endOfMonth(date) : endOfWeek(month ? endOfMonth(date) : date, opts);
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
  const timeFmt = fmt({ timeStyle: 'short' });
  const fullFmt = fmt({ dateStyle: 'full' });
  const title = oneDay
    ? fullFmt.format(date)
    : month || agenda
      ? fmt({ month: 'long', year: 'numeric' }).format(date)
      : fmt({ month: 'short', day: 'numeric', year: 'numeric' }).formatRange(days[0]!, days[6]!);
  const today = now ?? new Date();
  // The now line needs the minute, which the server cannot know: without a fixed `now`
  // it appears after mount, so server HTML and the first client render match.
  const [mountedNow, setMountedNow] = React.useState<Date>();
  React.useEffect(() => {
    if (!now) setMountedNow(new Date());
  }, [now]);
  const lineNow = now ?? mountedNow;
  const step = (n: number) => setDate(oneDay ? addDays(date, n) : month || agenda ? addMonths(date, n) : addWeeks(date, n));
  const [previous, next] = oneDay ? [t.previousDay, t.nextDay] : month || agenda ? [t.previousMonth, t.nextMonth] : [t.previousWeek, t.nextWeek];
  const viewLabels: Record<EventCalendarView, string> = { month: t.monthView, week: t.weekView, day: t.dayView, agenda: t.agendaView };
  const offered = views.includes(view) ? views : [...views, view];
  const headingId = React.useId();
  const [Back, Forward] = dir === 'rtl' ? [ChevronRight, ChevronLeft] : [ChevronLeft, ChevronRight];
  const states = { loading, emptyState, errorState };
  const busy = dataBusy(states);
  // Error replaces the grid; loading and empty keep it (null skeleton and text: the grid draws them itself).
  const state = dataState(states, !sorted.some((e) => e.start <= endOfDay(last) && (e.end ?? e.start) >= startOfDay(first)), null, null);

  const chip = 'block w-full truncate rounded-shape-min px-1.5 py-0.5 text-start text-label-md';
  /** An event as a button (with onEventClick) or plain text. */
  const eventNode = (e: CalendarEvent, cls: string, body: React.ReactNode) =>
    onEventClick ? (
      <button type="button" className={cn(cls, 'hover:opacity-90')} onClick={() => onEventClick(e)}>
        {body}
      </button>
    ) : (
      <span className={cls}>{body}</span>
    );
  const timed = (time: string, title: string) => (
    <>
      {time && <span className="me-1 tabular-nums opacity-80">{time}</span>}
      {title}
    </>
  );

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="flex flex-wrap items-center gap-2">
        <h2 aria-live="polite" className="me-auto text-title-lg font-semibold text-[var(--color-on-surface)]">
          {title}
        </h2>
        <Button variant="outlined" size="sm" onClick={() => setDate(now ?? new Date())}>
          {t.today}
        </Button>
        <IconButton variant="ghost" size="sm" label={previous} onClick={() => step(-1)}>
          <Back size="sm" aria-hidden="true" />
        </IconButton>
        <IconButton variant="ghost" size="sm" label={next} onClick={() => step(1)}>
          <Forward size="sm" aria-hidden="true" />
        </IconButton>
        <SegmentedControl.Root
          size="sm"
          aria-label={t.calendarView}
          value={view}
          onValueChange={(v) => v && setView(v as EventCalendarView)}
        >
          {offered.map((v) => (
            <SegmentedControl.Item key={v} value={v}>
              {viewLabels[v]}
            </SegmentedControl.Item>
          ))}
        </SegmentedControl.Root>
      </div>

      {state != null && state === errorState ? (
        <div className="flex min-h-80 flex-col justify-center">{state}</div>
      ) : oneDay ? (
        <>
          <DayGrid
            day={first}
            events={busy ? [] : eventsOn(first)}
            now={lineNow && isSameDay(first, lineNow) ? lineNow : undefined}
            busy={busy}
            allDayLabel={t.allDay}
            hourFmt={fmt({ hour: 'numeric' })}
            timeFmt={timeFmt}
            renderEvent={(e, time, cls) => eventNode(e, cn(cls, tones[e.tone ?? 'primary']), <span className="block truncate">{timed(time, e.title)}</span>)}
          />
          {state != null && <div className="flex flex-col">{state}</div>}
        </>
      ) : agenda ? (
        <>
          <div aria-busy={busy} className="flex flex-col gap-4">
            {busy && Array.from({ length: 3 }, (_, i) => <Skeleton key={i} shape="rect" className="h-10 rounded-shape-min" />)}
            {!busy &&
              days.map((d) => {
                const list = eventsOn(d);
                if (!list.length) return null;
                const id = `${headingId}-${format(d, 'yyyy-MM-dd')}`;
                return (
                  <section key={id} aria-labelledby={id}>
                    <h3
                      id={id}
                      aria-current={isSameDay(d, today) ? 'date' : undefined}
                      className="border-b border-[var(--color-outline-variant)] pb-1 text-label-lg font-medium text-[var(--color-on-surface-variant)] aria-[current]:text-[var(--color-primary)]"
                    >
                      {fullFmt.format(d)}
                    </h3>
                    <ul className="flex flex-col">
                      {list.map((e) => (
                        <li key={e.id}>
                          {eventNode(
                            e,
                            'flex min-h-10 w-full items-center gap-3 rounded-shape-min px-1 py-1 text-start text-body-sm text-[var(--color-on-surface)]',
                            <>
                              <span aria-hidden="true" className={cn('size-2 shrink-0 rounded-full', markers[e.tone ?? 'primary'])} />
                              <span className="w-16 shrink-0 tabular-nums text-[var(--color-on-surface-variant)]">
                                {e.allDay || !isSameDay(e.start, d) ? t.allDay : timeFmt.format(e.start)}
                              </span>
                              <span className="min-w-0 truncate">{e.title}</span>
                            </>,
                          )}
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              })}
          </div>
          {state != null && <div className="flex flex-col">{state}</div>}
        </>
      ) : (
        <>
          <table aria-busy={busy} className="w-full table-fixed border-collapse text-body-sm">
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
                    const list = busy ? [] : eventsOn(day);
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
                        {busy && <Skeleton shape="rect" className="mt-1 h-5 rounded-shape-min" />}
                        <ul className="mt-1 flex flex-col gap-0.5">
                          {shown.map((e) => {
                            const time = e.allDay || !isSameDay(e.start, day) ? '' : timeFmt.format(e.start);
                            return <li key={e.id}>{eventNode(e, cn(chip, tones[e.tone ?? 'primary']), timed(time, e.title))}</li>;
                          })}
                        </ul>
                        {hidden > 0 &&
                          (onDayClick ? (
                            <button
                              type="button"
                              className="min-h-6 px-1.5 text-label-md text-[var(--color-on-surface-variant)] hover:underline"
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
          {state != null && <div className="flex flex-col">{state}</div>}
        </>
      )}
    </div>
  );
}

/** Day view: all-day events in a strip, timed ones on an hour grid in start order. */
function DayGrid({
  day,
  events,
  now,
  busy,
  allDayLabel,
  hourFmt,
  timeFmt,
  renderEvent,
}: {
  day: Date;
  events: CalendarEvent[];
  /** Set when `day` is today. */
  now: Date | undefined;
  busy: boolean | undefined;
  allDayLabel: string;
  hourFmt: Intl.DateTimeFormat;
  timeFmt: Intl.DateTimeFormat;
  renderEvent: (e: CalendarEvent, time: string, cls: string) => React.ReactNode;
}) {
  const dayStart = startOfDay(day).getTime();
  const minutes = (d: Date) => Math.min(1440, Math.max(0, (d.getTime() - dayStart) / MINUTE));
  const allDay: CalendarEvent[] = [];
  const spans: { e: CalendarEvent; from: number; to: number; time: string }[] = [];
  for (const e of events) {
    const from = minutes(e.start);
    // No end: an hour. Too short to hold its label: the minimum.
    const to = Math.max(e.end ? minutes(e.end) : from + 60, from + MIN_EVENT);
    if (e.allDay || (from === 0 && to >= 1440)) allDay.push(e);
    else {
      const end = e.end && new Date(Math.min(e.end.getTime(), dayStart + 1440 * MINUTE));
      const start = new Date(Math.max(e.start.getTime(), dayStart));
      // Two formats joined here, not formatRange: Node and browsers space a range differently,
      // which breaks hydration.
      spans.push({ e, from: Math.min(from, 1440 - MIN_EVENT), to: Math.min(to, 1440), time: end ? `${timeFmt.format(start)} – ${timeFmt.format(end)}` : timeFmt.format(start) });
    }
  }
  const nowAt = now ? minutes(now) : undefined;
  // ponytail: no scroll container. The grid shows 08:00–18:00, stretched to hold every event and "now".
  const marks = [...spans.flatMap((s) => [s.from, s.to]), ...(nowAt === undefined ? [] : [nowAt])];
  const firstHour = Math.min(8, ...marks.map((m) => Math.floor(m / 60)));
  const lastHour = Math.max(18, ...marks.map((m) => Math.ceil(m / 60)));
  const total = (lastHour - firstHour) * 60;
  const at = (m: number) => pct((m - firstHour * 60) / total);
  // A column, so the label sits at the top of a tall event instead of a button's vertical centre.
  const chip = 'flex size-full flex-col overflow-hidden rounded-shape-min px-1.5 py-0.5 text-start text-label-md';

  return (
    <div aria-busy={busy} className="flex flex-col gap-2">
      {allDay.length > 0 && (
        <ul aria-label={allDayLabel} className="flex flex-col gap-0.5">
          {allDay.map((e) => (
            <li key={e.id}>{renderEvent(e, '', 'block w-full truncate rounded-shape-min px-1.5 py-0.5 text-start text-label-md')}</li>
          ))}
        </ul>
      )}
      <div className="relative">
        {Array.from({ length: lastHour - firstHour }, (_, i) => (
          <div key={i} aria-hidden="true" className="h-12 border-t border-[var(--color-outline-variant)]">
            <span className="block w-12 pt-0.5 text-label-sm tabular-nums text-[var(--color-on-surface-muted)]">
              {hourFmt.format(new Date(dayStart + (firstHour + i) * 60 * MINUTE))}
            </span>
          </div>
        ))}
        {busy && <Skeleton shape="rect" className="absolute inset-y-1 start-12 end-0 rounded-shape-min" />}
        <ul className="absolute inset-y-0 start-12 end-0">
          {dayColumns(spans).map(({ e, from, to, time, col, cols }) => (
            <li
              key={e.id}
              ref={place({ top: at(from), height: pct((to - from) / total), insetInlineStart: pct(col / cols), width: pct(1 / cols) })}
              className="absolute p-px"
            >
              {renderEvent(e, time, chip)}
            </li>
          ))}
        </ul>
        {nowAt !== undefined && (
          <div
            ref={place({ top: at(nowAt) })}
            data-now=""
            aria-hidden="true"
            className="pointer-events-none absolute start-12 end-0 border-t-2 border-[var(--color-error)]"
          />
        )}
      </div>
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
