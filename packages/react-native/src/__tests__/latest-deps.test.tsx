// 8.4 (A3): hooks that used to silence exhaustive-deps. Each effect or gesture
// responder must run on its own trigger only: a parent re-render with a new
// inline callback or array must not replay springs, re-present sheets or
// rebuild a responder mid-drag, and the newest callback is the one called.
import * as React from 'react';
import { ActionSheetIOS, PanResponder, Text as RNText } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import {
  ActionSheet,
  BottomSheet,
  MoneyInput,
  NexubNativeProvider,
  Slider,
  SwipeableRow,
  ToastProvider,
  useToast,
} from '../index';
import { ActivityList } from '../patterns';

jest.mock('expo-haptics', () => ({
  selectionAsync: jest.fn(() => Promise.resolve()),
  impactAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: {},
  NotificationFeedbackType: {},
  AndroidHaptics: {},
}));

// Count springs; never land them (so nothing unmounts under the test).
// eslint-disable-next-line @typescript-eslint/no-require-imports -- patching the jest.setup stub
const Reanimated = require('react-native-reanimated');
const withSpring = jest.fn((to: number) => to);
Reanimated.withSpring = withSpring;

type Config = Parameters<typeof PanResponder.create>[0];
const create = jest.spyOn(PanResponder, 'create');
const lastConfig = () => create.mock.lastCall![0] as Required<Config>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- handlers only read the fields we pass
const g = (o: object) => ({ dx: 0, dy: 0, vx: 0, vy: 0, ...o }) as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ev = (o: object = {}) => ({ nativeEvent: { locationX: 0, ...o } }) as any;

const Provider = ({ children }: { children: React.ReactNode }) => (
  <NexubNativeProvider scheme="light" contrast="standard" locale="en-US">
    {children}
  </NexubNativeProvider>
);
const wrap = (ui: React.ReactElement) => render(ui, { wrapper: Provider });

beforeEach(() => {
  withSpring.mockClear();
  create.mockClear();
});

describe('BottomSheet', () => {
  const sheet = (onOpenChange: (o: boolean) => void) => (
    <BottomSheet open onOpenChange={onOpenChange} detents={['content', 0.9]} title="Sheet">
      <RNText>body</RNText>
    </BottomSheet>
  );

  it('re-render with new detents/onOpenChange keeps the open spring and responder; drag-dismiss calls the latest', async () => {
    const first = jest.fn();
    const latest = jest.fn();
    await wrap(sheet(first));
    const springs = withSpring.mock.calls.length;
    const responders = create.mock.calls.length;
    expect(springs).toBeGreaterThan(0);
    await screen.rerender(sheet(latest));
    expect(withSpring).toHaveBeenCalledTimes(springs);
    expect(create).toHaveBeenCalledTimes(responders);
    lastConfig().onPanResponderRelease(ev(), g({ dy: 2000, vy: 3 }));
    expect(latest).toHaveBeenCalledWith(false);
    expect(first).not.toHaveBeenCalled();
  });

  it('re-fits once when content is measured, not again on a detent snap', async () => {
    await wrap(sheet(() => {}));
    let body = screen.getByText('body');
    while (typeof body.props.onLayout !== 'function') body = body.parent!;
    withSpring.mockClear();
    await fireEvent(body, 'layout', { nativeEvent: { layout: { height: 300 } } });
    expect(withSpring).toHaveBeenCalledTimes(1);
    await fireEvent.press(screen.getByRole('button', { name: 'Resize' }));
    expect(withSpring).toHaveBeenCalledTimes(2); // the snap only
  });
});

describe('ActionSheet', () => {
  it('iOS: presents once per opening; the pick calls the latest onOpenChange', async () => {
    const show = jest
      .spyOn(ActionSheetIOS, 'showActionSheetWithOptions')
      .mockImplementation(() => {});
    const onShare = jest.fn();
    const first = jest.fn();
    const latest = jest.fn();
    const ui = (onOpenChange: (o: boolean) => void) => (
      <ActionSheet
        open
        onOpenChange={onOpenChange}
        actions={[{ label: 'Share', onPress: onShare }]}
      />
    );
    await wrap(ui(first));
    await screen.rerender(ui(latest));
    expect(show).toHaveBeenCalledTimes(1);
    show.mock.lastCall![1](0);
    expect(latest).toHaveBeenCalledWith(false);
    expect(first).not.toHaveBeenCalled();
    expect(onShare).toHaveBeenCalled();
    show.mockRestore();
  });
});

describe('MoneyInput', () => {
  it('controlled: typing is not overwritten while the amount stays the same', async () => {
    await wrap(<MoneyInput label="Amount" currency="USD" value={5} onValueChange={() => {}} />);
    expect(screen.getByLabelText('Amount').props.value).toBe('5');
    await fireEvent.changeText(screen.getByLabelText('Amount'), '7');
    expect(screen.getByLabelText('Amount').props.value).toBe('7');
    await screen.rerender(
      <MoneyInput label="Amount" currency="USD" value={9} onValueChange={() => {}} />,
    );
    expect(screen.getByLabelText('Amount').props.value).toBe('9');
  });
});

describe('Slider', () => {
  it('keeps one responder across re-renders; a drag reports to the latest onValueChange', async () => {
    const first = jest.fn();
    const latest = jest.fn();
    await wrap(<Slider label="Volume" step={25} onValueChange={first} />);
    const s = screen.getByRole('adjustable', { name: 'Volume' });
    const grant = s.props.onResponderGrant;
    await screen.rerender(<Slider label="Volume" step={25} onValueChange={latest} />);
    expect(screen.getByRole('adjustable', { name: 'Volume' }).props.onResponderGrant).toBe(grant);
    await fireEvent(screen.getByRole('adjustable', { name: 'Volume' }), 'layout', {
      nativeEvent: { layout: { width: 200 } },
    });
    await React.act(async () => lastConfig().onPanResponderGrant(ev({ locationX: 140 }), g({})));
    expect(latest).toHaveBeenLastCalledWith(75);
    expect(first).not.toHaveBeenCalled();
  });
});

describe('SwipeableRow', () => {
  it('keeps one responder across re-renders with new inline props', async () => {
    const row = (onPress: () => void) => (
      <SwipeableRow
        label="Row"
        onPress={onPress}
        actions={[{ label: 'Delete', onPress: () => {} }]}
      >
        <RNText>Row</RNText>
      </SwipeableRow>
    );
    await wrap(row(() => {}));
    const responders = create.mock.calls.length;
    await screen.rerender(row(() => {}));
    expect(create).toHaveBeenCalledTimes(responders);
    // The kept responder still settles open past half the actions' width.
    lastConfig().onPanResponderRelease(ev(), g({ dx: -200 }));
    expect(withSpring).toHaveBeenLastCalledWith(expect.any(Number), expect.anything());
    expect(withSpring.mock.lastCall![0]).toBeLessThan(0);
  });
});

describe('Toast', () => {
  it('a re-render of the host does not replay the entry spring or rebuild the swipe', async () => {
    let show: ReturnType<typeof useToast> = () => {};
    function Grab() {
      show = useToast();
      return null;
    }
    const host = (bottomOffset: number) => (
      <ToastProvider bottomOffset={bottomOffset}>
        <Grab />
      </ToastProvider>
    );
    await wrap(host(0));
    await React.act(async () => show({ message: 'Saved' }));
    expect(screen.getByText('Saved')).toBeTruthy();
    const springs = withSpring.mock.calls.length;
    const responders = create.mock.calls.length;
    await screen.rerender(host(24));
    expect(withSpring).toHaveBeenCalledTimes(springs);
    expect(create).toHaveBeenCalledTimes(responders);
  });
});

describe('ActivityList', () => {
  it('re-render with the same transactions does not regroup them', async () => {
    const tx = [
      { id: '1', title: 'Amazon', amount: -42.5, currency: 'USD', date: new Date(2026, 0, 2) },
    ];
    const DTF = jest.spyOn(Intl, 'DateTimeFormat');
    await wrap(<ActivityList transactions={tx} onPress={() => {}} />);
    const built = DTF.mock.calls.length;
    expect(built).toBeGreaterThan(0);
    await screen.rerender(<ActivityList transactions={tx} onPress={() => {}} />);
    expect(DTF).toHaveBeenCalledTimes(built);
    DTF.mockRestore();
  });
});
