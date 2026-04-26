import * as React from 'react';
import type { MotionDuration, MotionEasing } from './motion.types.js';

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

  /** Call this from the element's onTransitionEnd to finalise exit. */
  const handleTransitionEnd = React.useCallback(() => {
    if (!isMounted.current) return;
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
