import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';

export const skeletonVariants = cva(
  'bg-[var(--color-bg-muted)]',
  {
    variants: {
      shape: {
        line: 'rounded',
        rect: 'rounded-md',
        circle: 'rounded-full',
      },
      animated: {
        true: 'animate-pulse',
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
  width?: string | number;
  height?: string | number;
  animated?: boolean;
}

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
    const defaultHeight =
      shape === 'line' ? '1em' : shape === 'circle' ? undefined : undefined;

    const resolvedWidth =
      width !== undefined
        ? typeof width === 'number'
          ? `${width}px`
          : width
        : shape === 'circle'
          ? height !== undefined
            ? typeof height === 'number'
              ? `${height}px`
              : height
            : '2.5rem'
          : '100%';

    const resolvedHeight =
      height !== undefined
        ? typeof height === 'number'
          ? `${height}px`
          : height
        : shape === 'circle'
          ? resolvedWidth
          : defaultHeight;

    return (
      <span
        ref={ref}
        aria-hidden="true"
        className={cn(
          skeletonVariants({ shape, animated }),
          'block',
          className,
        )}
        style={{
          width: resolvedWidth,
          height: resolvedHeight,
          ...style,
        }}
        {...props}
      />
    );
  },
);

Skeleton.displayName = 'Skeleton';
