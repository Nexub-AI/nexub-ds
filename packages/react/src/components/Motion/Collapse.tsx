import * as React from 'react';
import type { MotionBaseProps } from './motion.types.js';
import { DURATION_MS, SPRING_MS, SPRING_SPEED, spring, usePrefersReducedMotion } from './useMotion.js';

export interface CollapseProps extends Omit<MotionBaseProps, 'easing'>, React.HTMLAttributes<HTMLDivElement> {
  /**
   * Legacy: set it to use `--duration-*` + `--ease-{value}` instead of the
   * spatial spring for the height transition.
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
 * Collapse — animates `max-height` to reveal / hide content on the spatial
 * spring. Reduced motion snaps the height instead of animating it.
 * Height is measured from the content ref so you don't need to
 * provide an explicit height.
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
  const innerRef = React.useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const legacy = easing !== undefined;
  const settleMs =
    duration === 'instant' || reduced ? 0 : legacy ? DURATION_MS[duration] : SPRING_MS.spatial[SPRING_SPEED[duration]];
  const [height, setHeight] = React.useState<number | 'auto'>(visible ? 'auto' : 0);
  const [overflow, setOverflow] = React.useState<'hidden' | 'visible'>(
    visible ? 'visible' : 'hidden',
  );
  // Only unmount initially when unmountOnExit is requested AND not visible
  const [mounted, setMounted] = React.useState(unmountOnExit ? visible : true);

  // Track previous visible to detect transitions
  const prevVisible = React.useRef(visible);

  React.useEffect(() => {
    const changed = prevVisible.current !== visible;
    prevVisible.current = visible;

    if (!changed) return;

    // Track RAF IDs so we can cancel them if the component unmounts while
    // an animation frame is still pending (prevents state updates on unmounted
    // components and the associated memory leak / React warning).
    let raf1 = 0;
    let raf2 = 0;

    if (visible) {
      // Mount first if unmountOnExit
      setMounted(true);
      // Measure after mount
      raf1 = requestAnimationFrame(() => {
        const el = innerRef.current;
        if (el) {
          setHeight(el.scrollHeight);
          setOverflow('hidden');
        }
      });
    } else {
      // Snap to measured height first so we can animate down
      const el = innerRef.current;
      if (el) {
        setHeight(el.scrollHeight);
        setOverflow('hidden');
        // Give browser one frame to paint, then animate
        raf1 = requestAnimationFrame(() => {
          raf2 = requestAnimationFrame(() => {
            setHeight(typeof collapsedHeight === 'number' ? collapsedHeight : 0);
          });
        });
      }
    }

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [visible, collapsedHeight]);

  const finish = React.useCallback(() => {
    if (visible) {
      setHeight('auto');
      setOverflow('visible');
    } else if (unmountOnExit) {
      setMounted(false);
    }
  }, [visible, unmountOnExit]);

  const handleTransitionEnd = React.useCallback(
    (e: React.TransitionEvent<HTMLDivElement>) => {
      // Ignore transitionend bubbling up from children.
      if (e.target !== e.currentTarget || e.propertyName !== 'max-height') return;
      finish();
    },
    [finish],
  );

  // Fallback so the animation always settles even if transitionend never
  // fires (0ms duration, hidden element, reduced motion).
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

  const maxHeight = height === 'auto' ? 'none' : `${height}px`;

  return (
    <Tag
      ref={ref}
      style={{
        maxHeight,
        overflow,
        transition:
          duration === 'instant' || reduced
            ? 'none'
            : legacy
              ? `max-height var(--duration-${duration}) var(--ease-${easing})`
              : spring('max-height', 'spatial', SPRING_SPEED[duration]),
        ...style,
      }}
      onTransitionEnd={handleTransitionEnd}
      {...rest}
    >
      <div ref={innerRef}>{children}</div>
    </Tag>
  );
});

Collapse.displayName = 'Collapse';
