// Gestures run through react-native-gesture-handler. Each one is driven here
// through its handler (fireGestureHandler), the way the native side would.
import * as React from 'react';
import { Text as RNText } from 'react-native';
import { State } from 'react-native-gesture-handler';
import { fireGestureHandler, getByGestureTestId } from 'react-native-gesture-handler/jest-utils';
import { fireEvent, render, screen } from '@testing-library/react-native';
import {
  BottomSheet,
  NexubNativeProvider,
  Slider,
  SwipeableRow,
  ToastProvider,
  useToast,
} from '../index';
import { sheetRelease } from '../components/overlays';
import { toastRelease } from '../components/feedback';

// Land springs at once and report them finished (the setup stub drops the
// completion callback that exits now unmount from).
// eslint-disable-next-line @typescript-eslint/no-require-imports -- patching the jest.setup stub
const Reanimated = require('react-native-reanimated');
const withSpring = jest.fn((to: number, _c?: unknown, done?: (f: boolean) => void) => (done?.(true), to));
Reanimated.withSpring = withSpring;
beforeEach(() => withSpring.mockClear());

const wrap = (ui: React.ReactElement, dir?: 'ltr' | 'rtl') => (
  <NexubNativeProvider scheme="light" contrast="standard" dir={dir}>
    <ToastProvider>{ui}</ToastProvider>
  </NexubNativeProvider>
);

type Pan = { x?: number; translationX?: number; translationY?: number; velocityX?: number; velocityY?: number };
/** Touch down at `from`, move through `moves`, lift with the last move's values. */
const pan = (testID: string, moves: Pan[], from: Pan = {}) =>
  React.act(async () =>
    fireGestureHandler(getByGestureTestId(testID), [
      { state: State.BEGAN, translationX: 0, translationY: 0, velocityX: 0, velocityY: 0, ...from },
      { state: State.ACTIVE, translationX: 0, translationY: 0, velocityX: 0, velocityY: 0, ...from },
      ...moves.map((m) => ({ velocityX: 0, velocityY: 0, ...m })),
      { state: State.END, velocityX: 0, velocityY: 0, ...moves[moves.length - 1] },
    ]),
  );

describe('sheetRelease', () => {
  // Detents at translateY 400 (short) and 0 (tall).
  const offsets = [400, 0];
  it('closes past the threshold or on a fast downward flick', () => {
    expect(sheetRelease(490, 0, offsets, true)).toBe(-1);
    expect(sheetRelease(300, 1500, offsets, true)).toBe(-1);
    expect(sheetRelease(490, 1500, offsets, false)).not.toBe(-1);
  });
  it('snaps to the detent the fling carries it toward', () => {
    expect(sheetRelease(180, 0, offsets, true)).toBe(1);
    expect(sheetRelease(180, 800, offsets, true)).toBe(0); // flung down
    expect(sheetRelease(250, -1000, offsets, true)).toBe(1); // flung up
  });
});

describe('toastRelease', () => {
  it('dismisses on distance or a flick, following the flick', () => {
    expect(toastRelease(20, 0)).toBe(0);
    expect(toastRelease(120, 0)).toBe(1);
    expect(toastRelease(-120, 0)).toBe(-1);
    expect(toastRelease(20, -900)).toBe(-1);
  });
});

describe('exit springs', () => {
  it('BottomSheet unmounts when its close spring lands', async () => {
    const sheet = (open: boolean) =>
      wrap(
        <BottomSheet open={open} onOpenChange={() => {}} title="Sheet">
          <RNText>body</RNText>
        </BottomSheet>,
      );
    const r = await render(sheet(true));
    expect(screen.getByText('Sheet')).toBeTruthy();
    await r.rerender(sheet(false));
    expect(screen.queryByText('Sheet')).toBeNull();
  });

  it('toast action dismisses through the exit spring', async () => {
    const onPress = jest.fn();
    function Go() {
      const toast = useToast();
      return (
        <RNText
          accessibilityRole="button"
          onPress={() => toast({ message: 'Deleted', action: { label: 'Undo', onPress } })}
        >
          go
        </RNText>
      );
    }
    await render(wrap(<Go />));
    await fireEvent.press(screen.getByRole('button', { name: 'go' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Undo' }));
    expect(onPress).toHaveBeenCalled();
    expect(screen.queryByText('Deleted')).toBeNull();
  });
});

describe('BottomSheet drag', () => {
  // The jest window is 750 x 1334: detents rest at translateY 667 (short) and 0 (tall).
  const sheet = (onOpenChange: (o: boolean) => void, dismissible = true) =>
    wrap(
      <BottomSheet open onOpenChange={onOpenChange} detents={[0.4, 0.9]} dismissible={dismissible} title="Sheet">
        <RNText>body</RNText>
      </BottomSheet>,
    );
  const rest = () => withSpring.mock.lastCall![0];

  it('a short drag springs back to its detent', async () => {
    const onOpenChange = jest.fn();
    await render(sheet(onOpenChange));
    await pan('nx-sheet-drag', [{ translationY: 20 }, { translationY: 50 }]);
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(rest()).toBeCloseTo(667);
  });

  it('a drag past the threshold, or a fast flick down, closes it', async () => {
    const onOpenChange = jest.fn();
    await render(sheet(onOpenChange));
    await pan('nx-sheet-drag', [{ translationY: 200 }]);
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    await pan('nx-sheet-drag', [{ translationY: 30, velocityY: 1500 }]);
    expect(onOpenChange).toHaveBeenCalledTimes(2);
  });

  it('a drag up snaps to the taller detent, carrying the release velocity', async () => {
    const onOpenChange = jest.fn();
    await render(sheet(onOpenChange));
    await pan('nx-sheet-drag', [{ translationY: -500, velocityY: -300 }]);
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(withSpring).toHaveBeenLastCalledWith(0, expect.objectContaining({ velocity: -300 }));
  });

  it('not dismissible: the same drag settles on a detent instead', async () => {
    const onOpenChange = jest.fn();
    await render(sheet(onOpenChange, false));
    await pan('nx-sheet-drag', [{ translationY: 200 }]);
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(rest()).toBeCloseTo(667);
  });
});

describe('SwipeableRow swipe', () => {
  const row = (dir?: 'ltr' | 'rtl') =>
    wrap(
      <SwipeableRow label="Amazon" actions={[{ label: 'Delete', onPress: () => {} }]}>
        <RNText>Amazon</RNText>
      </SwipeableRow>,
      dir,
    );
  const rest = () => withSpring.mock.lastCall![0];

  it('past half the actions reveals them; a short swipe springs back', async () => {
    await render(row());
    await pan('nx-swipe-row:Amazon', [{ translationX: -20 }]);
    expect(rest()).toBe(0);
    await pan('nx-swipe-row:Amazon', [{ translationX: -60 }]);
    expect(rest()).toBe(-80); // one 80pt action
    // Open: a swipe back toward the end edge closes it.
    await pan('nx-swipe-row:Amazon', [{ translationX: 60 }]);
    expect(rest()).toBe(0);
  });

  it('RTL: opens toward the other side', async () => {
    await render(row('rtl'));
    await pan('nx-swipe-row:Amazon', [{ translationX: 60 }]);
    expect(rest()).toBe(80);
  });
});

describe('Toast swipe', () => {
  function Go() {
    const toast = useToast();
    return (
      <RNText accessibilityRole="button" onPress={() => toast({ message: 'Saved' })}>
        go
      </RNText>
    );
  }
  const show = async () => {
    await render(wrap(<Go />));
    await fireEvent.press(screen.getByRole('button', { name: 'go' }));
    expect(screen.getByText('Saved')).toBeTruthy();
  };

  it('a short drag keeps it', async () => {
    await show();
    await pan('nx-toast-swipe', [{ translationX: 40 }]);
    expect(screen.getByText('Saved')).toBeTruthy();
  });

  it('a fling dismisses it toward the fling', async () => {
    await show();
    await pan('nx-toast-swipe', [{ translationX: -20, velocityX: -900 }]);
    expect(withSpring.mock.lastCall![0]).toBeLessThan(0);
    expect(screen.queryByText('Saved')).toBeNull();
  });

  it('a long drag dismisses it', async () => {
    await show();
    await pan('nx-toast-swipe', [{ translationX: 120 }]);
    expect(screen.queryByText('Saved')).toBeNull();
  });
});

describe('Slider drag', () => {
  const slider = async (props: Partial<React.ComponentProps<typeof Slider>> = {}, dir?: 'ltr' | 'rtl') => {
    const onValueChange = jest.fn();
    await render(wrap(<Slider label="Volume" onValueChange={onValueChange} {...props} />, dir));
    await fireEvent(screen.getByRole('adjustable', { name: 'Volume' }), 'layout', {
      nativeEvent: { layout: { width: 200 } },
    });
    return onValueChange;
  };

  it('touch down sets the value, the drag follows in steps', async () => {
    const onValueChange = await slider({ step: 25 });
    await pan('nx-slider:Volume', [{ x: 150 }, { x: 20 }], { x: 140 });
    expect(onValueChange.mock.calls.map(([v]) => v)).toEqual([75, 0]); // 150 is still 75: no repeat
    expect(screen.getByRole('adjustable', { name: 'Volume' })).toHaveAccessibilityValue({ now: 0 });
  });

  it('stays within min and max', async () => {
    const onValueChange = await slider({ min: 10, max: 20 });
    await pan('nx-slider:Volume', [{ x: 500 }], { x: 100 });
    expect(onValueChange.mock.calls.map(([v]) => v)).toEqual([15, 20]);
    await pan('nx-slider:Volume', [{ x: -50 }], { x: 100 });
    expect(onValueChange).toHaveBeenLastCalledWith(10);
  });

  it('RTL: the value grows toward the start edge', async () => {
    const onValueChange = await slider({ step: 25 }, 'rtl');
    await pan('nx-slider:Volume', [{ x: 0 }], { x: 140 });
    expect(onValueChange.mock.calls.map(([v]) => v)).toEqual([25, 100]);
  });

  it('disabled: the drag does nothing', async () => {
    const onValueChange = await slider({ disabled: true });
    await pan('nx-slider:Volume', [{ x: 20 }], { x: 140 });
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
