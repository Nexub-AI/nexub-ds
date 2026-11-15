// 8.2 (T1): every exported component renders in the provider without console
// noise, and its interactive element has an accessible name. A new export
// with no entry in CASES (or SKIP) fails the "covers every export" test.
import * as React from 'react';
import { AccessibilityInfo, StyleSheet, Text as RNText } from 'react-native';
import { act, render, screen, waitFor } from '@testing-library/react-native';
import { Plus } from '@nexub/icons/native';
import * as Lib from '../index';
import * as Patterns from '../patterns';

// The OS colour scheme, driven by the test at the bottom of this file.
const mockColorScheme = jest.fn(() => 'light');
jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  __esModule: true,
  default: () => mockColorScheme(),
}));

jest.mock('expo-haptics', () => ({
  selectionAsync: jest.fn(() => Promise.resolve()),
  impactAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: {},
  NotificationFeedbackType: {},
  AndroidHaptics: {},
}));

const noop = () => {};
const t = (s: string) => <RNText>{s}</RNText>;
const tx = { id: '1', title: 'Coffee Lab', amount: -4.5, currency: 'USD', date: new Date(2026, 9, 30) };

type Props = Record<string, unknown>;
type Case = {
  props: Props;
  /** The accessible element to find: [role, name], or a label for elements with no role (text inputs). */
  a11y?: [string, string] | string;
  /** Context the component must sit in. */
  within?: (el: React.ReactElement) => React.ReactElement;
};

// Kept short: each entry needs a reason.
const SKIP: Record<string, string> = {};

// 9.4: text that does not grow with the OS font size, and why. Shrink-only.
// The Avatar monogram is sized to its circle (the full name is the accessibility label);
// the others contain an Avatar.
const MONOGRAM = ['Text cap=1'];
const FIXED_TEXT: Record<string, string[]> = {
  Avatar: MONOGRAM,
  AvatarGroup: MONOGRAM,
  ActivityList: MONOGRAM,
  ProfileHeader: MONOGRAM,
  TransactionDetail: MONOGRAM,
};

const CASES: Record<string, Case> = {
  // Theme + primitives
  NexubNativeProvider: { props: { children: t('nested') } },
  Text: { props: { children: 'Hello' } },
  Heading: { props: { children: 'Title' }, a11y: ['header', 'Title'] },
  Pressable: { props: { accessibilityLabel: 'Tap', onPress: noop, children: t('Tap') }, a11y: ['button', 'Tap'] },
  Surface: { props: { children: t('s') } },
  Box: { props: { padding: '2', children: t('b') } },
  Stack: { props: { children: t('s') } },
  Inline: { props: { children: t('i') } },
  Icon: { props: { icon: Plus } },
  ScreenContainer: { props: { children: t('screen') } },
  // Actions
  Button: { props: { onPress: noop, children: 'Send' }, a11y: ['button', 'Send'] },
  IconButton: { props: { icon: Plus, label: 'Add' }, a11y: ['button', 'Add'] },
  ButtonGroup: { props: { children: <Lib.Button onPress={noop}>OK</Lib.Button> }, a11y: ['button', 'OK'] },
  Link: { props: { onPress: noop, children: 'Terms' }, a11y: ['link', 'Terms'] },
  // Display
  Amount: { props: { value: 12.5, currency: 'USD' } },
  Badge: { props: { children: 'New' } },
  Avatar: { props: { name: 'Ada Lovelace' }, a11y: ['image', 'Ada Lovelace'] },
  AvatarGroup: { props: { children: [<Lib.Avatar key="a" name="Ada" />] }, a11y: ['image', 'Ada'] },
  Divider: { props: {} },
  // Inputs
  TextField: { props: { label: 'Name' }, a11y: 'Name' },
  PasswordInput: { props: { label: 'Password' }, a11y: ['button', 'Show password'] },
  SearchField: { props: {}, a11y: 'Search' },
  MoneyInput: { props: { label: 'Amount', currency: 'USD' }, a11y: 'Amount' },
  Stepper: { props: { label: 'Guests' }, a11y: ['adjustable', 'Guests'] },
  Checkbox: { props: { label: 'Remember me' }, a11y: ['checkbox', 'Remember me'] },
  RadioGroup: { props: { label: 'Speed', children: <Lib.Radio value="a" label="Standard" /> }, a11y: ['radio', 'Standard'] },
  Radio: {
    props: { value: 'a', label: 'Standard' },
    a11y: ['radio', 'Standard'],
    within: (el) => <Lib.RadioGroup label="Speed">{el}</Lib.RadioGroup>,
  },
  Switch: { props: { label: 'Wi-Fi' }, a11y: ['switch', 'Wi-Fi'] },
  SegmentedControl: { props: { label: 'Period', options: [{ value: 'w', label: 'Week' }] }, a11y: ['tab', 'Week'] },
  Slider: { props: { label: 'Volume' }, a11y: ['adjustable', 'Volume'] },
  Chip: { props: { label: 'Food', onPress: noop }, a11y: ['button', 'Food'] },
  FilterChip: { props: { label: 'Food', selected: false, onPress: noop }, a11y: ['checkbox', 'Food'] },
  // Containers
  Card: { props: { children: t('card') } },
  ListItem: { props: { title: 'Language', onPress: noop }, a11y: ['button', 'Language'] },
  ListSection: { props: { header: 'Account', children: <Lib.ListItem title="Email" /> }, a11y: ['header', 'Account'] },
  Accordion: { props: { title: 'More', children: t('body') }, a11y: ['button', 'More'] },
  // Feedback
  Banner: { props: { children: 'Heads up' } },
  ToastProvider: { props: { children: t('app') } },
  Dialog: {
    props: { open: true, onOpenChange: noop, title: 'Delete?', actions: <Lib.Button onPress={noop}>Delete</Lib.Button> },
    a11y: ['button', 'Delete'],
  },
  Progress: { props: { value: 0.5, label: 'Upload' }, a11y: ['progressbar', 'Upload'] },
  LoadingIndicator: { props: {}, a11y: 'Loading…' },
  Skeleton: { props: {} },
  SkeletonText: { props: {} },
  SkeletonSwap: { props: { loading: true, skeleton: <Lib.Skeleton />, children: t('done') } },
  EmptyState: { props: { title: 'Nothing yet' } },
  ErrorState: { props: { title: 'Failed', onRetry: noop }, a11y: ['button', 'Retry'] },
  // Overlays
  BottomSheet: { props: { open: true, onOpenChange: noop, title: 'Sheet', children: t('body') }, a11y: ['header', 'Sheet'] },
  ActionSheet: { props: { open: false, onOpenChange: noop, actions: [{ label: 'Share', onPress: noop }] } },
  ContextMenu: { props: { accessibilityLabel: 'IBAN', actions: [{ label: 'Copy', onPress: noop }], children: t('GB33') }, a11y: ['button', 'IBAN'] },
  Select: {
    props: { label: 'Currency', placeholder: 'Choose', options: [{ value: 'USD', label: 'US dollar' }] },
    a11y: ['button', 'Currency, Choose'],
  },
  // Mobile
  SwipeableRow: { props: { label: 'Row', onPress: noop, actions: [], children: t('row') }, a11y: ['button', 'Row'] },
  RefreshControl: { props: { refreshing: false, onRefresh: noop } },
  Carousel: { props: { data: ['a', 'b'], renderItem: ({ item }: { item: string }) => t(item), width: 300 }, a11y: 'Page 1 of 2' },
  PageIndicator: { props: { count: 3, index: 0 }, a11y: 'Page 1 of 3' },
  StickyFooter: { props: { children: t('body'), footer: <Lib.Button onPress={noop}>Next</Lib.Button> }, a11y: ['button', 'Next'] },
  OTPInput: { props: { label: 'Code' }, a11y: 'Code' },
  NumericKeypad: { props: { onKey: noop }, a11y: ['button', '1'] },
  ExpressiveMoneyInput: { props: { label: 'Amount', currency: 'USD' }, a11y: ['button', 'Delete'] },
  SensitiveValue: { props: { label: 'Balance', children: '$1' }, a11y: ['button', 'Show Balance'] },
  PrivacyShield: { props: { children: t('secret') } },
  OfflineBanner: { props: { offline: true } },
  Coachmark: { props: { children: 'New here', onDismiss: noop }, a11y: ['button', 'Close'] },
  FAB: { props: { icon: Plus, label: 'New', onPress: noop } }, // renders nothing on iOS (jest-expo default)
  DateTimeField: { props: { label: 'Date', value: null, onValueChange: noop }, a11y: ['button', 'Date, Pick a date'] },
  // Data + workflow
  MultiSelect: { props: { label: 'Labels', placeholder: 'Choose', options: [{ value: 'a', label: 'A' }] }, a11y: ['button', 'Labels, Choose'] },
  DataList: { props: { data: [{ id: 'a' }], keyExtractor: (x: { id: string }) => x.id, title: (x: { id: string }) => x.id } },
  FileList: { props: { files: [{ id: '1', name: 'scan.pdf', progress: 100 }], onRemove: noop }, a11y: ['button', 'Remove scan.pdf'] },
  FilterSheet: {
    props: { open: true, onOpenChange: noop, fields: [{ id: 'n', label: 'Name', type: 'text' }], value: { id: 'r', combinator: 'and', rules: [] }, onValueChange: noop },
    a11y: ['button', 'Add filter'],
  },
  TreeList: { props: { rootTitle: 'Teams', nodes: [{ id: 'a', title: 'Ada' }], onSelect: noop } },
  StepProgress: { props: { steps: [{ id: 'a', label: 'Account' }], current: 0 }, a11y: 'Step 1 of 1: Account' },
  SortableList: { props: { items: ['A'], keyExtractor: (i: string) => i, title: (i: string) => i, onReorder: noop } },
  InlineEdit: { props: { label: 'Name', value: 'Acme', onSave: noop }, a11y: 'Edit Name, Acme' },
  // Patterns
  HomeScreen: { props: { greeting: 'Hi', balance: { value: 1, currency: 'USD' } } },
  AuthScreen: { props: { title: 'Welcome', children: t('form'), footer: <Lib.Button onPress={noop}>Go</Lib.Button> }, a11y: ['header', 'Welcome'] },
  SignInScreen: { props: { onSubmit: noop }, a11y: ['button', 'Sign in'] },
  VerifyCodeScreen: { props: { destination: '+65 4821', onComplete: noop, onResend: noop }, a11y: 'Verification code' },
  LockScreen: { props: { unlockLabel: 'Unlock with Face ID', onUnlock: noop }, a11y: ['button', 'Unlock with Face ID'] },
  FlowStep: { props: { step: 1, total: 3, title: 'Who to?', children: t('body'), footer: t('f') }, a11y: ['progressbar', 'Page 1 of 3'] },
  AmountStep: { props: { from: 'USD', to: 'EUR', balance: 10, quote: () => ({ fee: 0, rate: 1, arrives: 'Now' }), onContinue: noop }, a11y: ['button', 'Continue'] },
  ReviewStep: { props: { rows: [{ label: 'Fee', value: '$1' }], confirmLabel: 'Send', onConfirm: noop }, a11y: ['button', 'Send'] },
  ActivityList: { props: { transactions: [tx] } },
  TransactionDetail: { props: { transaction: tx }, a11y: ['image', 'Coffee Lab'] },
  ResultScreen: { props: { title: 'Sent', primary: { label: 'Done', onPress: noop } }, a11y: ['button', 'Done'] },
  OnboardingScreen: { props: { slides: [{ title: 'Hi', body: 'b' }], onGetStarted: noop }, a11y: ['button', 'Get started'] },
  PermissionPrimer: { props: { title: 'Notifications', body: 'b', onAllow: noop, onNotNow: noop }, a11y: ['button', 'Not now'] },
  SettingsScreen: { props: { groups: [{ header: 'General', items: [{ title: 'Language', onPress: noop }] }] }, a11y: ['button', 'Language'] },
  AppearanceSection: {
    props: { scheme: 'system', onSchemeChange: noop, glass: 'balanced', onGlassChange: noop, haptics: true, onHapticsChange: noop },
    a11y: ['tab', 'Dark'],
  },
  ProfileHeader: { props: { name: 'Mei', onPress: noop }, a11y: ['button', 'Mei'] },
  NotificationsInbox: { props: { notifications: [] } },
  SearchScreen: { props: { query: '', onQueryChange: noop, results: [], renderResult: noop, keyOf: String }, a11y: 'Search' },
  ChatScreen: { props: { messages: [], onSend: noop }, a11y: ['button', 'Send message'] },
  PaywallScreen: { props: { title: 'Go Pro', plans: [{ id: 'm', name: 'Monthly', price: '$9', features: [] }], onSubscribe: noop }, a11y: ['radio', 'Monthly, $9'] },
  AppSwitcherSheet: { props: { open: true, onOpenChange: noop, apps: [{ id: 'leap', name: 'Leap' }], onOpenApp: noop }, a11y: ['button', 'Leap'] },
};

const isComponent = (name: string, v: unknown) =>
  /^[A-Z]/.test(name) &&
  (typeof v === 'function' || (typeof v === 'object' && v !== null && '$$typeof' in v));

const exported = Object.entries({ ...Lib, ...Patterns }).filter(([n, v]) => isComponent(n, v)) as [
  string,
  React.ComponentType<Props>,
][];

it('covers every exported component (add a CASES or SKIP entry for new exports)', () => {
  const names = exported.map(([n]) => n);
  expect(names.filter((n) => !(n in CASES) && !(n in SKIP))).toEqual([]);
  expect(Object.keys(CASES).filter((n) => !names.includes(n))).toEqual([]); // no stale entries
});

describe.each(exported.filter(([n]) => n in CASES))('%s', (name, Component) => {
  const { props, a11y, within = (el) => el } = CASES[name]!;
  let errors: jest.SpyInstance, warns: jest.SpyInstance;
  beforeEach(() => {
    errors = jest.spyOn(console, 'error');
    warns = jest.spyOn(console, 'warn');
  });
  afterEach(() => {
    errors.mockRestore();
    warns.mockRestore();
  });

  it('renders in the provider with no console errors or warnings', async () => {
    await render(
      <Lib.NexubNativeProvider scheme="light" contrast="standard" locale="en-US">
        <Lib.ToastProvider>{within(<Component {...props} />)}</Lib.ToastProvider>
      </Lib.NexubNativeProvider>,
    );
    if (typeof a11y === 'string') expect(screen.getByLabelText(a11y)).toBeTruthy();
    else if (a11y) expect(screen.getByRole(a11y[0], { name: a11y[1] })).toBeTruthy();
    expect(errors).not.toHaveBeenCalled();
    expect(warns).not.toHaveBeenCalled();
  });

  // 9.4: every environment. Text grows with the OS font size (to 200% and beyond), and
  // nothing is laid out in reverse, so the screen-reader order is the visual order.
  it('lets text scale with the OS setting and keeps reading order', async () => {
    await render(
      <Lib.NexubNativeProvider scheme="light" contrast="standard" locale="en-US">
        <Lib.ToastProvider>{within(<Component {...props} />)}</Lib.ToastProvider>
      </Lib.NexubNativeProvider>,
    );
    type Node = { type: string; props: Record<string, unknown>; children: (Node | string)[] | null };
    const capped: string[] = [];
    const reversed: string[] = [];
    const walk = (n: Node | string | null) => {
      if (!n || typeof n === 'string') return;
      const style = (StyleSheet.flatten(n.props.style as never) ?? {}) as { flexDirection?: string };
      if (/reverse/.test(style.flexDirection ?? '')) reversed.push(`${n.type} ${style.flexDirection}`);
      if (n.type === 'Text' || n.type === 'TextInput') {
        const cap = n.props.maxFontSizeMultiplier as number | undefined;
        // display and headline roles are capped at 1.3 and 1.6 on purpose (they are already large).
        if (n.props.allowFontScaling === false || (cap !== undefined && cap !== 0 && cap < 1.3)) {
          capped.push(`${n.type} cap=${String(n.props.allowFontScaling === false ? 'off' : cap)}`);
        }
      }
      (n.children ?? []).forEach(walk);
    };
    const tree = screen.toJSON() as Node | Node[] | null;
    (Array.isArray(tree) ? tree : [tree]).forEach(walk);
    expect(capped).toEqual(FIXED_TEXT[name] ?? []);
    expect(reversed).toEqual([]);
  });
});

it('Bold Text (iOS) steps the Nexub faces up a weight, live', async () => {
  (AccessibilityInfo.isBoldTextEnabled as jest.Mock).mockResolvedValueOnce(true);
  const listen = AccessibilityInfo.addEventListener as jest.Mock;
  listen.mockClear();
  await render(
    <Lib.NexubNativeProvider scheme="light" contrast="standard">
      <Lib.Text>Body</Lib.Text>
    </Lib.NexubNativeProvider>,
  );
  const family = () => (StyleSheet.flatten(screen.getByText('Body').props.style) as { fontFamily: string }).fontFamily;
  await waitFor(() => expect(family()).toBe('Inter_600SemiBold'));
  // The setting changes while the app is open.
  const emit = listen.mock.calls.find(([event]) => event === 'boldTextChanged')![1] as (on: boolean) => void;
  await act(async () => emit(false));
  expect(family()).toBe('Inter_400Regular');
});

it('light and dark switch while mounted, without remounting the tree', async () => {
  const scheme = mockColorScheme;
  scheme.mockReturnValue('light');
  const mounts = jest.fn();
  function Probe() {
    React.useEffect(mounts, []);
    return <Lib.Text>Body</Lib.Text>;
  }
  // A fresh element each time: React skips a re-render of the identical element.
  const ui = () => (
    <Lib.NexubNativeProvider scheme="system" contrast="standard">
      <Probe />
    </Lib.NexubNativeProvider>
  );
  const view = await render(ui());
  const color = () => (StyleSheet.flatten(screen.getByText('Body').props.style) as { color: string }).color;
  const light = color();
  scheme.mockReturnValue('dark');
  await view.rerender(ui());
  expect(color()).not.toBe(light);
  expect(mounts).toHaveBeenCalledTimes(1);
  scheme.mockReturnValue('light');
});
