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
        className={cn(skeletonVariants({ shape, animated }), className)}
        style={sizeStyle || style ? { ...sizeStyle, ...style } : undefined}
        {...props}
      />
    );
  },
);

Skeleton.displayName = 'Skeleton';
