import * as React from 'react';
import { Platform, Text as RNText } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import * as Haptics from 'expo-haptics';
import { native } from '@nexub/tokens/native';
import {
  Banner,
  NexubNativeProvider,
  ToastProvider,
  nxPreset,
  playHaptic,
  presetHaptic,
  useToast,
  type NexubNativeProviderProps,
} from '../index';

jest.mock('expo-haptics', () => ({
  selectionAsync: jest.fn(() => Promise.resolve()),
  impactAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
  performAndroidHapticsAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium' },
  NotificationFeedbackType: { Success: 'success', Error: 'error', Warning: 'warning' },
  AndroidHaptics: { Segment_Tick: 'segment-tick', Confirm: 'confirm', Reject: 'reject' },
}));

const notify = Haptics.notificationAsync as jest.Mock;
const wrap = (ui: React.ReactElement, props: Partial<NexubNativeProviderProps> = {}) =>
  render(
    <NexubNativeProvider scheme="light" contrast="standard" fonts="system" {...props}>
      <ToastProvider>{ui}</ToastProvider>
    </NexubNativeProvider>,
  );

beforeEach(() => jest.clearAllMocks());

describe('motion presets by intent (12.3)', () => {
  it('nxPreset is the aliased spring plus Reduce Motion', () => {
    expect(nxPreset('enter')).toEqual({ ...native.motion.spring.spatial.default, reduceMotion: 'system' });
    expect(nxPreset('exit')).toEqual({ ...native.motion.spring.effects.fast, reduceMotion: 'system' });
    expect(nxPreset('emphasis')).toEqual({ ...native.motion.spring.expressive.fast, reduceMotion: 'system' });
    expect(nxPreset('success')).toEqual({ ...native.motion.spring.expressive.default, reduceMotion: 'system' });
    expect(nxPreset('attention')).toEqual({ ...native.motion.spring.spatial.fast, reduceMotion: 'system' });
  });

  it('pairs success, attention and emphasis with a haptic; enter and exit stay silent', () => {
    expect(presetHaptic).toEqual({
      enter: undefined,
      exit: undefined,
      emphasis: 'selection',
      success: 'success',
      attention: 'warning',
    });
  });
});

describe('haptics', () => {
  it('success plays the success notification on iOS', () => {
    playHaptic('success');
    expect(notify).toHaveBeenCalledWith('success');
  });

  it('success plays Confirm on Android', () => {
    const os = Platform.OS;
    Object.defineProperty(Platform, 'OS', { value: 'android', configurable: true });
    try {
      playHaptic('success');
      expect(Haptics.performAndroidHapticsAsync).toHaveBeenCalledWith('confirm');
    } finally {
      Object.defineProperty(Platform, 'OS', { value: os, configurable: true });
    }
  });

  it('is a no-op where the platform has none', () => {
    const os = Platform.OS;
    Object.defineProperty(Platform, 'OS', { value: 'web', configurable: true });
    try {
      playHaptic('success');
      expect(notify).not.toHaveBeenCalled();
    } finally {
      Object.defineProperty(Platform, 'OS', { value: os, configurable: true });
    }
  });
});

describe('Banner haptic', () => {
  it('is silent by default', async () => {
    await wrap(<Banner tone="success" title="Saved" />);
    expect(notify).not.toHaveBeenCalled();
  });

  it('plays the tone haptic when opted in', async () => {
    await wrap(<Banner tone="success" title="Saved" haptic />);
    expect(notify).toHaveBeenCalledWith('success');
  });

  it('plays warning for a warning banner', async () => {
    await wrap(<Banner tone="warning" title="Low balance" haptic />);
    expect(notify).toHaveBeenCalledWith('warning');
  });

  it('stays silent for info, and when the user turned haptics off', async () => {
    await wrap(<Banner tone="info" title="Heads up" haptic />);
    await wrap(<Banner tone="success" title="Saved" haptic />, { haptics: false });
    expect(notify).not.toHaveBeenCalled();
  });
});

describe('Toast haptic', () => {
  function Saver({ haptic }: { haptic?: boolean }) {
    const toast = useToast();
    return (
      <RNText accessibilityRole="button" onPress={() => toast({ message: 'Saved', tone: 'success', haptic })}>
        save
      </RNText>
    );
  }

  it('is silent by default', async () => {
    await wrap(<Saver />);
    await fireEvent.press(screen.getByRole('button', { name: 'save' }));
    expect(screen.getByText('Saved')).toBeTruthy();
    expect(notify).not.toHaveBeenCalled();
  });

  it('plays the tone haptic when the toast asks for it', async () => {
    await wrap(<Saver haptic />);
    await fireEvent.press(screen.getByRole('button', { name: 'save' }));
    expect(notify).toHaveBeenCalledWith('success');
  });
});
