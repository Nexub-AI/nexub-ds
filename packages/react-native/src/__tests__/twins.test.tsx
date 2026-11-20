/* eslint-disable @typescript-eslint/no-require-imports -- jest mocks are loaded lazily inside factories */
// 10.9: native twins of the 10.7/10.8 web components: DescriptionList, ComparisonBar,
// PhoneInput, Countdown and the StatusSteps pattern.
import * as React from 'react';
import { AccessibilityInfo, AppState, type AppStateStatus } from 'react-native';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { native } from '@nexub/tokens/native';
import { Button, ComparisonBar, Countdown, DescriptionList, NexubNativeProvider, PhoneInput, Text, defaultMessages, useCountdown, useTheme, type Roles } from '../index';
import { StatusSteps } from '../patterns';

jest.mock('expo-haptics', () => ({
  selectionAsync: jest.fn(() => Promise.resolve()),
  impactAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: {},
  NotificationFeedbackType: {},
  AndroidHaptics: {},
}));

// The colours the provider resolved, read from inside it.
let roles: Roles;
function ReadRoles() {
  roles = useTheme().roles;
  return null;
}
const Provider = ({ children, locale = 'en-US' }: { children: React.ReactNode; locale?: string }) => (
  <NexubNativeProvider scheme="light" contrast="standard" locale={locale}>
    <ReadRoles />
    {children}
  </NexubNativeProvider>
);
const wrap = (ui: React.ReactElement) => render(<Provider>{ui}</Provider>);
type Node = { type: string; props: Record<string, unknown>; children: (Node | string)[] | null };
const nodes = (n: unknown = screen.toJSON()): Node[] => {
  if (!n || typeof n !== 'object') return [];
  if (Array.isArray(n)) return n.flatMap((c) => nodes(c));
  const node = n as Node;
  return [node, ...nodes(node.children)];
};
const style = (n: { props: Record<string, unknown> }) => Object.assign({}, ...[n.props.style].flat(Infinity as 1).filter(Boolean));
/** The rows of a DescriptionList, in order: the only views with vertical padding. */
const rows = () => nodes().filter((n) => n.type === 'View' && style(n).paddingVertical !== undefined);
const window = (width: number) =>
  jest.spyOn(require('react-native'), 'useWindowDimensions').mockReturnValue({ width, height: 900, scale: 2, fontScale: 1 });

afterEach(() => jest.restoreAllMocks());

describe('DescriptionList', () => {
  const list = (props: React.ComponentProps<typeof DescriptionList.Root> = {}) => (
    <DescriptionList.Root {...props}>
      <DescriptionList.Item label="Fee" helpText="Charged once">
        $1.00
      </DescriptionList.Item>
      <DescriptionList.Item label="Rate">0.9182</DescriptionList.Item>
      <DescriptionList.Item label="Total" emphasis>
        $251.00
      </DescriptionList.Item>
    </DescriptionList.Root>
  );

  it('inline: label and value on one row, the value at the end; each row reads as one element', async () => {
    await wrap(list());
    const row = rows()[0]!;
    expect(rows()).toHaveLength(3);
    expect(row.props.accessible).toBe(true);
    expect(style(row)).toMatchObject({ flexDirection: 'row' });
    expect(style(screen.getByText('$1.00'))).toMatchObject({ textAlign: 'right' });
    expect(screen.getByText('Charged once')).toBeTruthy();
  });

  it('stacked: label above the value, at the start', async () => {
    await wrap(list({ layout: 'stacked' }));
    expect(style(rows()[0]!)).toMatchObject({ flexDirection: 'column' });
    expect(style(screen.getByText('$1.00')).textAlign).toBeUndefined();
  });

  it('`align` overrides where the value sits', async () => {
    await wrap(
      <DescriptionList.Root>
        <DescriptionList.Item label="Note" align="start">
          Paid in cash
        </DescriptionList.Item>
      </DescriptionList.Root>,
    );
    expect(style(screen.getByText('Paid in cash')).textAlign).toBeUndefined();
  });

  it('emphasis: a rule above, stronger label; `size="sm"` tightens the rows', async () => {
    await wrap(list({ size: 'sm' }));
    expect(style(rows()[2]!)).toMatchObject({ borderTopWidth: 1, borderTopColor: roles.outline, paddingVertical: native.spacing[2] });
    expect(style(screen.getByText('Total')).color).toBe(roles['on-surface']);
    expect(style(screen.getByText('Fee')).color).toBe(roles['on-surface-muted']);
  });

  it('divided: a hairline under every row but the last', async () => {
    await wrap(list({ divided: true }));
    const lines = nodes().filter((n) => style(n).borderBottomWidth === 1);
    expect(lines).toHaveLength(2);
    expect(style(lines[0]!).borderBottomColor).toBe(roles['outline-variant']);
  });

  it('columns: one on phones, two from 600pt, never three', async () => {
    window(390);
    await wrap(list({ columns: 2 }));
    const cells = () => nodes().filter((n) => typeof style(n).width === 'string');
    expect(cells().map((c) => style(c).width)).toEqual(['100%', '100%', '100%']);
    window(820);
    await screen.rerender(<Provider>{list({ columns: 3, divided: true })}</Provider>);
    expect(cells().map((c) => style(c).width)).toEqual(['50%', '50%', '50%']);
    // In a grid every row keeps its hairline.
    expect(nodes().filter((n) => style(n).borderBottomWidth === 1)).toHaveLength(3);
    await screen.rerender(<Provider>{list({ columns: 1 })}</Provider>);
    expect(cells().map((c) => style(c).width)).toEqual(['100%', '100%', '100%']);
  });

  it('takes nodes for label and value, and then leaves them their own elements', async () => {
    await wrap(
      <DescriptionList.Root>
        <DescriptionList.Item label={<Text>Receipt</Text>} helpText={<Text>PDF</Text>}>
          <Button size="sm">Download</Button>
        </DescriptionList.Item>
      </DescriptionList.Root>,
    );
    expect(screen.getByRole('button', { name: 'Download' })).toBeTruthy();
    expect(rows()[0]!.props.accessible).toBeUndefined();
  });
});

describe('ComparisonBar', () => {
  const bar = (props: Partial<React.ComponentProps<typeof ComparisonBar>> = {}) => (
    <ComparisonBar label="Orders" left={{ label: 'This week', value: 30 }} right={{ label: 'Last week', value: 10 }} {...props} />
  );
  const grow = (id: string) => style(screen.getByTestId(id)).flexGrow;
  const fill = (id: string) => style(screen.getByTestId(id)).backgroundColor;

  it('is one image with the comparison as text', async () => {
    await wrap(bar({ valueFormat: (v) => `${v} orders` }));
    expect(screen.getByRole('image', { name: 'Orders: This week 30 orders, Last week 10 orders' })).toBeTruthy();
    expect(screen.getByText('30 orders')).toBeTruthy();
    await screen.rerender(<Provider>{bar({ accessibilityLabel: 'Orders are up' })}</Provider>);
    expect(screen.getByRole('image', { name: 'Orders are up' })).toBeTruthy();
  });

  it('splits the bar by share; the side behind is muted', async () => {
    await wrap(bar());
    expect(grow('comparison-bar-start')).toBe(75);
    expect(grow('comparison-bar-end')).toBe(25);
    expect(fill('comparison-bar-start')).toBe(roles.primary);
    expect(fill('comparison-bar-end')).toBe(roles.outline);
    expect(style(screen.getByText('10')).color).toBe(roles['on-surface-variant']);
  });

  it('a zero keeps a visible sliver; two zeros split evenly; negatives count as zero', async () => {
    await wrap(bar({ left: { label: 'A', value: 0 }, right: { label: 'B', value: 9 } }));
    expect(grow('comparison-bar-start')).toBe(4);
    // Fresh mounts: the bar starts at its resting split, and springs to later ones.
    await screen.unmount();
    await wrap(bar({ left: { label: 'A', value: 0 }, right: { label: 'B', value: 0 } }));
    expect(grow('comparison-bar-start')).toBe(50);
    expect(fill('comparison-bar-end')).toBe(roles.primary);
    await screen.unmount();
    await wrap(bar({ left: { label: 'A', value: -5 }, right: { label: 'B', value: 5 } }));
    expect(grow('comparison-bar-end')).toBe(96);
  });

  it('`highlight="none"` and identity colours keep both sides coloured', async () => {
    await wrap(bar({ highlight: 'none' }));
    expect(fill('comparison-bar-end')).toBe(roles.primary);
    await screen.rerender(<Provider>{bar({ left: { label: 'A', value: 1, color: 'blue' }, right: { label: 'B', value: 3, color: 'amber' } })}</Provider>);
    expect(fill('comparison-bar-start')).toBe(native.color.categories.light.blue.color);
    expect(fill('comparison-bar-end')).toBe(native.color.categories.light.amber.color);
  });

  it('hides the values or the side labels; `sm` is thinner', async () => {
    await wrap(bar({ showValues: false, showLabels: false, size: 'sm' }));
    expect(screen.queryByText('30')).toBeNull();
    expect(screen.queryByText('This week')).toBeNull();
    expect(nodes().some((n) => style(n).height === native.spacing['1-5'] && style(n).flexDirection === 'row')).toBe(true);
  });
});

describe('PhoneInput', () => {
  it('groups the national number as it is typed and reports E.164', async () => {
    const onValueChange = jest.fn();
    await wrap(<PhoneInput label="Phone" defaultCountry="IN" onValueChange={onValueChange} />);
    const input = screen.getByLabelText('Phone');
    expect(input.props).toMatchObject({ keyboardType: 'phone-pad', textContentType: 'telephoneNumber', autoComplete: 'tel' });
    await fireEvent.changeText(input, '98470');
    expect(onValueChange).toHaveBeenLastCalledWith('+9198470', { country: 'IN', national: '98470', valid: false });
    await fireEvent.changeText(input, '9847012345');
    expect(onValueChange).toHaveBeenLastCalledWith('+919847012345', { country: 'IN', national: '9847012345', valid: true });
    expect(screen.getByLabelText('Phone').props.value).toBe('98470 12345');
  });

  it('a pasted international number switches the country', async () => {
    const onValueChange = jest.fn();
    const onCountryChange = jest.fn();
    await wrap(<PhoneInput label="Phone" defaultCountry="IN" onValueChange={onValueChange} onCountryChange={onCountryChange} />);
    await fireEvent.changeText(screen.getByLabelText('Phone'), '+65 8123 4567');
    expect(onCountryChange).toHaveBeenCalledWith('SG');
    expect(onValueChange).toHaveBeenLastCalledWith('+6581234567', { country: 'SG', national: '81234567', valid: true });
    expect(screen.getByRole('button', { name: 'Country code, Singapore +65' })).toBeTruthy();
  });

  it('picks a country from the sheet and keeps the digits', async () => {
    const onValueChange = jest.fn();
    const onCountryChange = jest.fn();
    await wrap(<PhoneInput label="Phone" defaultValue="+919847012345" countries={['IN', 'SG', 'AE']} onValueChange={onValueChange} onCountryChange={onCountryChange} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Country code, India +91' }));
    expect(screen.getAllByRole('radio').map((r) => r.props.accessibilityLabel)).toEqual(['India +91', 'Singapore +65', 'United Arab Emirates +971']);
    await fireEvent.press(screen.getByRole('radio', { name: 'Singapore +65' }));
    expect(onCountryChange).toHaveBeenCalledWith('SG');
    expect(onValueChange).toHaveBeenLastCalledWith('+659847012345', { country: 'SG', national: '9847012345', valid: false });
  });

  it('the full list is sorted by name and can be searched by name or code', async () => {
    await wrap(<PhoneInput label="Phone" defaultCountry="US" />);
    await fireEvent.press(screen.getByRole('button', { name: 'Country code, United States +1' }));
    const names = () => screen.getAllByRole('radio').map((r) => String(r.props.accessibilityLabel));
    expect(names().length).toBeGreaterThan(200);
    expect(names()[0]).toBe('Afghanistan +93');
    await fireEvent.changeText(screen.getByRole('search'), 'united k');
    expect(names()).toEqual(['United Kingdom +44']);
    await fireEvent.changeText(screen.getByRole('search'), '+971');
    expect(names()).toEqual(['United Arab Emirates +971']);
  });

  it('a pasted number from outside a restricted list does not switch country', async () => {
    const onValueChange = jest.fn();
    await wrap(<PhoneInput label="Phone" countries={['IN', 'SG']} onValueChange={onValueChange} />);
    await fireEvent.changeText(screen.getByLabelText('Phone'), '+971501234567');
    expect(onValueChange.mock.calls.at(-1)![1]).toMatchObject({ country: 'IN', valid: false });
  });

  it('one country shows as text; controlled value and country; the locale picks the start', async () => {
    await wrap(<PhoneInput label="Phone" countries={['AE']} />);
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.getByLabelText('Country code, United Arab Emirates +971')).toBeTruthy();
    await screen.rerender(<Provider><PhoneInput label="Phone" value="+14155550123" country="CA" /></Provider>);
    expect(screen.getByLabelText('Phone').props.value).toBe('415 555 0123');
    expect(screen.getByRole('button', { name: 'Country code, Canada +1' })).toBeTruthy();
    await screen.unmount();
    await render(<Provider locale="en-GB"><PhoneInput label="Mobile" /></Provider>);
    expect(screen.getByRole('button', { name: 'Country code, United Kingdom +44' })).toBeTruthy();
  });

  it('disabled and read-only fields do not open the list; `error` and `invalid` mark the field', async () => {
    await wrap(<PhoneInput label="Phone" defaultCountry="IN" readOnly invalid />);
    expect(screen.getByRole('button', { name: 'Country code, India +91' }).props.accessibilityState).toMatchObject({ disabled: true });
    expect(screen.getByLabelText('Phone').props['aria-invalid']).toBe(true);
    await screen.rerender(<Provider><PhoneInput label="Phone" defaultCountry="IN" error="Enter a valid number" /></Provider>);
    expect(screen.getByText('Enter a valid number')).toBeTruthy();
    expect(screen.getByLabelText('Phone').props['aria-invalid']).toBe(true);
  });
});

describe('Countdown', () => {
  let clock = 0;
  const now = () => clock;
  let announce: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    clock = 1_000_000;
    announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility').mockImplementation(() => {});
    announce.mockClear();
  });
  afterEach(() => jest.useRealTimers());
  const tick = (ms: number) =>
    act(() => {
      clock += ms;
      jest.advanceTimersByTime(ms);
    });

  it('shows the time left on the first render and ticks once a second', async () => {
    await wrap(<Countdown to={clock + 90_000} now={now} />);
    expect(screen.getByRole('timer', { name: '1:30' })).toBeTruthy();
    await tick(1000);
    expect(screen.getByText('1:29')).toBeTruthy();
    await tick(29_000);
    expect(screen.getByText('1:00')).toBeTruthy();
  });

  it('formats hours from one hour up, or always, or never', async () => {
    await wrap(<Countdown to={clock + 3_725_000} now={now} />);
    expect(screen.getByText('1:02:05')).toBeTruthy();
    await screen.rerender(<Provider><Countdown to={clock + 3_725_000} now={now} format="m:ss" /></Provider>);
    expect(screen.getByText('62:05')).toBeTruthy();
    await screen.rerender(<Provider><Countdown to={clock + 65_000} now={now} format="h:mm:ss" /></Provider>);
    expect(screen.getByText('0:01:05')).toBeTruthy();
  });

  it('turns to warning under a minute and danger under ten seconds; `tone` pins it', async () => {
    await wrap(<Countdown to={clock + 61_000} now={now} variant="inline" />);
    const color = () => style(screen.getByRole('timer')).color;
    expect(color()).toBe(roles['on-surface']);
    await tick(2000);
    expect(color()).toBe(roles.warning);
    await tick(50_000);
    expect(screen.getByText('0:09')).toBeTruthy();
    expect(color()).toBe(roles.error);
    await screen.rerender(<Provider><Countdown to={clock + 500_000} now={now} variant="inline" tone="danger" /></Provider>);
    expect(color()).toBe(roles.error);
    await screen.rerender(<Provider><Countdown to={clock + 100_000} now={now} variant="inline" warnAt={120} /></Provider>);
    expect(color()).toBe(roles.warning);
  });

  it('announces each minute, 30, 10 and 5 seconds and the end, not every second', async () => {
    await wrap(<Countdown to={clock + 121_000} now={now} />);
    expect(announce).not.toHaveBeenCalled();
    await tick(1000);
    expect(announce).toHaveBeenLastCalledWith('2 minutes left');
    await tick(60_000);
    expect(announce).toHaveBeenLastCalledWith('1 minute left');
    await tick(30_000);
    expect(announce).toHaveBeenLastCalledWith('30 seconds left');
    await tick(20_000);
    expect(announce).toHaveBeenLastCalledWith('10 seconds left');
    await tick(5000);
    expect(announce).toHaveBeenLastCalledWith('5 seconds left');
    await tick(5000);
    expect(announce).toHaveBeenLastCalledWith('Time is up');
    expect(announce).toHaveBeenCalledTimes(6);
  });

  it('calls onExpire once, also when the deadline has already passed', async () => {
    const onExpire = jest.fn();
    await wrap(<Countdown to={clock + 2000} now={now} onExpire={onExpire} />);
    await tick(1000);
    expect(onExpire).not.toHaveBeenCalled();
    await tick(1000);
    await tick(5000);
    expect(onExpire).toHaveBeenCalledTimes(1);
    expect(screen.getByText('0:00')).toBeTruthy();
    const late = jest.fn();
    await screen.rerender(<Provider><Countdown to={clock - 60_000} now={now} onExpire={late} /></Provider>);
    expect(late).toHaveBeenCalledTimes(1);
  });

  it('reads the clock again when the app comes back to the foreground', async () => {
    let onChange!: (s: AppStateStatus) => void;
    const remove = jest.fn();
    jest.spyOn(AppState, 'addEventListener').mockImplementation((_type, fn) => {
      onChange = fn as (s: AppStateStatus) => void;
      return { remove } as never;
    });
    await wrap(<Countdown to={clock + 300_000} now={now} />);
    expect(screen.getByText('5:00')).toBeTruthy();
    // Four minutes in the background: no timer fired, the clock moved on.
    clock += 240_000;
    await act(() => onChange('background'));
    expect(screen.getByText('5:00')).toBeTruthy();
    await act(() => onChange('active'));
    expect(screen.getByText('1:00')).toBeTruthy();
    await screen.unmount();
    expect(remove).toHaveBeenCalled();
  });

  it('a new deadline shows at once; a Date works; useCountdown reports the state', async () => {
    const seen: ReturnType<typeof useCountdown>[] = [];
    function Probe({ to }: { to: number | Date }) {
      seen.push(useCountdown(to, { now }));
      return null;
    }
    await wrap(<Probe to={new Date(clock + 1500)} />);
    expect(seen.at(-1)).toEqual({ remainingMs: 1500, seconds: 2, expired: false, ready: true });
    await screen.rerender(<Provider><Probe to={clock + 10_000} /></Provider>);
    expect(seen.at(-1)).toMatchObject({ remainingMs: 10_000, seconds: 10 });
    await tick(10_000);
    expect(seen.at(-1)).toEqual({ remainingMs: 0, seconds: 0, expired: true, ready: true });
  });

  it('chip sizes', async () => {
    await wrap(<Countdown to={clock + 5000} now={now} size="sm" tone="neutral" />);
    expect(screen.getByRole('timer', { name: '0:05' })).toBeTruthy();
  });
});

describe('StatusSteps', () => {
  const steps = [
    { id: 'sent', title: 'Application sent', status: 'done' as const, timestamp: 'Mon, 10:30' },
    { id: 'docs', title: 'Documents', status: 'error' as const, description: 'The photo is too dark.', action: <Button size="sm">Upload again</Button> },
    { id: 'review', title: 'In review', status: 'current' as const },
    { id: 'decision', title: 'Decision', status: 'upcoming' as const },
  ];

  it('is a named list; every step says its status in words', async () => {
    await wrap(<StatusSteps accessibilityLabel="Application status" steps={steps} />);
    // The list itself is not one accessible element (its steps are), so it is found by its label.
    expect(screen.getByLabelText('Application status').props.accessibilityRole).toBe('list');
    const t = defaultMessages;
    expect(screen.getByLabelText(`${t.stepCompleted}: Application sent, Mon, 10:30`)).toBeTruthy();
    expect(screen.getByLabelText(`${t.stepProblem}: Documents, The photo is too dark.`)).toBeTruthy();
    expect(screen.getByLabelText(`${t.stepCurrent}: In review`).props.accessibilityState).toMatchObject({ selected: true });
    expect(screen.getByLabelText(`${t.stepUpcoming}: Decision`).props.accessibilityState).toMatchObject({ selected: false });
  });

  it('the action stays its own element', async () => {
    const onPress = jest.fn();
    await wrap(<StatusSteps accessibilityLabel="Status" steps={[{ title: 'Documents', status: 'error', action: <Button onPress={onPress}>Upload again</Button> }]} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Upload again' }));
    expect(onPress).toHaveBeenCalled();
  });

  it('colours the title by status and draws a line between steps, solid after a done step', async () => {
    await wrap(<StatusSteps accessibilityLabel="Status" steps={steps} size="sm" />);
    expect(style(screen.getByText('Documents')).color).toBe(roles.error);
    expect(style(screen.getByText('Decision')).color).toBe(roles['on-surface-muted']);
    expect(style(screen.getByText('In review')).color).toBe(roles['on-surface']);
    const lines = nodes().filter((n) => style(n).width === 1 && style(n).flex === 1);
    expect(lines.map((l) => style(l).backgroundColor)).toEqual([roles.primary, roles['outline-variant'], roles['outline-variant']]);
    expect(screen.getAllByTestId(/^status-step-/)).toHaveLength(4);
  });

  it('takes nodes for the title, timestamp and description', async () => {
    await wrap(
      <StatusSteps
        accessibilityLabel="Status"
        steps={[{ title: <Text>Custom title</Text>, timestamp: <Text>Today</Text>, description: <Text>Details</Text>, status: 'current' }]}
      />,
    );
    expect(screen.getByText('Custom title')).toBeTruthy();
    expect(screen.getByText('Today')).toBeTruthy();
    expect(screen.getByText('Details')).toBeTruthy();
  });
});
