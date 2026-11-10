import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';

export const skeletonVariants = cva(
  'block bg-surface-container-highest',
  {
    variants: {
      shape: {
        line: 'h-[1em] w-full rounded-shape-min',
        rect: 'w-full rounded-shape-container',
        circle: 'size-10 rounded-full',
      },
      animated: {
        true: 'animate-pulse motion-reduce:animate-none',
      },
    },
    defaultVariants: {
      shape: 'line',
      animated: true,
    },
  },
);

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof skeletonVariants> {
  shape?: 'line' | 'rect' | 'circle';
  /** Arbitrary size; rendered as inline style. Omit to use the shape's default classes. */
  width?: string | number;
  height?: string | number;
  animated?: boolean;
  /** Effect when `animated`: `pulse` fades, `shimmer` sweeps a highlight across. Both stop under reduced motion. @default 'pulse' */
  animation?: 'pulse' | 'shimmer';
}

const px = (v: string | number) => (typeof v === 'number' ? `${v}px` : v);

export const Skeleton = React.forwardRef<HTMLSpanElement, SkeletonProps>(
  (
    {
      className,
      shape = 'line',
      width,
      height,
      animated = true,
      animation = 'pulse',
      style,
      ...props
    },
    ref,
  ) => {
    // Defaults come from classes, so the common case renders no style
    // attribute (strict-CSP safe). A circle with only one dimension stays round.
    const w = width ?? (shape === 'circle' ? height : undefined);
    const h = height ?? (shape === 'circle' ? width : undefined);
    const sizeStyle =
      w !== undefined || h !== undefined
        ? { ...(w !== undefined && { width: px(w) }), ...(h !== undefined && { height: px(h) }) }
        : undefined;

    return (
      <span
        ref={ref}
        aria-hidden="true"
        className={cn(
          skeletonVariants({ shape, animated: animated && animation === 'pulse' }),
          animated && animation === 'shimmer' && 'nx-skeleton-shimmer',
          className,
        )}
        style={sizeStyle || style ? { ...sizeStyle, ...style } : undefined}
        {...props}
      />
    );
  },
);

Skeleton.displayName = 'Skeleton';

export interface SkeletonTextProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    Pick<SkeletonProps, 'animated' | 'animation'> {
  /** Number of lines; the last is shorter. @default 3 */
  lines?: number;
}

/** Placeholder paragraph. Each line is one line-height tall (inherited from the
 *  surrounding text style), so swapping in the real text doesn't shift layout. */
export const SkeletonText = React.forwardRef<HTMLSpanElement, SkeletonTextProps>(
  ({ className, lines = 3, animated, animation, ...props }, ref) => (
    <span ref={ref} aria-hidden="true" className={cn('block', className)} {...props}>
      {Array.from({ length: lines }, (_, i) => (
        <span key={i} className="flex h-[1lh] items-center">
          <Skeleton
            animated={animated}
            animation={animation}
            className={i === lines - 1 && lines > 1 ? 'w-3/5' : undefined}
          />
        </span>
      ))}
    </span>
  ),
);

SkeletonText.displayName = 'SkeletonText';
