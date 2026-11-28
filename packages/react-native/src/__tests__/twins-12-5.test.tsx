// 12.5: native twins for Kanban (read-only and move), EventCalendar (day, agenda) and the line and bar charts.
import * as React from 'react';
import { ActionSheetIOS, Text as RNText, processColor } from 'react-native';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { Kanban, NexubNativeProvider, type KanbanColumn } from '../index';
import { EventCalendar, type CalendarEvent } from '../calendar';
import { BarChart, LineChart } from '../charts';

jest.mock('expo-haptics', () => ({
  selectionAsync: jest.fn(() => Promise.resolve()),
  impactAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: {},
  NotificationFeedbackType: {},
  AndroidHaptics: {},
}));

type Wrap = { scheme?: 'light' | 'dark'; dir?: 'ltr' | 'rtl'; product?: 'payub' };
let theme: { roles: { [k: string]: string }; colors: { spot: string } } | null = null;
function Grab() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  theme = require('../theme/ThemeProvider').useTheme();
  return null;
}
const wrap = (ui: React.ReactElement, { scheme = 'light', dir, product }: Wrap = {}) =>
  render(
    <NexubNativeProvider scheme={scheme} contrast="standard" locale="en-US" dir={dir} product={product}>
      <Grab />
      {ui}
    </NexubNativeProvider>,
  );
type Node = { type: string; props: Record<string, unknown>; children: (Node | string)[] | null };
const nodes = (n: unknown = screen.toJSON()): Node[] => {
  if (!n || typeof n !== 'object') return [];
  if (Array.isArray(n)) return n.flatMap((c) => nodes(c));
  const node = n as Node;
  return [node, ...nodes(node.children)];
};
const flat = (n: { props: Record<string, unknown> }) => Object.assign({}, ...[n.props.style].flat(Infinity as 1).filter(Boolean)) as Record<string, unknown>;
const t = (s: string) => <RNText>{s}</RNText>;
const all = { includeHiddenElements: true };

// ─── Kanban ──────────────────────────────────────────────────────────────────

type Task = { id: string; name: string; tone?: 'danger' };
const board = (): KanbanColumn<Task>[] => [
  { id: 'todo', title: 'To do', items: [{ id: 'a', name: 'Alpha', tone: 'danger' }, { id: 'b', name: 'Bravo' }] },
  { id: 'doing', title: 'Doing', items: [] },
  { id: 'done', title: 'Done', items: [{ id: 'c', name: 'Charlie' }] },
];
const kanban = (props: Partial<React.ComponentProps<typeof Kanban<Task>>> = {}) => (
  <Kanban<Task>
    testID="board"
    columns={board()}
    getId={(x) => x.id}
    getLabel={(x) => x.name}
    onChange={() => {}}
    renderCard={(x) => t(x.name)}
    {...props}
  />
);

describe('Kanban', () => {
  it('draws each column with a header and count, and each card named with its column', async () => {
    await wrap(kanban());
    expect(screen.getByRole('header', { name: /To do/ })).toBeTruthy();
    expect(screen.getByText('Charlie')).toBeTruthy();
    expect(screen.getByLabelText('Alpha, To do')).toBeTruthy();
    expect(screen.getByLabelText('Charlie, Done')).toBeTruthy();
  });

  it('offers "Move to <column>" screen-reader actions for every other column, and moving calls onChange like web', async () => {
    const onChange = jest.fn();
    await wrap(kanban({ onChange }));
    const card = screen.getByLabelText('Bravo, To do');
    expect((card.props.accessibilityActions as { label: string }[]).map((a) => a.label)).toEqual(['Move to Doing', 'Move to Done']);
    await act(() => card.props.onAccessibilityAction({ nativeEvent: { actionName: 'column:done' } }));
    const [columns, move] = onChange.mock.lastCall!;
    expect(columns.map((c: KanbanColumn<Task>) => c.items.map((x) => x.id))).toEqual([['a'], [], ['c', 'b']]);
    expect(move).toEqual({ item: { id: 'b', name: 'Bravo' }, from: { columnId: 'todo' }, to: { columnId: 'done' } });
  });

  it('the move button opens a sheet listing the columns; picking one moves the card', async () => {
    const show = jest.spyOn(ActionSheetIOS, 'showActionSheetWithOptions').mockImplementation(() => {});
    const onChange = jest.fn();
    await wrap(kanban({ onChange }));
    await fireEvent.press(screen.getByRole('button', { name: 'Move Alpha', ...all }));
    const [opts, pick] = show.mock.lastCall!;
    expect(opts).toMatchObject({ title: 'Alpha', message: 'Move to…', options: ['Doing', 'Done', 'Cancel'] });
    await act(() => pick(0));
    expect(onChange.mock.lastCall![1].to).toEqual({ columnId: 'doing' });
    show.mockRestore();
  });

  it('canMove leaves refused columns out; drop targets come after the columns', async () => {
    const onDrop = jest.fn();
    const onChange = jest.fn();
    await wrap(
      kanban({
        onChange,
        canMove: ({ to }) => to.columnId !== 'done',
        dropTargets: [{ id: 'archive', label: 'Archive', onDrop }],
      }),
    );
    const card = screen.getByLabelText('Bravo, To do');
    expect((card.props.accessibilityActions as { label: string }[]).map((a) => a.label)).toEqual(['Move to Doing', 'Archive']);
    await act(() => card.props.onAccessibilityAction({ nativeEvent: { actionName: 'target:archive' } }));
    expect(onDrop).toHaveBeenCalledWith({ id: 'b', name: 'Bravo' }, { columnId: 'todo' });
    expect(onChange.mock.lastCall![0][0].items.map((x: Task) => x.id)).toEqual(['a']);
  });

  it('readOnly: no move button and no actions', async () => {
    await wrap(kanban({ readOnly: true }));
    expect(screen.queryByRole('button', { name: 'Move Alpha', ...all })).toBeNull();
    expect(screen.getByLabelText('Alpha, To do').props.accessibilityActions).toEqual([]);
  });

  it('getTone draws a start edge in the tone role', async () => {
    await wrap(kanban({ getTone: (x) => x.tone }));
    const style = flat(screen.getByLabelText('Alpha, To do'));
    expect(style.borderStartColor).toBe(theme!.roles.error);
    expect(flat(screen.getByLabelText('Bravo, To do')).borderStartWidth).toBeUndefined();
  });

  it('shows the column empty state, the board empty state, loading and error', async () => {
    await wrap(kanban({ columnEmptyState: 'Nothing here' }));
    expect(screen.getByText('Nothing here')).toBeTruthy();
    await screen.unmount();
    await wrap(kanban({ columns: [{ id: 'x', title: 'X', items: [] }] }));
    expect(screen.getByText('Nothing here yet')).toBeTruthy();
    await screen.unmount();
    await wrap(kanban({ loading: true }));
    expect(screen.getByTestId('board').props.accessibilityState).toEqual({ busy: true });
    expect(screen.queryByText('Alpha')).toBeNull();
    await screen.unmount();
    await wrap(kanban({ errorState: t('Could not load') }));
    expect(screen.getByText('Could not load')).toBeTruthy();
  });
});

// ─── EventCalendar ───────────────────────────────────────────────────────────

const now = new Date(2026, 10, 2, 10, 30);
const events: CalendarEvent[] = [
  { id: '1', title: 'Stand-up', start: new Date(2026, 10, 2, 9), end: new Date(2026, 10, 2, 9, 15) },
  { id: '2', title: 'Offsite', start: new Date(2026, 10, 2), allDay: true, tone: 'success' },
  { id: '3', title: 'Acme call', start: new Date(2026, 10, 5, 14), color: '#7c3aed' },
];

describe('EventCalendar', () => {
  it('agenda (the default) lists the month by day; today is named as today', async () => {
    await wrap(<EventCalendar events={events} now={now} defaultDate={now} />);
    expect(screen.getByText('November 2026')).toBeTruthy();
    expect(screen.getByRole('header', { name: 'Today, Monday, November 2, 2026' })).toBeTruthy();
    expect(screen.getByLabelText('Stand-up, 9:00 AM')).toBeTruthy();
    expect(screen.getByLabelText('Offsite, All day')).toBeTruthy();
    expect(screen.getByLabelText('Acme call, 2:00 PM')).toBeTruthy();
  });

  it('day view: all-day strip, timed events with their range, and the now line today', async () => {
    await wrap(<EventCalendar testID="cal" events={events} now={now} defaultDate={now} defaultView="day" />);
    expect(screen.getByText('Monday, November 2, 2026')).toBeTruthy();
    expect(screen.getByLabelText('Offsite, All day')).toBeTruthy();
    expect(screen.getByLabelText('Stand-up, 9:00 AM – 9:15 AM')).toBeTruthy();
    expect(screen.queryByText('Acme call')).toBeNull();
    expect(screen.getByTestId('cal-now', all)).toBeTruthy();
  });

  it('navigates by day or month and switches views (controlled callbacks fire)', async () => {
    const onDateChange = jest.fn();
    const onViewChange = jest.fn();
    await wrap(<EventCalendar events={events} now={now} defaultDate={now} defaultView="day" onDateChange={onDateChange} onViewChange={onViewChange} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Go to next day' }));
    expect(screen.getByText('Tuesday, November 3, 2026')).toBeTruthy();
    expect(onDateChange).toHaveBeenLastCalledWith(new Date(2026, 10, 3, 10, 30));
    await fireEvent.press(screen.getByRole('button', { name: 'Today' }));
    expect(screen.getByText('Monday, November 2, 2026')).toBeTruthy();
    await fireEvent.press(screen.getByRole('tab', { name: 'Agenda' }));
    expect(onViewChange).toHaveBeenCalledWith('agenda');
    await fireEvent.press(screen.getByRole('button', { name: 'Go to previous month' }));
    expect(screen.getByText('October 2026')).toBeTruthy();
  });

  it('one view hides the switcher', async () => {
    await wrap(<EventCalendar events={events} now={now} defaultDate={now} views={['agenda']} />);
    expect(screen.queryByRole('tab', { name: 'Day' })).toBeNull();
  });

  it('color (12.2) mixes a readable container; an unreadable colour keeps the tone with a warning', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    await wrap(
      <EventCalendar
        events={[...events, { id: '4', title: 'Bad', start: new Date(2026, 10, 2, 11), color: 'nope', tone: 'warning' }]}
        now={now}
        defaultDate={now}
        defaultView="day"
      />,
    );
    const bad = flat(screen.getByLabelText('Bad, 11:00 AM'));
    expect(bad.backgroundColor).toBe(theme!.roles['warning-container']);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("can't read the colour"));
    warn.mockRestore();
    await screen.unmount();
    await wrap(<EventCalendar events={events} now={now} defaultDate={new Date(2026, 10, 5)} defaultView="day" />);
    const acme = flat(screen.getByLabelText('Acme call, 2:00 PM'));
    expect(acme.backgroundColor).toMatch(/^#[0-9a-f]{6}$/);
    expect(acme.backgroundColor).not.toBe(theme!.roles['primary-container']);
  });

  it('onEventClick makes events buttons; legend, renderDayAction and eventActions render', async () => {
    const onEventClick = jest.fn();
    await wrap(
      <EventCalendar
        events={events}
        now={now}
        defaultDate={now}
        onEventClick={onEventClick}
        legend={[{ label: 'Acme', tone: 'primary', color: '#7c3aed' }]}
        renderDayAction={() => t('add')}
        eventActions={(e) => t(`menu ${e.id}`)}
      />,
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Stand-up, 9:00 AM' }));
    expect(onEventClick).toHaveBeenCalledWith(events[0]);
    expect(screen.getByLabelText('Legend')).toBeTruthy();
    expect(screen.getAllByText('add').length).toBe(2);
    expect(screen.getByText('menu 3')).toBeTruthy();
  });

  it('emptyState shows when nothing falls in the range; loading and error replace the events', async () => {
    await wrap(<EventCalendar events={[]} now={now} defaultDate={now} emptyState="No events" />);
    expect(screen.getByText('No events')).toBeTruthy();
    await screen.unmount();
    await wrap(<EventCalendar events={events} now={now} defaultDate={now} loading />);
    expect(screen.queryByText('Stand-up')).toBeNull();
    await screen.unmount();
    await wrap(<EventCalendar events={events} now={now} defaultDate={now} errorState={t('Failed')} />);
    expect(screen.getByText('Failed')).toBeTruthy();
  });

  it('mirrors the arrows in RTL', async () => {
    await wrap(<EventCalendar events={[]} now={now} defaultDate={now} />, { dir: 'rtl' });
    expect(screen.getByRole('button', { name: 'Go to previous month' })).toBeTruthy();
  });
});

// ─── Charts ──────────────────────────────────────────────────────────────────

const sales = [
  { month: 'Jan', revenue: 100, cost: 60 },
  { month: 'Feb', revenue: 120, cost: null },
  { month: 'Mar', revenue: 90, cost: 70 },
  { month: 'Apr', revenue: 150, cost: 80 },
];
const layout = async (testID: string, width = 300) => {
  await fireEvent(screen.getByTestId(`${testID}-plot`, all), 'layout', { nativeEvent: { layout: { width, height: 192 } } });
};
// react-native-svg stores a fill as a processed colour; compare through processColor.
const fills = () =>
  nodes()
    .filter((n) => n.type === 'RNSVGRect')
    .map((n) => JSON.stringify(n.props.fill));
const painted = (color: string | undefined) => fills().some((f) => f.includes(String(processColor(color))));

describe('LineChart and BarChart', () => {
  it('the chart is one image whose label summarises every row (missing values as —)', async () => {
    await wrap(<LineChart testID="c" title="Revenue" data={sales} index="month" series={[{ key: 'revenue', label: 'Revenue' }, { key: 'cost', label: 'Cost' }]} />);
    const img = screen.getByRole('image');
    expect(img.props.accessibilityLabel).toBe(
      'Revenue. Jan: Revenue 100, Cost 60. Feb: Revenue 120, Cost —. Mar: Revenue 90, Cost 70. Apr: Revenue 150, Cost 80',
    );
  });

  it('a missing value breaks the line into runs; a lone point is a dot', async () => {
    await wrap(<LineChart testID="c" title="Revenue" data={sales} index="month" series={[{ key: 'cost' }]} />);
    await layout('c');
    const kinds = nodes().map((n) => n.type);
    // Jan alone (a dot), then Mar–Apr (a line).
    expect(kinds.filter((k) => k === 'RNSVGCircle').length).toBe(1);
    expect(kinds.filter((k) => k === 'RNSVGPath' || k === 'RNSVGPolyline').length).toBeGreaterThanOrEqual(1);
  });

  it('change (12.3): a callout with the computed delta in the success colour, and it leads the summary', async () => {
    await wrap(<LineChart testID="c" title="Revenue" data={sales} index="month" series={[{ key: 'revenue' }]} change={{ from: 'Jan' }} />);
    const text = screen.getByText('Up 50% (+50) since Jan');
    expect(flat(text).color).toBe(theme!.roles.success);
    expect(screen.getByRole('image').props.accessibilityLabel).toMatch(/^Revenue\. Up 50% \(\+50\) since Jan\. Jan:/);
  });

  it('change with invert: a rise is bad', async () => {
    await wrap(<LineChart title="Churn" data={sales} index="month" series={[{ key: 'revenue' }]} change={{ from: 'Jan', invert: true }} />);
    expect(flat(screen.getByText('Up 50% (+50) since Jan')).color).toBe(theme!.roles.error);
  });

  it('referenceLines widen the axis to keep a target in view; annotations and lines are in the summary', async () => {
    await wrap(
      <BarChart
        testID="c"
        title="Revenue"
        data={sales}
        index="month"
        series={[{ key: 'revenue' }]}
        referenceLines={[{ value: 400, label: 'Target', tone: 'good' }, { value: 'Mar', axis: 'category', label: 'Launch' }]}
        annotations={[{ at: 'Feb', label: 'Promo', series: 'revenue' }, { at: 'Mar', to: 'Apr', label: 'Sale' }]}
      />,
    );
    await layout('c');
    expect(screen.getByText('500')).toBeTruthy();
    const label = screen.getByRole('image').props.accessibilityLabel as string;
    expect(label).toContain('Promo');
    expect(label).toContain('Sale');
    expect(label).toContain('Target');
    expect(label).toContain('Launch');
    expect(nodes().some((n) => n.type === 'RNSVGText' && JSON.stringify(n).includes('Target'))).toBe(true);
  });

  it('bars: one per value, missing values skipped; stacked keeps one column; colorOf repaints a bar', async () => {
    await wrap(<BarChart testID="c" title="Spend" data={sales} index="month" series={[{ key: 'revenue' }, { key: 'cost' }]} />);
    await layout('c');
    const rects = () => nodes().filter((n) => n.type === 'RNSVGRect');
    expect(rects().length).toBe(7);
    await screen.unmount();
    await wrap(
      <BarChart
        testID="c"
        title="Spend"
        data={sales}
        index="month"
        series={[{ key: 'revenue' }]}
        stacked
        colorOf={(row) => (row.revenue > 140 ? 'danger' : undefined)}
      />,
    );
    await layout('c');
    expect(painted(theme!.roles.error)).toBe(true);
  });

  it('keeps the product accent out of the series colours', async () => {
    await wrap(<BarChart testID="c" title="Spend" data={sales} index="month" series={[{ key: 'revenue' }, { key: 'cost' }]} />, { product: 'payub' });
    await layout('c');
    expect(fills().length).toBe(7);
    expect(painted(theme!.roles.primary)).toBe(false);
    expect(painted(theme!.colors.spot)).toBe(false);
    expect(painted(theme!.roles.tertiary)).toBe(false);
  });

  it('mirrors the plot in RTL: the first bar sits at the start (right) edge', async () => {
    const xs = async (dir: 'ltr' | 'rtl') => {
      await wrap(<BarChart testID="c" title="Spend" data={sales} index="month" series={[{ key: 'revenue' }]} />, { dir });
      await layout('c');
      const x = Number(nodes().find((n) => n.type === 'RNSVGRect')!.props.x);
      await screen.unmount();
      return x;
    };
    expect(await xs('ltr')).toBeLessThan(150);
    expect(await xs('rtl')).toBeGreaterThan(150);
  });

  it('data states: loading, empty and error take the plot', async () => {
    await wrap(<LineChart testID="c" title="Revenue" data={[]} index="month" series={[{ key: 'revenue' }]} />);
    expect(screen.getByText('Nothing here yet')).toBeTruthy();
    await screen.unmount();
    await wrap(<LineChart testID="c" title="Revenue" data={sales} index="month" series={[{ key: 'revenue' }]} loading />);
    expect(screen.getByTestId('c').props.accessibilityState).toEqual({ busy: true });
    await screen.unmount();
    await wrap(<LineChart title="Revenue" data={sales} index="month" series={[{ key: 'revenue' }]} errorState={t('Failed')} />);
    expect(screen.getByText('Failed')).toBeTruthy();
  });
});
