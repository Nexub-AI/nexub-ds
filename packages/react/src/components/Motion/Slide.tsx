import * as React from 'react';
import type { MotionBaseProps } from './motion.types.js';
import { useMotion } from './useMotion.js';

export type SlideDirection = 'up' | 'down' | 'left' | 'right';

export interface SlideProps extends MotionBaseProps, React.HTMLAttributes<HTMLDivElement> {
  /** Direction the element slides in from. @default 'up' */
  direction?: SlideDirection;
  /** Distance of the slide offset. @default '12px' */
  distance?: string;
  /** Wrapper element tag. @default 'div' */
  as?: React.ElementType;
}

const directionTransform: Record<SlideDirection, { from: string; to: string }> = {
  up:    { from: 'translateY(12px)',  to: 'translateY(0)' },
  down:  { from: 'translateY(-12px)', to: 'translateY(0)' },
  left:  { from: 'translateX(12px)',  to: 'translateX(0)' },
  right: { from: 'translateX(-12px)', to: 'translateX(0)' },
};

/**
 * Slide — animates opacity + translate from a given direction.
 *
 * ```tsx
 * <Slide in={isOpen} direction="up">
 *   <Card />
 * </Slide>
 * ```
 */
export const Slide = React.forwardRef<HTMLDivElement, SlideProps>(function Slide(
  {
    in: visible,
    duration = 'normal',
    easing = 'out',
    unmountOnExit = false,
    direction = 'up',
    distance,
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

  const isEntered = phase === 'entered';
  const dt = directionTransform[direction]!;

  // Allow consumer to override distance
  let fromTransform = dt.from;
  if (distance) {
    if (direction === 'up')    fromTransform = `translateY(${distance})`;
    if (direction === 'down')  fromTransform = `translateY(-${distance})`;
    if (direction === 'left')  fromTransform = `translateX(${distance})`;
    if (direction === 'right') fromTransform = `translateX(-${distance})`;
  }

  return (
    <Tag
      ref={ref}
      onTransitionEnd={handleTransitionEnd}
      style={{
        opacity: isEntered ? 1 : 0,
        transform: isEntered ? dt.to : fromTransform,
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

Slide.displayName = 'Slide';
