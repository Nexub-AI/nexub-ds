import {
  Easing,
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

export type EnterKind = 'fade' | 'up' | 'down' | 'scale';
export type ExitKind = 'fade' | 'up' | 'down' | 'scale' | 'start' | 'end';

const ENTER = { fade: FadeIn, up: FadeInUp, down: FadeInDown, scale: ZoomIn } as const;
const EXIT = { fade: FadeOut, up: FadeOutUp, down: FadeOutDown, scale: ZoomOut } as const;

/**
 * Settle time of a spring token (ms): when it is within 0.1% of rest. The
 * same rule @nexub/tokens uses for the CSS spring durations.
 */
export function springSettleMs({ stiffness, damping, mass }: { stiffness: number; damping: number; mass: number }) {
  const dt = 1 / 1000;
  let x = 0;
  let v = 0;
  let still = 0;
  for (let t = 0; t < 3; t += dt) {
    const a = (stiffness * (1 - x) - damping * v) / mass;
    v += a * dt;
    x += v * dt;
    still = Math.abs(1 - x) < 0.001 && Math.abs(v) < 0.01 ? still + 1 : 0;
    if (still > 16) return Math.round((t - 0.016) * 1000);
  }
  return 3000;
}

// Enter and exit run as timed animations lasting the spring token's settle
// time, on the system decelerate / accelerate curves: Reanimated's
// physics-spring entering animations (`springify()` with stiffness/damping)
// left entering views invisible on iOS. Layout transitions move views that are
// already visible, so they keep the physics spring.
const decelerate = Easing.bezier(0, 0, 0.2, 1);
const accelerate = Easing.bezier(0.4, 0, 1, 1);

/**
 * `entering` animation, timed to the spatial spring.
 * `up` rises into place (rows, toasts from below); `down` drops in (banners).
 *
 * ```tsx
 * <Animated.View entering={nxEnter('up')} exiting={nxExit('down')} layout={nxLayout()} />
 * ```
 */
export function nxEnter(kind: EnterKind = 'fade', speed: SpringSpeed = 'default') {
  return ENTER[kind]
    .duration(springSettleMs(native.motion.spring.spatial[speed]))
    .easing(decelerate)
    .reduceMotion(ReduceMotion.System);
}

/**
 * `exiting` animation, timed to the effects spring: quicker than enter.
 * `start` / `end` slide out toward that edge (swipe-to-delete), following RTL.
 */
export function nxExit(kind: ExitKind = 'fade', speed: SpringSpeed = 'fast', rtl = false) {
  const builder =
    kind === 'start' || kind === 'end'
      ? (kind === 'start') !== rtl
        ? SlideOutLeft
        : SlideOutRight
      : EXIT[kind];
  return builder
    .duration(springSettleMs(native.motion.spring.effects[speed]))
    .easing(accelerate)
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
