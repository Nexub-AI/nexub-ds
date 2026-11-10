import * as React from 'react';
import { Text as RNText } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { BottomSheet, NexubNativeProvider, ToastProvider, useToast } from '../index';
import { sheetRelease } from '../components/overlays';
import { toastRelease } from '../components/feedback';

// Land springs at once and report them finished (the setup stub drops the
// completion callback that exits now unmount from).
// eslint-disable-next-line @typescript-eslint/no-require-imports -- patching the jest.setup stub
const Reanimated = require('react-native-reanimated');
Reanimated.withSpring = (to: number, _c: unknown, done?: (f: boolean) => void) => (done?.(true), to);
Reanimated.runOnJS = (fn: (...a: unknown[]) => void) => fn;

const wrap = (ui: React.ReactElement) => (
  <NexubNativeProvider scheme="light" contrast="standard">
    <ToastProvider>{ui}</ToastProvider>
  </NexubNativeProvider>
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
