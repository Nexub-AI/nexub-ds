import * as React from 'react';
import type { MotionBaseProps } from './motion.types.js';
import { useMotion } from './useMotion.js';

export interface FadeProps extends MotionBaseProps, React.HTMLAttributes<HTMLDivElement> {
  /** Wrapper element tag. @default 'div' */
  as?: React.ElementType;
}

/**
 * Fade — animates opacity between 0 and 1.
 *
 * ```tsx
 * <Fade in={isOpen}>
 *   <p>Hello</p>
 * </Fade>
 * ```
 */
export const Fade = React.forwardRef<HTMLDivElement, FadeProps>(function Fade(
  {
    in: visible,
    duration = 'normal',
    easing,
    unmountOnExit = false,
    children,
    style,
    as: Tag = 'div',
    ...rest
  },
  ref,
) {
  const { phase, mounted, transitionStyle, handleTransitionEnd } = useMotion({
    visible,
    duration,
    easing,
    unmountOnExit,
  });

  if (!mounted) return null;

  const opacity = phase === 'entered' ? 1 : 0;

  return (
    <Tag
      ref={ref}
      onTransitionEnd={handleTransitionEnd}
      style={{
        opacity,
        willChange: 'opacity',
        ...transitionStyle,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
});

Fade.displayName = 'Fade';
