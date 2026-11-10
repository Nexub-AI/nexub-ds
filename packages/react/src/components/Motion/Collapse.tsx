'use client';

import * as React from 'react';
import type { MotionBaseProps } from './motion.types.js';
import { DURATION_MS, SPRING_MS, SPRING_SPEED, spring, usePrefersReducedMotion } from './useMotion.js';

export interface CollapseProps extends Omit<MotionBaseProps, 'easing'>, React.HTMLAttributes<HTMLDivElement> {
  /**
   * Legacy: set it to use `--duration-*` + `--ease-{value}` instead of the
   * spatial spring for the height transition.
   * @deprecated since 7.3, removed in 8.0 (see MotionBaseProps.easing).
   */
  easing?: MotionBaseProps['easing'];
  /**
   * Starting height when collapsed. Useful for "peek" effects.
   * @default 0
   */
  collapsedHeight?: number | string;
  /** Wrapper element tag. @default 'div' */
  as?: React.ElementType;
}

/**
 * Collapse — reveals / hides content on the spatial spring by animating a
 * one-row grid from `0fr` to `1fr`, so the browser sizes it: no height is
 * measured in JS and content that grows while open just grows. Reduced motion
 * snaps instead of animating.
 *
 * ```tsx
 * <Collapse in={isOpen}>
 *   <p>Hidden content</p>
 * </Collapse>
 * ```
 */
export const Collapse = React.forwardRef<HTMLDivElement, CollapseProps>(function Collapse(
  {
    in: visible,
    duration = 'normal',
    easing,
    unmountOnExit = false,
    collapsedHeight = 0,
    children,
    style,
    as: Tag = 'div',
    ...rest
  },
  ref,
) {
  const reduced = usePrefersReducedMotion();
  const legacy = easing !== undefined;
  const instant = duration === 'instant' || reduced;
  const settleMs = instant ? 0 : legacy ? DURATION_MS[duration] : SPRING_MS.spatial[SPRING_SPEED[duration]];
  // Only unmount initially when unmountOnExit is requested AND not visible.
  const [mounted, setMounted] = React.useState(unmountOnExit ? visible : true);
  // `expanded` lags `visible` by a frame on entry, so a freshly mounted
  // element starts at 0fr and transitions instead of appearing open.
  const [expanded, setExpanded] = React.useState(visible);
  // Clip only while moving or closed, so focus rings and popovers aren't cut when open.
  const [settled, setSettled] = React.useState(true);

  const prevVisible = React.useRef(visible);
  React.useEffect(() => {
    if (prevVisible.current === visible) return;
    prevVisible.current = visible;
    setSettled(false);
    if (!visible) {
      setExpanded(false);
      return;
    }
    setMounted(true);
    const raf = requestAnimationFrame(() => setExpanded(true));
    return () => cancelAnimationFrame(raf);
  }, [visible]);

  const finish = React.useCallback(() => {
    setSettled(true);
    if (!visible && unmountOnExit) setMounted(false);
  }, [visible, unmountOnExit]);

  // Fallback so it always settles even if transitionend never fires
  // (0ms duration, hidden element, reduced motion).
  const firstRender = React.useRef(true);
  React.useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const t = setTimeout(finish, settleMs + 100);
    return () => clearTimeout(t);
  }, [visible, settleMs, finish]);

  if (!mounted) return null;
  const overflow = expanded && settled ? 'visible' : 'hidden';

  return (
    <Tag
      ref={ref}
      style={{
        display: 'grid',
        gridTemplateRows: expanded ? '1fr' : '0fr',
        overflow,
        transition: instant
          ? 'none'
          : legacy
            ? `grid-template-rows var(--duration-${duration}) var(--ease-${easing})`
            : spring('grid-template-rows', 'spatial', SPRING_SPEED[duration]),
        ...style,
      }}
      onTransitionEnd={(e: React.TransitionEvent<HTMLDivElement>) => {
        // Ignore transitionend bubbling up from children.
        if (e.target === e.currentTarget && e.propertyName === 'grid-template-rows') finish();
      }}
      {...rest}
    >
      {/* min-height is the collapsed size: 0 hides it, a value peeks. */}
      <div style={{ minHeight: collapsedHeight, overflow }}>{children}</div>
    </Tag>
  );
});

Collapse.displayName = 'Collapse';
