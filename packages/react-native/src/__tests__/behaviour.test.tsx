// 8.2 (T1): behaviour tests for components the suite never exercised —
// overlays and inputs first, then display, feedback, mobile and primitives.
import * as React from 'react';
import { ActionSheetIOS, AppState, Platform, StyleSheet, Text as RNText, type AppStateStatus } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { Plus } from '@nexub/icons/native';
import * as ScreenCapture from 'expo-screen-capture';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import {
  Accordion,
  ActionSheet,
  Avatar,
  AvatarGroup,
  BottomSheet,
  Banner,
  Button,
  ButtonGroup,
  Card,
  Carousel,
  Coachmark,
  DateTimeField,
  Dialog,
  Divider,
  FilterChip,
  Icon,
  Inline,
  Link,
  LoadingIndicator,
  NexubNativeProvider,
  NumericKeypad,
  OfflineBanner,
  PasswordInput,
  PrivacyShield,
  ScreenContainer,
  SearchField,
  Slider,
  Stack,
  StickyFooter,
  Switch,
  TextField,
  useTheme,
} from '../index';

jest.mock('expo-haptics', () => ({
  selectionAsync: jest.fn(() => Promise.resolve()),
  impactAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: {},
  NotificationFeedbackType: {},
  AndroidHaptics: {},
}));
jest.mock('expo-screen-capture', () => ({
  preventScreenCaptureAsync: jest.fn(() => Promise.resolve()),
  allowScreenCaptureAsync: jest.fn(() => Promise.resolve()),
}));
jest.mock('@react-native-community/datetimepicker', () => {
  /* eslint-disable @typescript-eslint/no-require-imports -- jest.mock factories can't use imports */
  const { View } = require('react-native');
  const { createElement } = require('react');
  /* eslint-enable @typescript-eslint/no-require-imports */
  const Picker = (props: object) => createElement(View, { testID: 'picker', ...props });
  return { __esModule: true, default: Picker, DateTimePickerAndroid: { open: jest.fn() } };
});

// Sheets unmount from the close spring's completion; land springs at once.
// eslint-disable-next-line @typescript-eslint/no-require-imports -- patching the jest.setup stub
const Reanimated = require('react-native-reanimated');
Reanimated.withSpring = (to: number, _c: unknown, done?: (f: boolean) => void) => (done?.(true), to);
Reanimated.runOnJS = (fn: (...a: unknown[]) => void) => fn;

const Provider = ({ children }: { children: React.ReactNode }) => (
  <NexubNativeProvider scheme="light" contrast="standard" locale="en-US">
    {children}
  </NexubNativeProvider>
);
const wrap = (ui: React.ReactElement) => render(ui, { wrapper: Provider });
const style = (el: { props: { style?: unknown } }) => StyleSheet.flatten(el.props.style as never) ?? {};
/** Containers with a role (alert, summary) that aren't single accessible elements. */
const withRole = (role: string) => screen.container.queryAll((n) => n.props.accessibilityRole === role);
const hostWith = (prop: string) => screen.container.queryAll((n) => typeof n.props[prop] === 'function')[0]!;
/** The scrim: a pressable hidden from assistive tech. */
const scrim = () =>
  screen.container.queryAll(
    (n) => n.props.importantForAccessibility === 'no-hide-descendants' && typeof n.props.onClick === 'function',
  )[0]!;

const withOS = async (os: typeof Platform.OS, fn: () => Promise<void>) => {
  const prev = Platform.OS;
  Platform.OS = os;
  try {
    await fn();
  } finally {
    Platform.OS = prev;
  }
};

// ─── Overlays ────────────────────────────────────────────────────────────────

describe('Dialog', () => {
  const dialog = (props: Partial<React.ComponentProps<typeof Dialog>> = {}) => (
    <Dialog
      open
      onOpenChange={jest.fn()}
      title="Delete card?"
      description="This can’t be undone."
      actions={<Button onPress={() => {}}>Delete</Button>}
      {...props}
    />
  );

  it('is a modal alert with a header, description and actions', async () => {
    const onDelete = jest.fn();
    await wrap(dialog({ actions: <Button onPress={onDelete}>Delete</Button> }));
    expect(withRole('alert')).toHaveLength(1);
    expect(screen.getByRole('header', { name: 'Delete card?' })).toBeTruthy();
    expect(screen.getByText('This can’t be undone.')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Delete' }));
    expect(onDelete).toHaveBeenCalled();
  });

  it('renders nothing while closed', async () => {
    await wrap(dialog({ open: false }));
    expect(screen.queryByText('Delete card?')).toBeNull();
  });

  it('Android back and the scrim close it when dismissable', async () => {
    const onOpenChange = jest.fn();
    await wrap(dialog({ onOpenChange }));
    await fireEvent(hostWith('onRequestClose'), 'requestClose');
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    onOpenChange.mockClear();
    await fireEvent.press(scrim());
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('the deprecated dismissable={false} alias still ignores back and the scrim', async () => {
    const onOpenChange = jest.fn();
    await wrap(dialog({ onOpenChange, dismissable: false }));
    await fireEvent(hostWith('onRequestClose'), 'requestClose');
    await fireEvent.press(scrim());
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});

describe('BottomSheet', () => {
  const sheet = (props: Partial<React.ComponentProps<typeof BottomSheet>> = {}) => (
    <BottomSheet open onOpenChange={jest.fn()} title="Filters" {...props}>
      <RNText>body</RNText>
    </BottomSheet>
  );

  it('shows its title and content; the grabber only cycles with 2+ detents', async () => {
    await wrap(sheet());
    expect(screen.getByRole('header', { name: 'Filters' })).toBeTruthy();
    expect(screen.getByText('body')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Resize' })).toBeDisabled();
    await screen.rerender(sheet({ detents: [0.4, 0.9] }));
    expect(screen.getByRole('button', { name: 'Resize' })).toBeEnabled();
  });

  it('back and the scrim close it; not when dismissible={false}', async () => {
    const onOpenChange = jest.fn();
    await wrap(sheet({ onOpenChange }));
    await fireEvent(hostWith('onRequestClose'), 'requestClose');
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    await fireEvent.press(scrim());
    expect(onOpenChange).toHaveBeenCalledTimes(2);
    await screen.rerender(sheet({ onOpenChange, dismissible: false }));
    await fireEvent(hostWith('onRequestClose'), 'requestClose');
    expect(onOpenChange).toHaveBeenCalledTimes(2);
  });

  it('mounts on open', async () => {
    await wrap(sheet({ open: false }));
    expect(screen.queryByText('body')).toBeNull();
    await screen.rerender(sheet({ open: true }));
    expect(screen.getByText('body')).toBeTruthy();
  });
});

describe('ActionSheet', () => {
  const actions = (onShare: () => void) => [
    { label: 'Share', onPress: onShare },
    { label: 'Archive', onPress: () => {}, disabled: true },
    { label: 'Delete', onPress: () => {}, destructive: true },
  ];

  it('iOS: opens the system sheet with enabled actions, destructive marked and Cancel last', async () => {
    const show = jest.spyOn(ActionSheetIOS, 'showActionSheetWithOptions').mockImplementation(() => {});
    const onShare = jest.fn();
    const onOpenChange = jest.fn();
    await wrap(<ActionSheet open onOpenChange={onOpenChange} title="Card" actions={actions(onShare)} />);
    const [opts, pick] = show.mock.lastCall!;
    expect(opts).toMatchObject({ title: 'Card', options: ['Share', 'Delete', 'Cancel'], cancelButtonIndex: 2, destructiveButtonIndex: [1] });
    pick(0);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(onShare).toHaveBeenCalled();
    show.mockRestore();
  });

  it('Android: a sheet of buttons; picking one closes and runs it', () =>
    withOS('android', async () => {
      const onShare = jest.fn();
      const onOpenChange = jest.fn();
      await wrap(<ActionSheet open onOpenChange={onOpenChange} message="Pick one" actions={actions(onShare)} />);
      expect(screen.getByText('Pick one')).toBeTruthy();
      expect(screen.getByRole('button', { name: 'Archive' })).toBeDisabled();
      await fireEvent.press(screen.getByRole('button', { name: 'Share' }));
      expect(onShare).toHaveBeenCalled();
      expect(onOpenChange).toHaveBeenCalledWith(false);
      await fireEvent.press(screen.getByRole('button', { name: 'Cancel' }));
      expect(onOpenChange).toHaveBeenCalledTimes(2);
    }));
});

// ─── Inputs ──────────────────────────────────────────────────────────────────

describe('Switch', () => {
  it('toggles uncontrolled and reports checked', async () => {
    const onChange = jest.fn();
    await wrap(<Switch label="Wi-Fi" onCheckedChange={onChange} />);
    const sw = screen.getByRole('switch', { name: 'Wi-Fi' });
    expect(sw).not.toBeChecked();
    await fireEvent(sw, 'valueChange', true);
    expect(onChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('switch', { name: 'Wi-Fi' })).toBeChecked();
  });

  it('controlled: follows `checked`, not its own toggle', async () => {
    const onChange = jest.fn();
    await wrap(<Switch label="Wi-Fi" checked={false} onCheckedChange={onChange} />);
    await fireEvent(screen.getByRole('switch', { name: 'Wi-Fi' }), 'valueChange', true);
    expect(onChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('switch', { name: 'Wi-Fi' })).not.toBeChecked();
  });

  it('disabled reaches the native switch (which reports it)', async () => {
    await wrap(<Switch label="Wi-Fi" disabled defaultChecked />);
    const sw = screen.getByRole('switch', { name: 'Wi-Fi' });
    expect(sw.props.disabled).toBe(true);
    expect(sw).toBeChecked();
  });
});

describe('Slider', () => {
  const adjust = (actionName: 'increment' | 'decrement') =>
    fireEvent(screen.getByRole('adjustable', { name: 'Volume' }), 'accessibilityAction', { nativeEvent: { actionName } });

  it('screen-reader increment/decrement move by step and clamp to the range', async () => {
    const onChange = jest.fn();
    await wrap(<Slider label="Volume" defaultValue={90} step={10} onValueChange={onChange} formatValue={(v) => `${v}%`} />);
    expect(screen.getByRole('adjustable', { name: 'Volume' })).toHaveAccessibilityValue({ min: 0, max: 100, now: 90, text: '90%' });
    await adjust('increment');
    expect(onChange).toHaveBeenLastCalledWith(100);
    await adjust('increment');
    expect(screen.getByRole('adjustable', { name: 'Volume' })).toHaveAccessibilityValue({ now: 100 });
    await adjust('decrement');
    expect(onChange).toHaveBeenLastCalledWith(90);
  });

  it('a drag snaps to the step under the finger', async () => {
    const onChange = jest.fn();
    await wrap(<Slider label="Volume" step={25} onValueChange={onChange} />);
    const s = screen.getByRole('adjustable', { name: 'Volume' });
    await fireEvent(s, 'layout', { nativeEvent: { layout: { width: 200 } } });
    await fireEvent(s, 'responderGrant', { nativeEvent: { locationX: 140, touches: [], changedTouches: [] }, touchHistory: { touchBank: [] } });
    expect(onChange).toHaveBeenLastCalledWith(75);
  });

  it('disabled: reported, and screen-reader actions do nothing', async () => {
    const onChange = jest.fn();
    await wrap(<Slider label="Volume" defaultValue={50} disabled onValueChange={onChange} />);
    expect(screen.getByRole('adjustable', { name: 'Volume' })).toBeDisabled();
    await adjust('increment');
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('TextField', () => {
  it('types, shows the helper, and an error replaces it as the hint', async () => {
    const onChangeText = jest.fn();
    await wrap(<TextField label="Email" helperText="We never share it" onChangeText={onChangeText} />);
    await fireEvent.changeText(screen.getByLabelText('Email'), 'a@b.co');
    expect(onChangeText).toHaveBeenCalledWith('a@b.co');
    expect(screen.getByLabelText('Email').props.accessibilityHint).toBe('We never share it');
    await screen.rerender(<TextField label="Email" helperText="We never share it" error="Enter a valid email" />);
    expect(screen.getByLabelText('Email').props.accessibilityHint).toBe('Enter a valid email');
    expect(screen.getByText('Enter a valid email')).toBeTruthy();
    expect(screen.queryByText('We never share it')).toBeNull();
  });

  it('disabled is not editable', async () => {
    await wrap(<TextField label="Email" disabled />);
    expect(screen.getByLabelText('Email').props.editable).toBe(false);
  });
});

describe('PasswordInput', () => {
  it('is masked with password autofill; the toggle reveals and hides it', async () => {
    const onChangeText = jest.fn();
    await wrap(<PasswordInput label="Password" onChangeText={onChangeText} />);
    const field = () => screen.getByLabelText('Password');
    expect(field().props.secureTextEntry).toBe(true);
    expect(field().props.textContentType).toBe('password');
    await fireEvent.changeText(field(), 'hunter2');
    expect(onChangeText).toHaveBeenCalledWith('hunter2');
    await fireEvent.press(screen.getByRole('button', { name: 'Show password' }));
    expect(field().props.secureTextEntry).toBe(false);
    await fireEvent.press(screen.getByRole('button', { name: 'Hide password' }));
    expect(field().props.secureTextEntry).toBe(true);
  });
});

describe('SearchField', () => {
  it('types, and Clear search empties it', async () => {
    const onChangeText = jest.fn();
    await wrap(<SearchField onChangeText={onChangeText} />);
    expect(screen.queryByRole('button', { name: 'Clear search' })).toBeNull();
    await fireEvent.changeText(screen.getByLabelText('Search'), 'coffee');
    expect(onChangeText).toHaveBeenLastCalledWith('coffee');
    await fireEvent.press(screen.getByRole('button', { name: 'Clear search' }));
    expect(onChangeText).toHaveBeenLastCalledWith('');
    expect(screen.getByLabelText('Search').props.value).toBe('');
  });
});

describe('FilterChip', () => {
  it('is a checkbox reporting `selected`', async () => {
    const onPress = jest.fn();
    await wrap(<FilterChip label="Food" selected onPress={onPress} />);
    const chip = screen.getByRole('checkbox', { name: 'Food' });
    expect(chip).toBeChecked();
    await fireEvent.press(chip);
    expect(onPress).toHaveBeenCalled();
  });
});

describe('DateTimeField', () => {
  const value = new Date(2026, 9, 30);

  it('reads its value; iOS opens a sheet whose picker sets the date', async () => {
    const onValueChange = jest.fn();
    await wrap(<DateTimeField label="Date" value={value} onValueChange={onValueChange} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Date, Oct 30, 2026' }));
    const next = new Date(2026, 10, 1);
    await fireEvent(screen.getByTestId('picker'), 'change', {}, next);
    expect(onValueChange).toHaveBeenCalledWith(next);
    await fireEvent.press(screen.getByRole('button', { name: 'Close' }));
  });

  it('shows the placeholder when empty; Android opens the system dialog', () =>
    withOS('android', async () => {
      const onValueChange = jest.fn();
      await wrap(<DateTimeField label="Date" value={null} onValueChange={onValueChange} />);
      await fireEvent.press(screen.getByRole('button', { name: 'Date, Pick a date' }));
      const { onChange } = (DateTimePickerAndroid.open as jest.Mock).mock.lastCall[0];
      onChange({ type: 'dismissed' }, value);
      expect(onValueChange).not.toHaveBeenCalled();
      onChange({ type: 'set' }, value);
      expect(onValueChange).toHaveBeenCalledWith(value);
    }));
});

describe('NumericKeypad', () => {
  it('sends digits and delete; the decimal key follows the locale', async () => {
    const onKey = jest.fn();
    await wrap(<NumericKeypad onKey={onKey} decimal locale="de-DE" />);
    await fireEvent.press(screen.getByRole('button', { name: '7' }));
    await fireEvent.press(screen.getByRole('button', { name: ',' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Delete' }));
    expect(onKey.mock.calls.map((c) => c[0])).toEqual(['7', ',', 'delete']);
  });

  it('no decimal key by default', async () => {
    await wrap(<NumericKeypad onKey={() => {}} />);
    expect(screen.queryByRole('button', { name: '.' })).toBeNull();
    expect(screen.getAllByRole('button')).toHaveLength(11);
  });
});

// ─── Actions, display, containers ────────────────────────────────────────────

describe('actions', () => {
  it('Link is a link that presses', async () => {
    const onPress = jest.fn();
    await wrap(<Link onPress={onPress}>Terms</Link>);
    await fireEvent.press(screen.getByRole('link', { name: 'Terms' }));
    expect(onPress).toHaveBeenCalled();
  });

  it('ButtonGroup orientation="vertical" makes its buttons full width', async () => {
    await wrap(
      <ButtonGroup orientation="vertical">
        <Button onPress={() => {}}>Pay</Button>
        <Button onPress={() => {}}>Cancel</Button>
      </ButtonGroup>,
    );
    for (const name of ['Pay', 'Cancel']) expect(style(screen.getByRole('button', { name })).alignSelf).toBe('stretch');
    await screen.rerender(
      <ButtonGroup>
        <Button onPress={() => {}}>Pay</Button>
      </ButtonGroup>,
    );
    expect(style(screen.getByRole('button', { name: 'Pay' })).alignSelf).toBe('flex-start');
  });

  it('the deprecated direction="stack" alias still stacks', async () => {
    await wrap(
      <ButtonGroup direction="stack">
        <Button onPress={() => {}}>Pay</Button>
      </ButtonGroup>,
    );
    expect(style(screen.getByRole('button', { name: 'Pay' })).alignSelf).toBe('stretch');
  });
});

describe('Avatar', () => {
  it('shows initials for a name and is one image element', async () => {
    await wrap(<Avatar name="ada lovelace byron" />);
    expect(screen.getByRole('image', { name: 'ada lovelace byron' })).toBeTruthy();
    expect(screen.getByText('AL')).toBeTruthy();
  });

  it('falls back to initials when the image fails', async () => {
    await wrap(<Avatar name="Ada Lovelace" src="https://example.com/a.png" />);
    expect(screen.queryByText('AL')).toBeNull();
    const img = screen.container.queryAll((n) => typeof n.props.onError === 'function')[0]!;
    await fireEvent(img, 'error');
    expect(screen.getByText('AL')).toBeTruthy();
  });

  it('without a name it is decorative', async () => {
    await wrap(<Avatar />);
    expect(screen.queryByRole('image')).toBeNull();
  });
});

describe('AvatarGroup', () => {
  it('shows `max` avatars and a "+N" with the full count read out', async () => {
    await wrap(
      <AvatarGroup max={2}>
        {['Ada', 'Ben', 'Cy', 'Di'].map((n) => (
          <Avatar key={n} name={n} />
        ))}
      </AvatarGroup>,
    );
    expect(screen.getAllByRole('image')).toHaveLength(2);
    expect(screen.getByLabelText('2 more')).toBeTruthy();
    expect(screen.getByText('+2')).toBeTruthy();
  });
});

describe('Divider', () => {
  it('is hidden from assistive tech', async () => {
    await wrap(<Divider testID="d" />);
    expect(screen.queryByTestId('d')).toBeNull();
    expect(screen.getByTestId('d', { includeHiddenElements: true })).toBeTruthy();
  });
});

describe('Card', () => {
  it('with onPress the whole card is one named button', async () => {
    const onPress = jest.fn();
    await wrap(
      <Card onPress={onPress} accessibilityLabel="Savings, $1,200">
        <RNText>Savings</RNText>
      </Card>,
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Savings, $1,200' }));
    expect(onPress).toHaveBeenCalled();
  });

  it('without onPress it is not a button', async () => {
    await wrap(
      <Card>
        <RNText>Savings</RNText>
      </Card>,
    );
    expect(screen.queryByRole('button')).toBeNull();
  });
});

describe('Accordion', () => {
  it('expands and collapses, reporting expanded', async () => {
    const onExpandedChange = jest.fn();
    await wrap(
      <Accordion title="Fees" onExpandedChange={onExpandedChange}>
        <RNText>No fees</RNText>
      </Accordion>,
    );
    const header = () => screen.getByRole('button', { name: 'Fees' });
    expect(header()).toBeCollapsed();
    expect(screen.queryByText('No fees')).toBeNull();
    await fireEvent.press(header());
    expect(onExpandedChange).toHaveBeenLastCalledWith(true);
    expect(header()).toBeExpanded();
    expect(screen.getByText('No fees')).toBeTruthy();
    await fireEvent.press(header());
    expect(screen.queryByText('No fees')).toBeNull();
  });

  it('controlled: stays as `expanded` says', async () => {
    await wrap(
      <Accordion title="Fees" expanded onExpandedChange={() => {}}>
        <RNText>No fees</RNText>
      </Accordion>,
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Fees' }));
    expect(screen.getByText('No fees')).toBeTruthy();
  });
});

// ─── Feedback ────────────────────────────────────────────────────────────────

describe('Banner', () => {
  it('danger and warning are alerts; info is a summary', async () => {
    await wrap(<Banner tone="danger" title="Payment failed">Try another card</Banner>);
    expect(withRole('alert')).toHaveLength(1);
    expect(screen.getByText('Payment failed')).toBeTruthy();
    expect(screen.getByText('Try another card')).toBeTruthy();
    await screen.rerender(<Banner>Heads up</Banner>);
    expect(withRole('alert')).toHaveLength(0);
    expect(withRole('summary')).toHaveLength(1);
  });

  it('onDismiss adds a Dismiss banner button', async () => {
    const onDismiss = jest.fn();
    await wrap(<Banner action={<Link onPress={() => {}}>Fix</Link>} onDismiss={onDismiss}>Heads up</Banner>);
    expect(screen.getByRole('link', { name: 'Fix' })).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Dismiss banner' }));
    expect(onDismiss).toHaveBeenCalled();
  });
});

it('LoadingIndicator is named "Loading…" unless labelled', async () => {
  await wrap(<LoadingIndicator />);
  expect(screen.getByLabelText('Loading…')).toBeTruthy();
  await screen.rerender(<LoadingIndicator label="Fetching rates" size="small" />);
  expect(screen.getByLabelText('Fetching rates')).toBeTruthy();
});

// ─── Mobile ──────────────────────────────────────────────────────────────────

describe('Carousel', () => {
  it('a page swipe updates the indicator and reports the index', async () => {
    const onIndexChange = jest.fn();
    await wrap(
      <Carousel data={['a', 'b', 'c']} width={300} onIndexChange={onIndexChange} renderItem={({ item }) => <RNText>{item}</RNText>} />,
    );
    expect(screen.getByLabelText('Page 1 of 3')).toBeTruthy();
    await fireEvent(hostWith('onMomentumScrollEnd'), 'momentumScrollEnd', { nativeEvent: { contentOffset: { x: 600, y: 0 } } });
    expect(onIndexChange).toHaveBeenCalledWith(2);
    expect(screen.getByLabelText('Page 3 of 3')).toBeTruthy();
  });
});

it('StickyFooter renders the body and keeps the footer action', async () => {
  const onPress = jest.fn();
  await wrap(
    <StickyFooter footer={<Button onPress={onPress}>Continue</Button>}>
      <RNText>Form</RNText>
    </StickyFooter>,
  );
  expect(screen.getByText('Form')).toBeTruthy();
  await fireEvent.press(screen.getByRole('button', { name: 'Continue' }));
  expect(onPress).toHaveBeenCalled();
});

describe('PrivacyShield', () => {
  it('covers the content while the app is in the background', async () => {
    let onChange!: (s: AppStateStatus) => void;
    const remove = jest.fn();
    jest.spyOn(AppState, 'addEventListener').mockImplementationOnce((_t, fn) => {
      onChange = fn as typeof onChange;
      return { remove } as never;
    });
    const r = await wrap(
      <PrivacyShield cover={<RNText>Nexub</RNText>}>
        <RNText>$12,480</RNText>
      </PrivacyShield>,
    );
    expect(screen.queryByText('Nexub', { includeHiddenElements: true })).toBeNull();
    await React.act(() => onChange('background'));
    expect(screen.getByText('Nexub', { includeHiddenElements: true })).toBeTruthy();
    await React.act(() => onChange('active'));
    expect(screen.queryByText('Nexub', { includeHiddenElements: true })).toBeNull();
    await r.unmount();
    expect(remove).toHaveBeenCalled();
  });

  it('preventCapture blocks screen capture until unmount', async () => {
    const r = await wrap(
      <PrivacyShield preventCapture>
        <RNText>secret</RNText>
      </PrivacyShield>,
    );
    expect(ScreenCapture.preventScreenCaptureAsync).toHaveBeenCalledWith('nexub-privacy-shield');
    await r.unmount();
    expect(ScreenCapture.allowScreenCaptureAsync).toHaveBeenCalledWith('nexub-privacy-shield');
  });
});

it('OfflineBanner shows the offline message only while offline', async () => {
  await wrap(<OfflineBanner offline={false} />);
  expect(withRole('alert')).toHaveLength(0);
  await screen.rerender(<OfflineBanner offline />);
  expect(withRole('alert')).toHaveLength(1);
  expect(screen.getByText('You’re offline. Some things may not be up to date.')).toBeTruthy();
});

it('Coachmark is an alert with a dismiss action', async () => {
  const onDismiss = jest.fn();
  await wrap(
    <Coachmark title="New" dismissLabel="Got it" onDismiss={onDismiss}>
      Swipe a row for actions
    </Coachmark>,
  );
  expect(withRole('alert')).toHaveLength(1);
  expect(screen.getByText('Swipe a row for actions')).toBeTruthy();
  await fireEvent.press(screen.getByRole('button', { name: 'Got it' }));
  expect(onDismiss).toHaveBeenCalled();
});

// ─── Primitives ──────────────────────────────────────────────────────────────

describe('layout primitives', () => {
  it('Stack and Inline space children with spacing tokens', async () => {
    let spacing!: Record<string, number>;
    function Probe() {
      spacing = useTheme().tokens.spacing as never;
      return null;
    }
    await wrap(
      <>
        <Probe />
        <Stack testID="stack" />
        <Inline testID="inline" gap="4" />
      </>,
    );
    expect(style(screen.getByTestId('stack')).gap).toBe(spacing['3']);
    expect(style(screen.getByTestId('inline'))).toMatchObject({ gap: spacing['4'], flexDirection: 'row', alignItems: 'center' });
  });

  it('Icon is coloured by a role', async () => {
    let roles!: Record<string, string>;
    function Probe() {
      roles = useTheme().roles as never;
      return null;
    }
    await wrap(
      <>
        <Probe />
        <Icon icon={Plus} color="primary" testID="icon" />
      </>,
    );
    expect(screen.getByTestId('icon', { includeHiddenElements: true })).toBeTruthy();
    expect(JSON.stringify(screen.toJSON())).toContain(roles.primary);
  });

  it('ScreenContainer scrolls by default and not with scroll={false}', async () => {
    await wrap(
      <ScreenContainer testID="sc">
        <RNText>body</RNText>
      </ScreenContainer>,
    );
    expect(screen.getByTestId('sc').type).toBe('RCTScrollView');
    await screen.rerender(
      <ScreenContainer scroll={false} testID="sc">
        <RNText>body</RNText>
      </ScreenContainer>,
    );
    expect(screen.queryByTestId('sc')?.type).not.toBe('RCTScrollView');
  });
});
