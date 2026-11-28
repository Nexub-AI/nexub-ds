// 12.5: larger screens. Window size classes, NavigationRail, AppShell and ListDetail
// at compact (phone), medium (small tablet, unfolded foldable) and expanded widths.
import * as React from 'react';
import { BackHandler, Text as RNText } from 'react-native';
import { fireEvent, render, renderHook, screen } from '@testing-library/react-native';
import { Bell, Home } from '@nexub/icons/native';
import {
  AppShell,
  EXPANDED_MIN,
  NavigationRail,
  NexubNativeProvider,
  TABLET_MIN,
  useWindowSizeClass,
  windowSizeClass,
} from '../index';
import { ListDetail } from '../patterns';

jest.mock('expo-haptics', () => ({
  selectionAsync: jest.fn(() => Promise.resolve()),
  impactAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: {},
  NotificationFeedbackType: {},
  AndroidHaptics: {},
}));

const SIZES = { compact: [390, 844], medium: [700, 1000], expanded: [1180, 820] } as const;
type Size = keyof typeof SIZES;
const at = (size: Size) => {
  const [width, height] = SIZES[size];
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- spying on the module object
  jest.spyOn(require('react-native'), 'useWindowDimensions').mockReturnValue({ width, height, scale: 2, fontScale: 1 });
};
afterEach(() => jest.restoreAllMocks());

const wrap = (ui: React.ReactElement, dir: 'ltr' | 'rtl' = 'ltr') =>
  render(
    <NexubNativeProvider scheme="light" contrast="standard" dir={dir}>
      {ui}
    </NexubNativeProvider>,
  );
const flat = (style: unknown) => Object.assign({}, ...[style].flat(Infinity as 1).filter(Boolean)) as Record<string, unknown>;

describe('window size classes', () => {
  it('uses the Material 3 breakpoints, 600 and 840', () => {
    expect([TABLET_MIN, EXPANDED_MIN]).toEqual([600, 840]);
    expect(windowSizeClass(0)).toBe('compact');
    expect(windowSizeClass(599)).toBe('compact');
    expect(windowSizeClass(600)).toBe('medium');
    expect(windowSizeClass(839)).toBe('medium');
    expect(windowSizeClass(840)).toBe('expanded');
  });

  it.each(['compact', 'medium', 'expanded'] as const)('useWindowSizeClass reads the window: %s', async (size) => {
    at(size);
    expect((await renderHook(() => useWindowSizeClass())).result.current).toBe(size);
  });
});

const rail = (props: Partial<React.ComponentProps<typeof NavigationRail.Root>> = {}, onInbox = jest.fn()) => (
  <NavigationRail.Root testID="nav" header={<RNText>New</RNText>} {...props}>
    <NavigationRail.Item icon={Home} label="Home" active />
    <NavigationRail.Item icon={Bell} label="Inbox" badge={3} onPress={onInbox} />
    <NavigationRail.Item icon={Bell} label="Feed" badge />
  </NavigationRail.Root>
);

describe('NavigationRail', () => {
  it('is a bottom bar on compact windows, without the header', async () => {
    at('compact');
    await wrap(rail());
    const nav = screen.getByTestId('nav');
    expect(flat(nav.props.style).flexDirection).toBe('row');
    expect(screen.queryByText('New')).toBeNull();
  });

  it.each(['medium', 'expanded'] as const)('is a rail at the start edge on %s windows, with the header', async (size) => {
    at(size);
    await wrap(rail());
    const style = flat(screen.getByTestId('nav').props.style);
    expect(style.flexDirection).toBeUndefined();
    expect(style.width).toBe(80);
    expect(screen.getByText('New')).toBeTruthy();
  });

  it('a fixed orientation ignores the window', async () => {
    at('expanded');
    await wrap(rail({ orientation: 'bottom' }));
    expect(flat(screen.getByTestId('nav').props.style).flexDirection).toBe('row');
  });

  it('names the navigation, marks the active item and reads badges after the label', async () => {
    at('medium');
    const onInbox = jest.fn();
    await wrap(rail({}, onInbox));
    expect(screen.getByTestId('nav').props).toMatchObject({ accessibilityRole: 'tablist', accessibilityLabel: 'Main' });
    expect(screen.getByRole('tab', { name: 'Home' }).props.accessibilityState).toMatchObject({ selected: true });
    expect(screen.getByRole('tab', { name: 'Inbox, 3 unread' }).props.accessibilityState).toMatchObject({ selected: false });
    expect(screen.getByRole('tab', { name: 'Feed, New' })).toBeTruthy();
    fireEvent.press(screen.getByRole('tab', { name: 'Inbox, 3 unread' }));
    expect(onInbox).toHaveBeenCalled();
  });

  it('caps the count at 99+ and drops a zero badge', async () => {
    at('compact');
    await wrap(
      <NavigationRail.Root>
        <NavigationRail.Item icon={Bell} label="Inbox" badge={120} badgeLabel="120 new messages" />
        <NavigationRail.Item icon={Home} label="Home" badge={0} />
      </NavigationRail.Root>,
    );
    expect(screen.getByText('99+')).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'Inbox, 120 new messages' })).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'Home' })).toBeTruthy();
    expect(screen.getAllByTestId('rail-badge')).toHaveLength(1);
  });
});

describe('AppShell', () => {
  const shell = (railFrom?: 'medium' | 'expanded') => (
    <AppShell testID="shell" railFrom={railFrom} header={<RNText>Header</RNText>} navigation={rail()}>
      <RNText>Content</RNText>
    </AppShell>
  );
  const order = () => {
    const kids = screen.getByTestId('shell').children as { props: { testID?: string } }[];
    return kids.map((k) => (k.props.testID === 'nav' ? 'nav' : 'main'));
  };

  it('compact: content above a bottom bar', async () => {
    at('compact');
    await wrap(shell());
    expect(flat(screen.getByTestId('shell').props.style).flexDirection).toBe('column');
    expect(order()).toEqual(['main', 'nav']);
    expect(flat(screen.getByTestId('nav').props.style).flexDirection).toBe('row');
  });

  it.each(['medium', 'expanded'] as const)('%s: a rail beside the content', async (size) => {
    at(size);
    await wrap(shell());
    expect(flat(screen.getByTestId('shell').props.style).flexDirection).toBe('row');
    expect(order()).toEqual(['nav', 'main']);
    expect(flat(screen.getByTestId('nav').props.style).width).toBe(80);
    expect(screen.getByText('Header')).toBeTruthy();
  });

  it('railFrom="expanded" keeps the bottom bar on medium windows', async () => {
    at('medium');
    await wrap(shell('expanded'));
    expect(order()).toEqual(['main', 'nav']);
    expect(flat(screen.getByTestId('nav').props.style).flexDirection).toBe('row');
  });
});

describe('ListDetail', () => {
  const ui = (props: Partial<React.ComponentProps<typeof ListDetail>> = {}) => (
    <ListDetail list={<RNText>The list</RNText>} detail={<RNText>The detail</RNText>} {...props} />
  );

  it('compact: one pane, the list until an item is selected', async () => {
    at('compact');
    await wrap(ui());
    expect(screen.getByText('The list')).toBeTruthy();
    expect(screen.queryByText('The detail')).toBeNull();
  });

  it('compact: showDetail pushes the detail with a back button, and Android back calls onBack', async () => {
    at('compact');
    const onBack = jest.fn();
    const add = jest.spyOn(BackHandler, 'addEventListener');
    await wrap(ui({ showDetail: true, onBack }));
    expect(screen.queryByText('The list')).toBeNull();
    expect(screen.getByText('The detail')).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: 'Back' }));
    expect(onBack).toHaveBeenCalledTimes(1);
    const handler = add.mock.calls.find(([event]) => event === 'hardwareBackPress')?.[1];
    expect((handler as () => boolean | null)()).toBe(true);
    expect(onBack).toHaveBeenCalledTimes(2);
  });

  it.each(['medium', 'expanded'] as const)('%s: both panes side by side, no back button', async (size) => {
    at(size);
    const add = jest.spyOn(BackHandler, 'addEventListener');
    await wrap(ui({ showDetail: true, onBack: jest.fn() }));
    expect(screen.getByText('The list')).toBeTruthy();
    expect(screen.getByText('The detail')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Back' })).toBeNull();
    expect(add).not.toHaveBeenCalledWith('hardwareBackPress', expect.anything());
    expect(flat(screen.getByTestId('list-detail-list').props.style)).toMatchObject({ width: 320, borderEndWidth: expect.any(Number) });
  });

  it.each([
    [{ listWidth: 'lg' as const }, { width: 400 }],
    [{ splitRatio: 0.4 }, { flexBasis: '40%' }],
    [{ splitRatio: 0.95 }, { flexBasis: '80%' }],
    [{ splitRatio: 0.05, listWidth: 'sm' as const }, { flexBasis: '20%' }],
  ])('sizes the list pane from %j (splitRatio clamped to 0.2–0.8)', async (props, expected) => {
    at('expanded');
    await wrap(ui(props));
    expect(flat(screen.getByTestId('list-detail-list').props.style)).toMatchObject(expected);
  });

  it('names the panes, and the list reads busy while loading', async () => {
    at('medium');
    await wrap(ui({ loading: true, listLabel: 'Payments' }));
    const list = screen.getByTestId('list-detail-list');
    expect(list.props.accessibilityLabel).toBe('Payments');
    expect(list.props.accessibilityState).toEqual({ busy: true });
    expect(screen.queryByText('The list')).toBeNull();
    expect(screen.getByTestId('list-detail-detail').props.accessibilityLabel).toBe('Detail');
  });

  it('errorState wins over loading and emptyState', async () => {
    at('compact');
    await wrap(ui({ loading: true, emptyState: <RNText>Empty</RNText>, errorState: <RNText>Failed</RNText> }));
    expect(screen.getByText('Failed')).toBeTruthy();
    expect(screen.queryByText('Empty')).toBeNull();
    expect(screen.getByTestId('list-detail-list').props.accessibilityState).toBeUndefined();
  });

  it('flips the back arrow in RTL', async () => {
    at('compact');
    await wrap(ui({ showDetail: true, onBack: jest.fn(), backLabel: 'رجوع' }), 'rtl');
    expect(screen.getByRole('button', { name: 'رجوع' })).toBeTruthy();
    expect(JSON.stringify(screen.toJSON())).toContain('"scaleX":-1');
  });
});
