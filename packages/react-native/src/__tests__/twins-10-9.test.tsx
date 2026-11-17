import * as React from 'react';
import { StyleSheet, Text as RNText, View } from 'react-native';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import {
  Button,
  NexubNativeProvider,
  Rating,
  StepIndicator,
  StepProgress,
  Table,
  Tabs,
  Tooltip,
} from '../index';

jest.mock('expo-haptics', () => ({
  selectionAsync: jest.fn(() => Promise.resolve()),
  impactAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: {},
  NotificationFeedbackType: {},
  AndroidHaptics: {},
}));

const wrap = (ui: React.ReactElement, dir?: 'ltr' | 'rtl') =>
  render(
    <NexubNativeProvider scheme="light" contrast="standard" dir={dir}>
      {ui}
    </NexubNativeProvider>,
  );
const flat = (el: { props: { style?: unknown } }) => StyleSheet.flatten(el.props.style as never) as Record<string, unknown>;
const layout = (x: number, width: number) => ({ nativeEvent: { layout: { x, y: 0, width, height: 40 } } });

describe('Tabs', () => {
  const tabs = (props?: { onValueChange?: (v: string) => void; variant?: 'line' | 'pill' }) => (
    <Tabs.Root defaultValue="a" onValueChange={props?.onValueChange}>
      <Tabs.List accessibilityLabel="Sections" variant={props?.variant} size="sm">
        <Tabs.Trigger value="a">Overview</Tabs.Trigger>
        <Tabs.Trigger value="b">Activity</Tabs.Trigger>
        <Tabs.Trigger value="c" disabled>
          <RNText>Custom</RNText>
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="a">
        <RNText>Panel A</RNText>
      </Tabs.Content>
      <Tabs.Content value="b">
        <RNText>Panel B</RNText>
      </Tabs.Content>
      <Tabs.Content value="c" forceMount testID="panel-c">
        <RNText>Panel C</RNText>
      </Tabs.Content>
    </Tabs.Root>
  );

  it('has a tablist, selected tab and one mounted panel; pressing changes it', async () => {
    const onValueChange = jest.fn();
    await wrap(tabs({ onValueChange }));
    expect(screen.getByLabelText('Sections').props.accessibilityRole).toBe('tablist');
    expect(screen.getByRole('tab', { name: 'Overview' })).toBeSelected();
    expect(screen.getByRole('tab', { name: 'Custom' })).toBeDisabled();
    expect(screen.getByText('Panel A')).toBeTruthy();
    expect(screen.queryByText('Panel B')).toBeNull();
    // forceMount keeps the panel, hidden.
    expect(flat(screen.getByTestId('panel-c', { includeHiddenElements: true })).display).toBe('none');
    expect(screen.getByTestId('panel-c', { includeHiddenElements: true }).props.importantForAccessibility).toBe('no-hide-descendants');

    await fireEvent.press(screen.getByRole('tab', { name: 'Activity' }));
    expect(onValueChange).toHaveBeenCalledWith('b');
    expect(screen.getByRole('tab', { name: 'Activity' })).toBeSelected();
    expect(screen.getByText('Panel B')).toBeTruthy();
    expect(screen.queryByText('Panel A')).toBeNull();
  });

  it('small tabs reach 44pt up and down', async () => {
    await wrap(tabs());
    expect(screen.getByRole('tab', { name: 'Overview' }).props.hitSlop).toEqual({ top: 6, bottom: 6 });
  });

  it('the indicator appears once measured, exactly under the active tab, and follows it', async () => {
    await wrap(tabs());
    expect(screen.queryByTestId('tabs-indicator')).toBeNull();
    await fireEvent(screen.getByLabelText('Sections'), 'layout', layout(0, 300));
    await fireEvent(screen.getByRole('tab', { name: 'Overview' }), 'layout', layout(0, 90));
    await fireEvent(screen.getByRole('tab', { name: 'Activity' }), 'layout', layout(90, 80));
    let bar = flat(screen.getByTestId('tabs-indicator'));
    expect(bar.width).toBe(90);
    expect(bar.transform).toEqual([{ translateX: 0 }]);
    expect(bar.height).toBe(3);

    await fireEvent.press(screen.getByRole('tab', { name: 'Activity' }));
    // The stubbed shared values do not re-render on their own.
    await fireEvent(screen.getByLabelText('Sections'), 'layout', layout(0, 301));
    bar = flat(screen.getByTestId('tabs-indicator'));
    expect(bar.width).toBe(80);
    expect(bar.transform).toEqual([{ translateX: 90 }]);
  });

  it('pill variant draws a thumb; RTL measures from the end', async () => {
    await wrap(tabs({ variant: 'pill' }), 'rtl');
    await fireEvent(screen.getByLabelText('Sections'), 'layout', layout(0, 300));
    await fireEvent(screen.getByRole('tab', { name: 'Overview' }), 'layout', layout(100, 90));
    await fireEvent(screen.getByRole('tab', { name: 'Activity' }), 'layout', layout(20, 80));
    const thumb = flat(screen.getByTestId('tabs-indicator'));
    expect(thumb).toMatchObject({ top: 2, bottom: 2, position: 'absolute' });
    expect(thumb.transform).toEqual([{ translateX: -110 }]);
  });

  it('parts outside a Root throw', async () => {
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    await expect(wrap(<Tabs.Content value="a" />)).rejects.toThrow('Tabs.Root');
    error.mockRestore();
  });
});

describe('Table', () => {
  const table = (props?: React.ComponentProps<typeof Table.Root>) => (
    <Table.Root columns={[140, 72]} {...props}>
      <Table.Header>
        <Table.Row>
          <Table.Head>Team</Table.Head>
          <Table.Head numeric>Played</Table.Head>
          <Table.Head numeric>Points</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row testID="row-0">
          <Table.Cell>Rovers</Table.Cell>
          <Table.Cell numeric>12</Table.Cell>
          <Table.Cell numeric accessibilityLabel="thirty">
            <RNText>30</RNText>
          </Table.Cell>
        </Table.Row>
        <Table.Row testID="row-1">
          <Table.Cell>United</Table.Cell>
          <Table.Cell numeric>{12}</Table.Cell>
          <Table.Cell numeric>27</Table.Cell>
        </Table.Row>
      </Table.Body>
      <Table.Footer>
        <Table.Row>
          <Table.Cell>Total</Table.Cell>
          <Table.Cell numeric>24</Table.Cell>
          <Table.Cell numeric>57</Table.Cell>
        </Table.Row>
      </Table.Footer>
      <Table.Caption>League table</Table.Caption>
    </Table.Root>
  );

  it('rows announce header: value pairs; the header row is a heading', async () => {
    await wrap(table());
    expect(screen.getByRole('header', { name: 'Team, Played, Points' })).toBeTruthy();
    expect(screen.getByLabelText('Team: Rovers, Played: 12, Points: thirty')).toBeTruthy();
    expect(screen.getByLabelText('Team: United, Played: 12, Points: 27')).toBeTruthy();
    expect(screen.getAllByText('League table')).toHaveLength(1);
    expect(screen.queryByTestId('table-sticky-column')).toBeNull();
  });

  it('numeric cells are end-aligned with tabular figures; columns take their widths', async () => {
    await wrap(table());
    const figure = screen.getByText('27');
    expect(flat(figure).fontVariant).toEqual(['tabular-nums']);
    const cells = screen.getByTestId('row-1').children as unknown as { props: { style?: unknown } }[];
    expect(cells.map((c) => flat(c).width)).toEqual([140, 72, 128]);
    expect(cells.map((c) => flat(c).alignItems)).toEqual(['flex-start', 'flex-end', 'flex-end']);
    expect(cells.map((c) => flat(c).flexGrow)).toEqual([0, 0, 1]);
  });

  it('density, stripes and the divider cut', async () => {
    await wrap(table({ density: 'compact', striped: true, dividerAfter: 0 }));
    const first = flat(screen.getByTestId('row-0'));
    const second = flat(screen.getByTestId('row-1'));
    expect(first.minHeight).toBe(36);
    expect(first.borderBottomWidth).toBe(2);
    expect(first.backgroundColor).toBeUndefined();
    expect(second.backgroundColor).toEqual(expect.any(String));
    // Last body row: no line.
    expect(second.borderBottomWidth).toBe(0);
  });

  it('sticky first column sits outside the scroller with rows of the same fixed height', async () => {
    await wrap(table({ stickyFirstColumn: true }));
    const sticky = screen.getByTestId('table-sticky-column');
    expect(sticky).toContainElement(screen.getByText('Rovers'));
    expect(sticky).not.toContainElement(screen.getByText('27', { includeHiddenElements: true }));
    const [fixed, scrolling] = screen.getAllByTestId('row-1', { includeHiddenElements: true });
    expect(flat(fixed!).height).toBe(48);
    expect(flat(scrolling!).height).toBe(48);
    // The fixed piece speaks for the whole row; the scrolling piece is hidden.
    expect(fixed!.props.accessibilityLabel).toBe('Team: United, Played: 12, Points: 27');
    expect(scrolling!.props.importantForAccessibility).toBe('no-hide-descendants');
    expect(screen.getAllByText('League table')).toHaveLength(1);
  });

  it('accessible={false} leaves the cells to the screen reader', async () => {
    await wrap(
      <Table.Root>
        <Table.Body>
          <Table.Row accessible={false} testID="r">
            <Table.Cell>Rovers</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>,
    );
    expect(screen.getByTestId('r').props.accessibilityLabel).toBeUndefined();
  });
});

describe('Rating', () => {
  const action = (actionName: string) =>
    fireEvent(screen.getByRole('adjustable', { name: 'Rating' }), 'accessibilityAction', { nativeEvent: { actionName } });

  it('is adjustable with a value; a tap sets it', async () => {
    const onValueChange = jest.fn();
    await wrap(<Rating defaultValue={2} onValueChange={onValueChange} />);
    const rating = screen.getByRole('adjustable', { name: 'Rating' });
    expect(rating.props.accessibilityValue).toEqual({ min: 0, max: 5, now: 2, text: '2 stars' });
    expect(screen.getAllByTestId(/^rating-star-/)).toHaveLength(5);
    expect(screen.getByTestId('rating-star-1').props.hitSlop).toEqual({ top: 12, bottom: 12, left: 1, right: 1 });
    await fireEvent.press(screen.getByTestId('rating-star-4'));
    expect(onValueChange).toHaveBeenCalledWith(4);
    expect(screen.getByRole('adjustable').props.accessibilityValue.now).toBe(4);
  });

  it('increment and decrement stay inside 0..max', async () => {
    const onValueChange = jest.fn();
    await wrap(<Rating defaultValue={2} max={3} onValueChange={onValueChange} />);
    await action('increment');
    expect(onValueChange).toHaveBeenLastCalledWith(3);
    await action('increment');
    expect(onValueChange).toHaveBeenCalledTimes(1);
    await action('decrement');
    expect(onValueChange).toHaveBeenLastCalledWith(2);
  });

  it('readOnly is an image that ignores taps and actions', async () => {
    const onValueChange = jest.fn();
    await wrap(<Rating value={3} readOnly label="Average rating" size="lg" onValueChange={onValueChange} />);
    const rating = screen.getByRole('image', { name: 'Average rating' });
    expect(rating.props.accessibilityActions).toBeUndefined();
    await fireEvent.press(screen.getByTestId('rating-star-5'));
    await fireEvent(rating, 'accessibilityAction', { nativeEvent: { actionName: 'increment' } });
    expect(onValueChange).not.toHaveBeenCalled();
  });
});

describe('Tooltip', () => {
  type Measurable = { measureInWindow: (cb: (...n: number[]) => void) => void };
  let proto: Measurable;
  beforeAll(async () => {
    const ref = React.createRef<React.ComponentRef<typeof View>>();
    const probe = await render(<View ref={ref} />);
    proto = Object.getPrototypeOf(ref.current) as Measurable;
    await probe.unmount();
  });
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(proto, 'measureInWindow').mockImplementation((cb) => cb(100, 200, 40, 40));
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });
  const tip = (props?: Partial<React.ComponentProps<typeof Tooltip>>, onLongPress?: () => void) => (
    <Tooltip label="Copy link" {...props}>
      <Button onLongPress={onLongPress}>Copy</Button>
    </Tooltip>
  );
  const shown = () => screen.queryByText('Copy link', { includeHiddenElements: true });
  const bubble = () => shown()!.parent!;

  it('gives the child the hint and the long-press delay, without the popover', async () => {
    await wrap(tip());
    const button = screen.getByRole('button', { name: 'Copy' });
    expect(button.props.accessibilityHint).toBe('Copy link');
    expect(shown()).toBeNull();
  });

  it('no hint when the child is already named by the tip', async () => {
    await wrap(
      <Tooltip label="Copy">
        <Button accessibilityLabel="Copy">Copy</Button>
      </Tooltip>,
    );
    expect(screen.getByRole('button', { name: 'Copy' }).props.accessibilityHint).toBeUndefined();
  });

  it('long-press shows it above the anchor, then it hides after the duration', async () => {
    const onLongPress = jest.fn();
    await wrap(tip({ duration: 1000 }, onLongPress));
    await fireEvent(screen.getByRole('button', { name: 'Copy' }), 'longPress');
    expect(onLongPress).toHaveBeenCalled();
    expect(shown()).toBeTruthy();
    await fireEvent(bubble(), 'layout', { nativeEvent: { layout: { x: 0, y: 0, width: 80, height: 28 } } });
    // Centred on the anchor (100 + 20 − 40), 4pt above it (200 − 28 − 4).
    expect(flat(bubble())).toMatchObject({ left: 80, top: 168, opacity: 1 });
    await act(() => jest.advanceTimersByTime(999));
    expect(shown()).toBeTruthy();
    await act(() => jest.advanceTimersByTime(1));
    expect(shown()).toBeNull();
  });

  it.each([
    ['bottom', { left: 80, top: 244 }],
    ['left', { left: 16, top: 206 }],
    ['right', { left: 144, top: 206 }],
  ] as const)('side %s', async (side, at) => {
    await wrap(tip({ side }));
    await fireEvent(screen.getByRole('button', { name: 'Copy' }), 'longPress');
    await fireEvent(bubble(), 'layout', { nativeEvent: { layout: { x: 0, y: 0, width: 80, height: 28 } } });
    expect(flat(bubble())).toMatchObject(at);
  });

  it('flips below when there is no room above; an outside tap hides it', async () => {
    jest.spyOn(proto, 'measureInWindow').mockImplementation((cb) => cb(0, 10, 40, 40));
    await wrap(tip());
    await fireEvent(screen.getByRole('button', { name: 'Copy' }), 'longPress');
    await fireEvent(bubble(), 'layout', { nativeEvent: { layout: { x: 0, y: 0, width: 80, height: 28 } } });
    // Below the anchor (10 + 40 + 4), kept 8pt from the screen edge.
    expect(flat(bubble())).toMatchObject({ left: 8, top: 54 });
    await fireEvent.press(screen.getByTestId('tooltip-backdrop', { includeHiddenElements: true }));
    expect(shown()).toBeNull();
  });
});

it('StepIndicator is StepProgress', () => {
  expect(StepIndicator).toBe(StepProgress);
});
