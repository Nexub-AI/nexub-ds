import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { native } from '@nexub/tokens/native';
import {
  Amount,
  Chip,
  ListItem,
  ListSection,
  NexubNativeProvider,
  SegmentedControl,
  nxEnter,
  nxExit,
  nxLayout,
  nxSpring,
} from '../index';
import { springSettleMs } from '../theme/motion';

jest.mock('expo-haptics', () => ({
  selectionAsync: jest.fn(() => Promise.resolve()),
  impactAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: {},
  NotificationFeedbackType: {},
  AndroidHaptics: {},
}));

type Recorded = { __name: string; __config: Record<string, unknown> };
const rec = (b: unknown) => b as Recorded;
const wrap = (ui: React.ReactElement) =>
  render(<NexubNativeProvider scheme="light" contrast="standard" fonts="system">{ui}</NexubNativeProvider>);

describe('motion presets ride the spring tokens', () => {
  it('nxSpring is the token config plus Reduce Motion', () => {
    expect(nxSpring('effects', 'slow')).toEqual({ ...native.motion.spring.effects.slow, reduceMotion: 'system' });
  });

  it('enter is timed to the spatial spring, decelerating', () => {
    const b = rec(nxEnter('up', 'fast'));
    expect(b.__name).toBe('FadeInUp');
    expect(b.__config).toMatchObject({
      duration: springSettleMs(native.motion.spring.spatial.fast),
      easing: { bezier: [0, 0, 0.2, 1] },
      reduceMotion: 'system',
    });
    // Physics springs left entering views invisible on iOS; never use them here.
    expect(b.__config.springify).toBeUndefined();
  });

  it('exit is timed to the effects spring: quicker than enter', () => {
    const b = rec(nxExit('down'));
    expect(b.__name).toBe('FadeOutDown');
    expect(b.__config).toMatchObject({ duration: springSettleMs(native.motion.spring.effects.fast), reduceMotion: 'system' });
    expect(b.__config.duration as number).toBeLessThan(rec(nxEnter('up')).__config.duration as number);
  });

  it('settle times are sane', () => {
    for (const fam of Object.values(native.motion.spring)) {
      for (const s of Object.values(fam)) {
        const ms = springSettleMs(s);
        expect(ms).toBeGreaterThan(80);
        expect(ms).toBeLessThan(1500);
      }
    }
  });

  it('exit toward the start edge follows RTL', () => {
    expect(rec(nxExit('start')).__name).toBe('SlideOutLeft');
    expect(rec(nxExit('start', 'fast', true)).__name).toBe('SlideOutRight');
    expect(rec(nxExit('end')).__name).toBe('SlideOutRight');
  });

  it('layout is timed to the spatial spring', () => {
    const b = rec(nxLayout());
    expect(b.__name).toBe('LinearTransition');
    expect(b.__config).toMatchObject({ duration: springSettleMs(native.motion.spring.spatial.default), reduceMotion: 'system' });
  });

  it('every spring is at most critically damped for effects (no overshoot)', () => {
    for (const s of Object.values(native.motion.spring.effects)) {
      expect(s.damping).toBeGreaterThanOrEqual(2 * Math.sqrt(s.stiffness * s.mass) - 0.01);
    }
  });
});

describe('animated components keep their behaviour', () => {
  it('ListSection still renders and orders its rows', async () => {
    await wrap(
      <ListSection header="Account">
        <ListItem key="a" title="Profile" />
        <ListItem key="b" title="Security" />
      </ListSection>,
    );
    expect(screen.getByText('Profile')).toBeTruthy();
    expect(screen.getByText('Security')).toBeTruthy();
  });

  it('Amount with animate shows the same figure', async () => {
    await wrap(<Amount value={12.5} currency="SGD" locale="en-SG" animate />);
    expect(screen.getByText(/12\.50/)).toBeTruthy();
  });

  it('Chip toggles its checked state', async () => {
    const onPress = jest.fn();
    const { rerender } = await wrap(<Chip label="Food" selected={false} onPress={onPress} />);
    await fireEvent.press(screen.getByRole('checkbox', { name: 'Food' }));
    expect(onPress).toHaveBeenCalled();
    await rerender(<NexubNativeProvider scheme="light" contrast="standard" fonts="system"><Chip label="Food" selected onPress={onPress} /></NexubNativeProvider>);
    expect(screen.getByRole('checkbox', { name: 'Food' })).toBeChecked();
  });

  it('SegmentedControl keeps tab semantics with the sliding pill', async () => {
    await wrap(
      <SegmentedControl
        label="Period"
        options={[{ value: 'd', label: 'Day' }, { value: 'w', label: 'Week' }]}
      />,
    );
    const track = screen.getByLabelText('Period');
    await fireEvent(track, 'layout', { nativeEvent: { layout: { width: 206, height: 40, x: 0, y: 0 } } });
    await fireEvent.press(screen.getByRole('tab', { name: 'Week' }));
    expect(screen.getByRole('tab', { name: 'Week' })).toBeSelected();
    expect(screen.getByRole('tab', { name: 'Day' })).not.toBeSelected();
  });
});
