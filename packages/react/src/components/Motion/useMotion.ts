import * as React from 'react';
import type { MotionDuration, MotionEasing } from './motion.types.js';
import { useMediaQuery } from '../../hooks/useMediaQuery.js';

// Mirrors the legacy --duration-* tokens. Used only when a caller passes
// `easing` explicitly (the pre-spring behaviour).
export const DURATION_MS: Record<MotionDuration, number> = {
  instant: 0,
  fast: 150,
  normal: 200,
  slow: 300,
  slower: 500,
};

export type SpringSpeed = 'fast' | 'default' | 'slow';
export type SpringFamily = 'spatial' | 'effects' | 'expressive';

/** `duration` → spring speed. `instant` is handled separately (no motion). */
export const SPRING_SPEED: Record<Exclude<MotionDuration, 'instant'>, SpringSpeed> = {
  fast: 'fast',
  normal: 'default',
  slow: 'slow',
  slower: 'slow',
};

// Settle times of the spring tokens (@nexub/tokens motion.spring.*.duration).
// Used for fallback timers: a hidden element never fires transitionend.
export const SPRING_MS: Record<SpringFamily, Record<SpringSpeed, number>> = {
  spatial: { fast: 224, default: 317, slow: 484 },
  effects: { fast: 150, default: 231, slow: 327 },
  expressive: { fast: 364, default: 435, slow: 600 },
};

const FALLBACK_MARGIN_MS = 50;

/** One `transition` entry riding a spring token. */
export const spring = (property: string, family: SpringFamily, speed: SpringSpeed) =>
  `${property} var(--motion-spring-${family}-${speed}-duration) var(--motion-spring-${family}-${speed}-easing)`;

/** True when the user asked the OS for reduced motion. False during SSR. */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

export type TransitionPhase = 'exited' | 'entering' | 'entered' | 'exiting';

export interface UseMotionReturn {
  phase: TransitionPhase;
  mounted: boolean;
  /** Reduced motion is on: keep the crossfade, drop travel and scale. */
  reduced: boolean;
  transitionStyle: React.CSSProperties;
  /** Attach to onTransitionEnd so the hook can move exiting → exited. */
  handleTransitionEnd: (e?: React.TransitionEvent) => void;
}

/**
 * Lightweight hook that drives a 4-phase CSS transition state machine.
 *
 *   exited ─► entering ─► entered
 *                              │
 *                           (in=false)
 *                              ▼
 *                           exiting ─► (onTransitionEnd) ─► exited
 *
 * Enter rides the springs (opacity on `effects`, transform on `spatial`).
 * Exit is quicker and never overshoots (`effects` fast for both).
 * Passing `easing` opts back into the legacy duration + easing tokens.
 */
export function useMotion({
  visible,
  duration = 'normal',
  easing,
  unmountOnExit = false,
}: {
  visible: boolean;
  duration?: MotionDuration;
  easing?: MotionEasing;
  unmountOnExit?: boolean;
}): UseMotionReturn {
  // Start in the correct stable state without running any effect
  const [phase, setPhase] = React.useState<TransitionPhase>(
    visible ? 'entered' : 'exited',
  );
  const reduced = usePrefersReducedMotion();

  const rafRef = React.useRef<number | null>(null);
  const isMounted = React.useRef(true);

  React.useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Only react to *changes* in `visible`, not the initial render
  const prevVisible = React.useRef(visible);
  React.useEffect(() => {
    if (prevVisible.current === visible) return; // No change — skip
    prevVisible.current = visible;

    if (visible) {
      // Force a repaint between 'entering' and 'entered' so CSS transitions fire
      setPhase('entering');
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = requestAnimationFrame(() => {
          if (isMounted.current) setPhase('entered');
        });
      });
    } else {
      setPhase('exiting');
    }
  }, [visible]);

  const legacy = easing !== undefined;
  const exitMs =
    duration === 'instant' ? 0 : legacy ? DURATION_MS[duration] : SPRING_MS.effects.fast;

  // Fallback so an exit always completes even if transitionend never fires.
  React.useEffect(() => {
    if (phase !== 'exiting') return;
    const t = setTimeout(() => setPhase('exited'), exitMs + FALLBACK_MARGIN_MS);
    return () => clearTimeout(t);
  }, [phase, exitMs]);

  /** Call this from the element's onTransitionEnd to finalise exit. */
  const handleTransitionEnd = React.useCallback((e?: React.TransitionEvent) => {
    if (!isMounted.current) return;
    // Ignore transitionend bubbling up from children.
    if (e && e.target !== e.currentTarget) return;
    setPhase((prev) => (prev === 'exiting' ? 'exited' : prev));
  }, []);

  const mounted = unmountOnExit ? phase !== 'exited' : true;

  let transitionStyle: React.CSSProperties;
  if (duration === 'instant') {
    transitionStyle = { transition: 'none' };
  } else if (legacy) {
    transitionStyle = {
      transitionDuration: `var(--duration-${duration})`,
      transitionTimingFunction: `var(--ease-${easing})`,
      transitionProperty: 'opacity, transform',
    };
  } else if (phase === 'exiting' || phase === 'exited') {
    transitionStyle = {
      transition: [spring('opacity', 'effects', 'fast'), spring('transform', 'effects', 'fast')].join(', '),
    };
  } else {
    const speed = SPRING_SPEED[duration];
    transitionStyle = {
      transition: [spring('opacity', 'effects', speed), spring('transform', 'spatial', speed)].join(', '),
    };
  }

  return { phase, mounted, reduced, transitionStyle, handleTransitionEnd };
}
