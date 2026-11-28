import * as React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { ChevronLeft, ChevronRight } from '@nexub/icons/native';
import { useControllableState } from '../hooks/useControllableState';
import { Pressable } from '../primitives/Pressable';
import { Text } from '../primitives/Text';
import { useTheme, type RoleName } from '../theme/ThemeProvider';
import { Button, IconButton } from './actions';
import { eventColors } from './eventColor';
import { Skeleton } from './feedback';
import { SegmentedControl } from './inputs';

// 12.5: the native twin of web EventCalendar, with its two phone-sized views: `day` (one day
// by the hour) and `agenda` (the month's events as a list). Same event shape, prop names and
// 12.2 `color`; month and week grids stay web only (too dense for a phone).

/** The views native draws. Web also has `month` and `week`. */
export type EventCalendarView = 'day' | 'agenda';
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
  /**
   * Any brand colour (hex, rgb(), hsl(), oklab(), oklch()), e.g. one per company. The container is
   * mixed from it into the surface and its text picked for 4.5:1, in light and dark. Wins over `tone`;
   * a colour that can't be read keeps the tone (with a warning in development).
   */
  color?: string;
  /** Web only today (moving events); accepted so the same events work on both. */
  editable?: boolean;
}

export interface EventCalendarLegendItem {
  label: string;
  tone: EventTone;
  /** Matches events with the same `color`; wins over `tone`. */
  color?: string;
}

export interface EventCalendarProps {
  events: CalendarEvent[];
  /** Any day inside the shown day or month. */
  date?: Date;
  defaultDate?: Date;
  onDateChange?: (date: Date) => void;
  view?: EventCalendarView;
  /** @default 'agenda' */
  defaultView?: EventCalendarView;
  onViewChange?: (view: EventCalendarView) => void;
  /** Views offered in the switcher; the current view is always offered. One view hides the switcher. @default ['day', 'agenda'] */
  views?: EventCalendarView[];
  /** The current time: marks today and draws the "now" line in day view. Pass a fixed date in tests and screenshots. @default new Date() */
  now?: Date;
  onEventClick?: (event: CalendarEvent) => void;
  /** A day's heading in agenda view. */
  onDayClick?: (date: Date) => void;
  /** A per-day slot, e.g. a small add button: above the day view and beside each agenda day. */
  renderDayAction?: (date: Date) => React.ReactNode;
  /** Controls for one event, e.g. a menu button, beside it. */
  eventActions?: (event: CalendarEvent) => React.ReactNode;
  /** A row under the toolbar naming what each tone means. */
  legend?: EventCalendarLegendItem[];
  /** Placeholders in place of the events while they load. */
  loading?: boolean;
  /** Shown when no event falls in the shown day (or month, in agenda view). */
  emptyState?: React.ReactNode;
  /** Shown in place of the events when set (a failed load). */
  errorState?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const DAY = 86_400_000;
const MINUTE = 60_000;
/** Day view: the shortest box an event gets (minutes), so its one line of text fits. */
const MIN_EVENT = 30;
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const endOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n, d.getHours(), d.getMinutes());
const addMonths = (d: Date, n: number) => {
  // Clamp to the last day of the target month (31 Jan + 1 month = 28/29 Feb).
  const last = new Date(d.getFullYear(), d.getMonth() + n + 1, 0).getDate();
  return new Date(d.getFullYear(), d.getMonth() + n, Math.min(d.getDate(), last));
};
const isSameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/** Side-by-side columns for overlapping events (sorted by start), as web. */
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

/** An event's container, text and marker colours: its `color` when readable, else its tone's roles. */
function usePaint() {
  const { roles, scheme } = useTheme();
  return (e: { tone?: EventTone; color?: string }) => {
    const custom = e.color ? eventColors(e.color, roles.surface, scheme) : null;
    if (custom) return { bg: custom.container, fg: custom.onContainer, dot: custom.marker };
    const tone = e.tone ?? 'primary';
    return { bg: roles[`${tone}-container` as RoleName], fg: roles[`on-${tone}-container` as RoleName], dot: roles[tone] };
  };
}

/** One day by the hour, or the month's events as a list (web EventCalendar's `day` and `agenda` views on mobile). */
export function EventCalendar({
  events,
  date: dateProp,
  defaultDate,
  onDateChange,
  view: viewProp,
  defaultView = 'agenda',
  onViewChange,
  views = ['day', 'agenda'],
  now,
  onEventClick,
  onDayClick,
  renderDayAction,
  eventActions,
  legend,
  loading = false,
  emptyState,
  errorState,
  style,
  testID,
}: EventCalendarProps) {
  const { roles, tokens, messages, locale, dir } = useTheme();
  const paint = usePaint();
  const s = tokens.spacing;
  const [date = new Date(), setDate] = useControllableState<Date>({
    value: dateProp,
    defaultValue: defaultDate ?? new Date(),
    onChange: onDateChange,
  });
  const [view = 'agenda', setView] = useControllableState<EventCalendarView>({
    value: viewProp,
    defaultValue: defaultView,
    onChange: onViewChange,
  });
  const oneDay = view === 'day';
  const first = oneDay ? startOfDay(date) : new Date(date.getFullYear(), date.getMonth(), 1);
  const last = oneDay ? endOfDay(date) : endOfDay(new Date(date.getFullYear(), date.getMonth() + 1, 0));
  const sorted = React.useMemo(() => [...events].sort((a, b) => a.start.getTime() - b.start.getTime()), [events]);
  const eventsOn = (day: Date) => sorted.filter((e) => e.start <= endOfDay(day) && (e.end ?? e.start) >= startOfDay(day));
  const inRange = sorted.some((e) => e.start <= last && (e.end ?? e.start) >= first);

  const fmt = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(locale, o);
  const timeFmt = fmt({ hour: 'numeric', minute: '2-digit' });
  const fullFmt = fmt({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const title = oneDay ? fullFmt.format(date) : fmt({ month: 'long', year: 'numeric' }).format(date);
  const today = now ?? new Date();
  const step = (n: number) => setDate(oneDay ? addDays(date, n) : addMonths(date, n));
  const [previous, next] = oneDay ? [messages.previousDay, messages.nextDay] : [messages.previousMonth, messages.nextMonth];
  const [Back, Forward] = dir === 'rtl' ? [ChevronRight, ChevronLeft] : [ChevronLeft, ChevronRight];
  const offered = views.includes(view) ? views : [...views, view];
  const viewLabels: Record<EventCalendarView, string> = { day: messages.dayView, agenda: messages.agendaView };

  /** An event: a button when `onEventClick` is set, else one text element. Its actions sit beside it. */
  const eventNode = (e: CalendarEvent, when: string, box: ViewStyle, lines?: number) => {
    const { bg, fg } = paint(e);
    const label = when ? `${e.title}, ${when}` : e.title;
    const content = (
      <Text variant="label-md" numberOfLines={lines} style={{ color: fg }}>
        {when ? <Text variant="label-md" tabular style={{ color: fg, opacity: 0.8 }}>{`${when}  `}</Text> : null}
        {e.title}
      </Text>
    );
    const style: ViewStyle = { backgroundColor: bg, borderRadius: tokens.shape.min, paddingHorizontal: s['1-5'], paddingVertical: s['0-5'], ...box };
    const node = onEventClick ? (
      <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={() => onEventClick(e)} pressScale={false} style={style}>
        {content}
      </Pressable>
    ) : (
      <View accessible accessibilityLabel={label} style={style}>
        {content}
      </View>
    );
    const actions = eventActions?.(e);
    if (actions == null) return node;
    return (
      <View style={{ flexDirection: 'row', alignItems: box.flex ? 'stretch' : 'center', gap: s[1], flex: box.flex }}>
        <View style={{ flex: 1, minWidth: 0 }}>{node}</View>
        {actions}
      </View>
    );
  };

  const empty = !loading && !inRange && emptyState != null && (
    <View style={{ paddingVertical: s[4] }}>
      {typeof emptyState === 'string' ? (
        <Text variant="body-md" color="on-surface-muted" style={{ textAlign: 'center' }}>
          {emptyState}
        </Text>
      ) : (
        emptyState
      )}
    </View>
  );

  let body: React.ReactNode;
  if (errorState != null) {
    body = errorState;
  } else if (oneDay) {
    const dayStart = first.getTime();
    const minutes = (d: Date) => Math.min(1440, Math.max(0, (d.getTime() - dayStart) / MINUTE));
    const allDay: CalendarEvent[] = [];
    const spans: { e: CalendarEvent; from: number; to: number; when: string }[] = [];
    for (const e of loading ? [] : eventsOn(first)) {
      const from = minutes(e.start);
      const to = Math.max(e.end ? minutes(e.end) : from + 60, from + MIN_EVENT);
      if (e.allDay || (from === 0 && to >= 1440)) allDay.push(e);
      else {
        const end = e.end && new Date(Math.min(e.end.getTime(), dayStart + DAY));
        const start = new Date(Math.max(e.start.getTime(), dayStart));
        spans.push({ e, from: Math.min(from, 1440 - MIN_EVENT), to: Math.min(to, 1440), when: end ? `${timeFmt.format(start)} – ${timeFmt.format(end)}` : timeFmt.format(start) });
      }
    }
    const nowAt = isSameDay(first, today) ? minutes(today) : undefined;
    // 08:00–18:00, stretched to hold every event and "now" (as web); the page scrolls, not the grid.
    const marks = [...spans.flatMap((x) => [x.from, x.to]), ...(nowAt === undefined ? [] : [nowAt])];
    const firstHour = Math.min(8, ...marks.map((m) => Math.floor(m / 60)));
    const lastHour = Math.max(18, ...marks.map((m) => Math.ceil(m / 60)));
    const hour = s[12];
    const gutter = s[12];
    const y = (m: number) => ((m - firstHour * 60) / 60) * hour;
    const hourFmt = fmt({ hour: 'numeric' });
    body = (
      <View style={{ gap: s[2] }} accessibilityState={{ busy: loading }}>
        {renderDayAction && <View style={{ alignItems: 'flex-end' }}>{renderDayAction(first)}</View>}
        {allDay.length > 0 && (
          <View accessibilityLabel={messages.allDay} style={{ gap: s['0-5'] }}>
            {allDay.map((e) => (
              <React.Fragment key={e.id}>{eventNode(e, messages.allDay, {}, 1)}</React.Fragment>
            ))}
          </View>
        )}
        <View style={{ height: (lastHour - firstHour) * hour }}>
          {Array.from({ length: lastHour - firstHour }, (_, i) => (
            <View
              key={i}
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
              style={{ height: hour, borderTopWidth: 1, borderTopColor: roles['outline-variant'] }}
            >
              <Text variant="label-sm" color="on-surface-muted" tabular style={{ width: gutter, paddingTop: s['0-5'] }}>
                {hourFmt.format(new Date(dayStart + (firstHour + i) * 60 * MINUTE))}
              </Text>
            </View>
          ))}
          {loading && (
            <View style={{ position: 'absolute', top: s[1], bottom: s[1], start: gutter, end: 0 }}>
              <Skeleton height={(lastHour - firstHour) * hour - s[2]} radius={tokens.shape.min} />
            </View>
          )}
          <View style={{ position: 'absolute', top: 0, bottom: 0, start: gutter, end: 0 }}>
            {dayColumns(spans).map(({ e, from, to, when, col, cols }) => (
              <View
                key={e.id}
                style={{ position: 'absolute', top: y(from), height: y(to) - y(from), start: `${(col / cols) * 100}%`, width: `${100 / cols}%`, padding: 1 }}
              >
                {eventNode(e, when, { flex: 1, overflow: 'hidden' })}
              </View>
            ))}
          </View>
          {nowAt !== undefined && (
            <View
              testID={testID ? `${testID}-now` : undefined}
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
              pointerEvents="none"
              style={{ position: 'absolute', top: y(nowAt), start: gutter, end: 0, borderTopWidth: s['0-5'], borderTopColor: roles.error }}
            />
          )}
        </View>
        {empty}
      </View>
    );
  } else {
    const days: Date[] = [];
    for (let d = first; d <= last; d = addDays(d, 1)) days.push(d);
    body = (
      <View style={{ gap: s[4] }} accessibilityState={{ busy: loading }}>
        {loading &&
          [0, 1, 2].map((i) => <Skeleton key={i} height={s[10]} radius={tokens.shape.min} />)}
        {!loading &&
          days.map((d) => {
            const list = eventsOn(d);
            if (!list.length) return null;
            const isToday = isSameDay(d, today);
            const label = isToday ? messages.todayDate(fullFmt.format(d)) : fullFmt.format(d);
            const heading = (
              <Text variant="label-lg" color={isToday ? 'primary' : 'on-surface-variant'} style={{ flex: 1 }}>
                {fullFmt.format(d)}
              </Text>
            );
            return (
              <View key={d.toISOString()}>
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: s[2], paddingBottom: s[1], borderBottomWidth: 1, borderBottomColor: roles['outline-variant'] }}
                >
                  {onDayClick ? (
                    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={() => onDayClick(d)} pressScale={false} style={{ flex: 1 }}>
                      {heading}
                    </Pressable>
                  ) : (
                    <View accessible accessibilityRole="header" accessibilityLabel={label} style={{ flex: 1 }}>
                      {heading}
                    </View>
                  )}
                  {renderDayAction?.(d)}
                </View>
                {list.map((e) => {
                  const { dot } = paint(e);
                  const when = e.allDay || !isSameDay(e.start, d) ? messages.allDay : timeFmt.format(e.start);
                  const row = (
                    <>
                      <View style={{ width: s[2], height: s[2], borderRadius: s[1], backgroundColor: dot }} />
                      <Text variant="body-sm" color="on-surface-variant" tabular style={{ width: s[16] }}>
                        {when}
                      </Text>
                      <Text variant="body-sm" numberOfLines={1} style={{ flex: 1 }}>
                        {e.title}
                      </Text>
                    </>
                  );
                  const rowStyle: ViewStyle = { flex: 1, minHeight: s[11], flexDirection: 'row', alignItems: 'center', gap: s[3], paddingHorizontal: s[1] };
                  const actions = eventActions?.(e);
                  return (
                    <View key={e.id} style={{ flexDirection: 'row', alignItems: 'center', gap: s[1] }}>
                      {onEventClick ? (
                        <Pressable accessibilityRole="button" accessibilityLabel={`${e.title}, ${when}`} onPress={() => onEventClick(e)} pressScale={false} style={rowStyle}>
                          {row}
                        </Pressable>
                      ) : (
                        <View accessible accessibilityLabel={`${e.title}, ${when}`} style={rowStyle}>
                          {row}
                        </View>
                      )}
                      {actions}
                    </View>
                  );
                })}
              </View>
            );
          })}
        {empty}
      </View>
    );
  }

  return (
    <View testID={testID} style={[{ gap: s[3] }, style]}>
      <View style={{ gap: s[2] }}>
        <Text variant="title-lg" accessibilityRole="header" accessibilityLiveRegion="polite">
          {title}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: s[1] }}>
          <Button variant="outlined" size="sm" onPress={() => setDate(now ?? new Date())}>
            {messages.today}
          </Button>
          <IconButton icon={Back} label={previous} size="sm" onPress={() => step(-1)} />
          <IconButton icon={Forward} label={next} size="sm" onPress={() => step(1)} />
          <View style={{ flex: 1 }} />
          {offered.length > 1 && (
            <SegmentedControl
              label={messages.calendarView}
              options={offered.map((v) => ({ value: v, label: viewLabels[v] }))}
              value={view}
              onValueChange={setView}
            />
          )}
        </View>
      </View>
      {legend && legend.length > 0 && (
        <View accessibilityLabel={messages.calendarLegend} style={{ flexDirection: 'row', flexWrap: 'wrap', columnGap: s[4], rowGap: s[1] }}>
          {legend.map((l) => (
            <View key={l.label} style={{ flexDirection: 'row', alignItems: 'center', gap: s['1-5'] }}>
              <View style={{ width: s['2-5'], height: s['2-5'], borderRadius: s['2-5'] / 2, backgroundColor: paint(l).dot }} />
              <Text variant="label-md" color="on-surface-variant">
                {l.label}
              </Text>
            </View>
          ))}
        </View>
      )}
      {body}
    </View>
  );
}
