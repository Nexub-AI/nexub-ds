import * as React from 'react';
import type { MotionBaseProps } from './motion.types.js';

export interface CollapseProps extends Omit<MotionBaseProps, 'easing'>, React.HTMLAttributes<HTMLDivElement> {
  /**
   * Easing for the height transition.
   * @default 'out'
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
 * Collapse — animates `max-height` to reveal / hide content.
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
    easing = 'out',
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

  const handleTransitionEnd = React.useCallback(
    (e: React.TransitionEvent<HTMLDivElement>) => {
      if (e.propertyName !== 'max-height') return;
      if (visible) {
        setHeight('auto');
        setOverflow('visible');
      } else {
        if (unmountOnExit) setMounted(false);
      }
    },
    [visible, unmountOnExit],
  );

  if (!mounted) return null;

  const maxHeight = height === 'auto' ? 'none' : `${height}px`;

  return (
    <Tag
      ref={ref}
      style={{
        maxHeight,
        overflow,
        transitionProperty: 'max-height',
        transitionDuration: `var(--duration-${duration})`,
        transitionTimingFunction: `var(--ease-${easing})`,
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
