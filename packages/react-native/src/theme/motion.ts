import * as React from 'react';
import {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  FadeOutDown,
  FadeOutUp,
  LinearTransition,
  ReduceMotion,
  SlideOutLeft,
  SlideOutRight,
  ZoomIn,
  ZoomOut,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { native } from '@nexub/tokens/native';

// Layout-animation presets built from the same spring tokens as the web
// (`motion.spring.*` → CSS linear() there, Reanimated springs here).
// Enter rides `spatial` (position and size, a hair of settle); exit is quicker
// on `effects` and never overshoots. Every preset honours the OS Reduce Motion
// setting (ReduceMotion.System): the change lands without travel.

export type SpringFamily = keyof typeof native.motion.spring;
export type SpringSpeed = keyof (typeof native.motion.spring)['spatial'];

/** `withSpring` config for a spring token, honouring Reduce Motion. */
export function nxSpring(family: SpringFamily = 'spatial', speed: SpringSpeed = 'default') {
  return { ...native.motion.spring[family][speed], reduceMotion: ReduceMotion.System };
}

/**
 * A shared value that springs to `target` whenever it changes: a number
 * (progress, width, angle) or a colour. It starts at `target`, so the first
 * render is the resting state. State changes ride `effects` by default.
 */
export function useSpringValue<T extends number | string>(
  target: T,
  family: SpringFamily = 'effects',
  speed: SpringSpeed = 'fast',
) {
  const value = useSharedValue<T>(target);
  React.useEffect(() => {
    value.value = withSpring(target as never, nxSpring(family, speed)) as T;
  }, [target, family, speed, value]);
  return value;
}

export type EnterKind = 'fade' | 'up' | 'down' | 'scale';
export type ExitKind = 'fade' | 'up' | 'down' | 'scale' | 'start' | 'end';

const ENTER = { fade: FadeIn, up: FadeInUp, down: FadeInDown, scale: ZoomIn } as const;
const EXIT = { fade: FadeOut, up: FadeOutUp, down: FadeOutDown, scale: ZoomOut } as const;

/**
 * `entering` animation on the spatial spring.
 * `up` rises into place (rows, toasts from below); `down` drops in (banners).
 *
 * ```tsx
 * <Animated.View entering={nxEnter('up')} exiting={nxExit('down')} layout={nxLayout()} />
 * ```
 */
export function nxEnter(kind: EnterKind = 'fade', speed: SpringSpeed = 'default') {
  const s = native.motion.spring.spatial[speed];
  return ENTER[kind]
    .springify()
    .stiffness(s.stiffness)
    .damping(s.damping)
    .mass(s.mass)
    .reduceMotion(ReduceMotion.System);
}

/**
 * `exiting` animation on the effects spring: quicker than enter, no overshoot.
 * `start` / `end` slide out toward that edge (swipe-to-delete), following RTL.
 */
export function nxExit(kind: ExitKind = 'fade', speed: SpringSpeed = 'fast', rtl = false) {
  const s = native.motion.spring.effects[speed];
  const builder =
    kind === 'start' || kind === 'end'
      ? (kind === 'start') !== rtl
        ? SlideOutLeft
        : SlideOutRight
      : EXIT[kind];
  return builder
    .springify()
    .stiffness(s.stiffness)
    .damping(s.damping)
    .mass(s.mass)
    .reduceMotion(ReduceMotion.System);
}

/** `layout` transition: siblings glide to their new place on the spatial spring. */
export function nxLayout(speed: SpringSpeed = 'default') {
  const s = native.motion.spring.spatial[speed];
  return LinearTransition.springify()
    .stiffness(s.stiffness)
    .damping(s.damping)
    .mass(s.mass)
    .reduceMotion(ReduceMotion.System);
}
