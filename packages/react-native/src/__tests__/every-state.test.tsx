// 10.5 "Every state": the last static components move on the shared springs and
// screens make room for the keyboard. Springs are stubbed (jest.setup), so these
// check the resting states and the mount/unmount behaviour around them.
import * as React from 'react';
import { Keyboard, Platform, StyleSheet, Text as RNText, View } from 'react-native';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import {
  Accordion,
  Button,
  Checkbox,
  Dialog,
  NexubNativeProvider,
  PageIndicator,
  Progress,
  Radio,
  RadioGroup,
  ScreenContainer,
  TextField,
} from '../index';
import { native } from '@nexub/tokens/native';

// Land springs at once and report them finished (the setup stub drops the callback).
// eslint-disable-next-line @typescript-eslint/no-require-imports -- patching the jest.setup stub
const Reanimated = require('react-native-reanimated');
Reanimated.withSpring = (to: number, _c: unknown, done?: (f: boolean) => void) => (done?.(true), to);
Reanimated.runOnJS = (fn: (...a: unknown[]) => void) => fn;

const roles = { ...native.color.roles.standard.light, ...native.signature.roles.standard.light };
const Provider = ({ children }: { children: React.ReactNode }) => (
  <NexubNativeProvider scheme="light" contrast="standard" locale="en-US">
    {children}
  </NexubNativeProvider>
);
const wrap = (ui: React.ReactElement) => render(ui, { wrapper: Provider });
const flat = (el: { props: { style?: unknown } }) => StyleSheet.flatten(el.props.style as never) ?? {};
const json = () => JSON.stringify(screen.toJSON());
const styled = (match: (s: Record<string, unknown>) => boolean) =>
  screen.container.queryAll((n) => typeof n.type === 'string' && match(flat(n) as Record<string, unknown>));

describe('Dialog', () => {
  const dialog = (open: boolean, onOpenChange = jest.fn()) => (
    <Dialog open={open} onOpenChange={onOpenChange} title="Delete card?" actions={<Button>Delete</Button>} />
  );

  it('rests fully shown, leaves when its exit spring lands and can reopen', async () => {
    await wrap(dialog(true));
    expect(screen.getByRole('header', { name: 'Delete card?' })).toBeTruthy();
    // The stubbed shared values only show after a render.
    await screen.rerender(dialog(true));
    // Resting look: scrim at 0.32, panel at full size and opacity.
    expect(styled((s) => s.backgroundColor === roles.scrim)[0]).toHaveStyle({ opacity: 0.32 });
    expect(styled((s) => s.maxWidth === 400)[0]).toHaveStyle({ opacity: 1, transform: [{ scale: 1 }] });
    await screen.rerender(dialog(false));
    expect(screen.queryByText('Delete card?')).toBeNull();
    await screen.rerender(dialog(true));
    expect(screen.getByText('Delete card?')).toBeTruthy();
  });

  it('Android back asks to close', async () => {
    const onOpenChange = jest.fn();
    await wrap(dialog(true, onOpenChange));
    const modal = screen.container.queryAll((n) => typeof n.props.onRequestClose === 'function')[0]!;
    expect(modal.props.animationType).toBe('none');
    await fireEvent(modal, 'requestClose');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

describe('resting states', () => {
  it('Accordion: the chevron points down closed and up open; content mounts only open', async () => {
    await wrap(
      <Accordion title="Fees">
        <RNText>No fees</RNText>
      </Accordion>,
    );
    expect(json()).toContain('"rotate":"0deg"');
    await fireEvent.press(screen.getByRole('button', { name: 'Fees' }));
    expect(screen.getByText('No fees')).toBeTruthy();
    await screen.rerender(
      <Accordion title="Fees" defaultExpanded key="open">
        <RNText>No fees</RNText>
      </Accordion>,
    );
    expect(json()).toContain('"rotate":"180deg"');
  });

  it('Checkbox: filled with its check when on, outlined and empty when off', async () => {
    await wrap(<Checkbox label="Remember me" defaultChecked />);
    const box = () => styled((s) => s.width === 22 && s.height === 22)[0]!;
    expect(box()).toHaveStyle({ backgroundColor: roles.primary, borderWidth: 0 });
    expect(json()).toContain(roles['on-primary']);
    await fireEvent.press(screen.getByRole('checkbox', { name: 'Remember me' }));
    expect(screen.getByRole('checkbox', { name: 'Remember me' })).not.toBeChecked();
    expect(box()).toHaveStyle({ borderWidth: 2 });
    expect(json()).not.toContain(roles['on-primary']);
  });

  it('Radio: the dot shows only in the selected ring', async () => {
    await wrap(
      <RadioGroup label="Speed" defaultValue="standard">
        <Radio value="standard" label="Standard" />
        <Radio value="instant" label="Instant" />
      </RadioGroup>,
    );
    const dots = () => styled((s) => s.width === 10 && s.height === 10 && s.borderRadius === 5);
    expect(styled((s) => s.width === 22 && s.borderRadius === 11)).toHaveLength(2);
    expect(dots()).toHaveLength(1);
    await fireEvent.press(screen.getByRole('radio', { name: 'Instant' }));
    expect(screen.getByRole('radio', { name: 'Instant' })).toBeChecked();
    expect(dots()).toHaveLength(1);
  });

  it('PageIndicator: the active dot is the wide primary one', async () => {
    await wrap(<PageIndicator count={3} index={1} />);
    const dots = styled((s) => s.height === 6 && s.borderRadius === 3);
    expect(dots.map((d) => flat(d).width)).toEqual([6, 20, 6]);
    expect(dots.map((d) => flat(d).backgroundColor)).toEqual([
      roles['outline-variant'],
      roles.primary,
      roles['outline-variant'],
    ]);
  });

  it('Progress: linear fills to the value; circular reports it', async () => {
    await wrap(<Progress value={0.4} label="Upload" />);
    expect(styled((s) => s.width === '40%' && s.height === 6 && s.borderRadius === 3)).toHaveLength(1);
    await screen.rerender(<Progress value={0.25} label="Upload" variant="circular" key="c" />);
    expect(screen.getByRole('progressbar', { name: 'Upload' }).props.accessibilityValue.now).toBe(25);
  });

  it('TextField: hairline outline at rest, heavier and red with an error', async () => {
    await wrap(<TextField label="Email" />);
    const field = () => styled((s) => s.borderRadius === 10 && s.minHeight === 48)[0]!;
    expect(field()).toHaveStyle({ borderWidth: 1, borderColor: roles.outline });
    await screen.rerender(<TextField label="Email" error="Enter a valid email" key="e" />);
    expect(field()).toHaveStyle({ borderWidth: 2, borderColor: roles.error });
  });
});

describe('ScreenContainer keyboardAvoiding', () => {
  type Handler = (e: object) => void;
  const listeners = () => {
    const map: Record<string, Handler> = {};
    const remove = jest.fn();
    jest.spyOn(Keyboard, 'addListener').mockImplementation(((name: string, fn: Handler) => {
      map[name] = fn;
      return { remove };
    }) as never);
    return { map, remove };
  };
  type Measurable = { measureInWindow: (cb: (...n: number[]) => void) => void };
  let proto: Measurable;
  beforeAll(async () => {
    const ref = React.createRef<React.ComponentRef<typeof View>>();
    const probe = await render(<View ref={ref} />);
    proto = Object.getPrototypeOf(ref.current) as Measurable;
    await probe.unmount();
  });
  /** Every host view measures at `y`, `height` tall. */
  const measureAs = (y: number, height: number) =>
    jest.spyOn(proto, 'measureInWindow').mockImplementation((cb) => cb(0, y, 400, height));
  /** The static screen's root (it takes no testID). */
  const root = () => styled((s) => s.flex === 1 && s.backgroundColor === roles.surface)[0]!;
  const withOS = async (os: typeof Platform.OS, fn: () => Promise<void>) => {
    const prev = Platform.OS;
    Platform.OS = os;
    try {
      await fn();
    } finally {
      Platform.OS = prev;
    }
  };
  afterEach(() => jest.restoreAllMocks());

  it('iOS scrolling screens use the scroll view’s own keyboard insets; off turns it off', () =>
    withOS('ios', async () => {
      const { map } = listeners();
      await wrap(
        <ScreenContainer testID="sc">
          <RNText>body</RNText>
        </ScreenContainer>,
      );
      expect(screen.getByTestId('sc').props.automaticallyAdjustKeyboardInsets).toBe(true);
      expect(map).toEqual({});
      await screen.rerender(
        <ScreenContainer testID="sc" keyboardAvoiding={false}>
          <RNText>body</RNText>
        </ScreenContainer>,
      );
      expect(screen.getByTestId('sc').props.automaticallyAdjustKeyboardInsets).toBe(false);
    }));

  it('ends above the keyboard where it is covered, and returns when the keyboard leaves', () =>
    withOS('android', async () => {
      const { map, remove } = listeners();
      measureAs(0, 800);
      const r = await wrap(
        <ScreenContainer testID="sc">
          <RNText>body</RNText>
        </ScreenContainer>,
      );
      const sc = () => screen.getByTestId('sc');
      expect(flat(sc()).marginBottom).toBeUndefined();
      // Edge-to-edge: the window did not resize, the keyboard covers the last 300.
      await act(async () => map.keyboardDidShow!({ endCoordinates: { screenY: 500 } }));
      expect(sc()).toHaveStyle({ marginBottom: 300 });
      // A taller keyboard (emoji row): measured again, not added twice.
      jest.restoreAllMocks();
      measureAs(0, 500);
      await act(async () => map.keyboardDidShow!({ endCoordinates: { screenY: 450 } }));
      expect(sc()).toHaveStyle({ marginBottom: 350 });
      await act(async () => map.keyboardDidHide!({}));
      expect(flat(sc()).marginBottom).toBeUndefined();
      await r.unmount();
      expect(remove).toHaveBeenCalledTimes(2);
    }));

  it('adds nothing when the window already resized (adjustResize)', () =>
    withOS('android', async () => {
      const { map } = listeners();
      measureAs(0, 500);
      await wrap(
        <ScreenContainer scroll={false}>
          <RNText>body</RNText>
        </ScreenContainer>,
      );
      await act(async () => map.keyboardDidShow!({ endCoordinates: { screenY: 500 } }));
      expect(flat(root()).marginBottom).toBeUndefined();
    }));

  it('iOS static screens move with the keyboard’s own curve', () =>
    withOS('ios', async () => {
      const { map } = listeners();
      measureAs(100, 700);
      await wrap(
        <ScreenContainer scroll={false}>
          <RNText>body</RNText>
        </ScreenContainer>,
      );
      expect(Object.keys(map).sort()).toEqual(['keyboardDidShow', 'keyboardWillChangeFrame', 'keyboardWillHide']);
      await act(async () =>
        map.keyboardWillChangeFrame!({ duration: 250, easing: 'keyboard', endCoordinates: { screenY: 464 } }),
      );
      expect(root()).toHaveStyle({ marginBottom: 336 });
      await act(async () => map.keyboardWillHide!({ duration: 250, easing: 'keyboard' }));
      expect(flat(root()).marginBottom).toBeUndefined();
    }));
});
