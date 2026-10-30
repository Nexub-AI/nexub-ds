import * as React from 'react';
import { StyleSheet } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import * as Haptics from 'expo-haptics';
import { native } from '@nexub/tokens/native';
import {
  NexubNativeProvider,
  Pressable,
  Surface,
  Text,
  Heading,
  useTheme,
  type NexubNativeProviderProps,
} from '../index';

jest.mock('expo-haptics', () => ({
  selectionAsync: jest.fn(() => Promise.resolve()),
  impactAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
  performAndroidHapticsAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium' },
  NotificationFeedbackType: { Success: 'success', Error: 'error', Warning: 'warning' },
  AndroidHaptics: { Segment_Tick: 'segment-tick', Confirm: 'confirm' },
}));

const wrap = (ui: React.ReactElement, props: Partial<NexubNativeProviderProps> = {}) =>
  render(
    <NexubNativeProvider scheme="light" contrast="standard" {...props}>
      {ui}
    </NexubNativeProvider>,
  );

function Roles({ onTheme }: { onTheme: (t: ReturnType<typeof useTheme>) => void }) {
  onTheme(useTheme());
  return null;
}

describe('NexubNativeProvider', () => {
  it('resolves roles for scheme and contrast from @nexub/tokens/native', async () => {
    let theme!: ReturnType<typeof useTheme>;
    await wrap(<Roles onTheme={(t) => (theme = t)} />, { scheme: 'dark', contrast: 'high' });
    expect(theme.roles.primary).toBe(native.color.roles.high.dark.primary);
    expect(theme.elevation(0)).toBeUndefined();
    expect(theme.elevation(2)).toBe(native.elevation[2].dark);
  });

  it('a product remaps tertiary; a seed regenerates primary', async () => {
    let theme!: ReturnType<typeof useTheme>;
    await wrap(<Roles onTheme={(t) => (theme = t)} />, { product: 'payub', seed: '#ff0000' });
    expect(theme.roles.tertiary).toBe(native.color.products.payub.standard.light.tertiary);
    expect(theme.roles.primary).not.toBe(native.color.roles.standard.light.primary);
  });

  it('derives RTL from the locale and merges message overrides', async () => {
    let theme!: ReturnType<typeof useTheme>;
    await wrap(<Roles onTheme={(t) => (theme = t)} />, {
      locale: 'ar',
      messages: { close: 'إغلاق' },
    });
    expect(theme.dir).toBe('rtl');
    expect(theme.messages.close).toBe('إغلاق');
    expect(theme.messages.remove).toBe('Remove');
  });
});

describe('Text', () => {
  it('applies the type role, colour role and tabular figures', async () => {
    await wrap(
      <Text variant="title-md" color="primary" tabular>
        42
      </Text>,
    );
    const style = StyleSheet.flatten(screen.getByText('42').props.style);
    expect(style).toMatchObject({
      fontFamily: 'Inter_600SemiBold',
      fontSize: native.type['title-md'].size,
      lineHeight: native.type['title-md'].lineHeight,
      color: native.color.roles.standard.light.primary,
      fontVariant: ['tabular-nums'],
    });
  });

  it('uses fontWeight, not a file name, with system fonts', async () => {
    await wrap(<Text variant="label-lg">System</Text>, { fonts: 'system' });
    const style = StyleSheet.flatten(screen.getByText('System').props.style);
    expect(style.fontFamily).toBeUndefined();
    expect(style.fontWeight).toBe('500');
  });

  it('Heading is announced as a header', async () => {
    await wrap(<Heading>Wallet</Heading>);
    expect(screen.getByRole('header', { name: 'Wallet' })).toBeTruthy();
  });
});

describe('Pressable', () => {
  it('is a button, calls onPress and plays its haptic', async () => {
    const onPress = jest.fn();
    await wrap(
      <Pressable onPress={onPress} haptic="selection" accessibilityLabel="Pick">
        <Text>Pick</Text>
      </Pressable>,
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Pick' }));
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(Haptics.selectionAsync).toHaveBeenCalledTimes(1);
  });

  it('plays no haptic when the user turned haptics off', async () => {
    (Haptics.selectionAsync as jest.Mock).mockClear();
    await wrap(
      <Pressable haptic="selection" accessibilityLabel="Pick">
        <Text>Pick</Text>
      </Pressable>,
      { haptics: false },
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Pick' }));
    expect(Haptics.selectionAsync).not.toHaveBeenCalled();
  });

  it('reports disabled to assistive tech', async () => {
    await wrap(
      <Pressable disabled accessibilityLabel="Send">
        <Text>Send</Text>
      </Pressable>,
    );
    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();
  });
});

describe('Surface', () => {
  it('glass falls back to surface-elevated + hairline when glass is off', async () => {
    await wrap(<Surface testID="s" material="glass" radius="container" />, { glass: 'off' });
    const style = StyleSheet.flatten(screen.getByTestId('s').props.style);
    expect(style).toMatchObject({
      backgroundColor: native.color.roles.standard.light['surface-elevated'],
      borderRadius: native.shape.container,
      borderColor: native.color.roles.standard.light['outline-variant'],
    });
  });
});
