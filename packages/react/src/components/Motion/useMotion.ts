import * as React from 'react';
import type { MotionDuration, MotionEasing } from './motion.types.js';

// Mirrors the --duration-* tokens. Used for the exit fallback timer: a 0ms
// transition (or a hidden / display:none element) never fires transitionend.
export const DURATION_MS: Record<MotionDuration, number> = {
  instant: 0,
  fast: 150,
  normal: 200,
  slow: 300,
  slower: 500,
};
const FALLBACK_MARGIN_MS = 50;

export type TransitionPhase = 'exited' | 'entering' | 'entered' | 'exiting';

export interface UseMotionReturn {
  phase: TransitionPhase;
  mounted: boolean;
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
 */
export function useMotion({
  visible,
  duration = 'normal',
  easing = 'out',
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

  // Fallback so an exit always completes even if transitionend never fires.
  React.useEffect(() => {
    if (phase !== 'exiting') return;
    const t = setTimeout(() => setPhase('exited'), DURATION_MS[duration] + FALLBACK_MARGIN_MS);
    return () => clearTimeout(t);
  }, [phase, duration]);

  /** Call this from the element's onTransitionEnd to finalise exit. */
  const handleTransitionEnd = React.useCallback((e?: React.TransitionEvent) => {
    if (!isMounted.current) return;
    // Ignore transitionend bubbling up from children.
    if (e && e.target !== e.currentTarget) return;
    setPhase((prev) => (prev === 'exiting' ? 'exited' : prev));
  }, []);

  const mounted = unmountOnExit ? phase !== 'exited' : true;

  const transitionStyle: React.CSSProperties = {
    transitionDuration: `var(--duration-${duration})`,
    transitionTimingFunction: `var(--ease-${easing})`,
    transitionProperty: 'opacity, transform',
  };

  return { phase, mounted, transitionStyle, handleTransitionEnd };
}
