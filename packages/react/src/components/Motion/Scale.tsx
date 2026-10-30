import * as React from 'react';
import type { MotionBaseProps } from './motion.types.js';
import { useMotion } from './useMotion.js';

export interface ScaleProps extends MotionBaseProps, React.HTMLAttributes<HTMLDivElement> {
  /**
   * The scale value at the start/end of the animation (when `in={false}`).
   * @default 0.95
   */
  initialScale?: number;
  /** Wrapper element tag. @default 'div' */
  as?: React.ElementType;
}

/**
 * Scale — animates opacity + scale(x) from `initialScale` to 1 on the spring
 * tokens. Reduced motion keeps the fade and drops the scale.
 *
 * ```tsx
 * <Scale in={isOpen} initialScale={0.9}>
 *   <Menu />
 * </Scale>
 * ```
 */
export const Scale = React.forwardRef<HTMLDivElement, ScaleProps>(function Scale(
  {
    in: visible,
    duration = 'fast',
    easing,
    unmountOnExit = false,
    initialScale = 0.95,
    children,
    style,
    as: Tag = 'div',
    ...rest
  },
  ref,
) {
  const { phase, mounted, reduced, transitionStyle, handleTransitionEnd } = useMotion({
    visible,
    duration,
    easing,
    unmountOnExit,
  });

  if (!mounted) return null;

  const isEntered = phase === 'entered';

  return (
    <Tag
      ref={ref}
      onTransitionEnd={handleTransitionEnd}
      style={{
        opacity: isEntered ? 1 : 0,
        transform: isEntered || reduced ? 'scale(1)' : `scale(${initialScale})`,
        transformOrigin: 'top center',
        willChange: 'opacity, transform',
        ...transitionStyle,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
});

Scale.displayName = 'Scale';
