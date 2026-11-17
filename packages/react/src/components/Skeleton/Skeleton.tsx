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

export interface SkeletonPresetProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Pick<SkeletonProps, 'animated' | 'animation'> {
  /** The layout to stand in for. */
  preset: 'card' | 'tableRow' | 'listRow' | 'chart' | 'form';
  /** How many to stack: rows, cards or fields. @default 1 */
  count?: number;
}

/** Ready-made placeholders for common layouts, built from Skeleton shapes. Decorative: put aria-busy on the region they fill. */
export const SkeletonPreset = React.forwardRef<HTMLDivElement, SkeletonPresetProps>(
  ({ preset, count = 1, animated, animation, className, ...props }, ref) => {
    const a = { animated, animation };
    const one: Record<SkeletonPresetProps['preset'], () => React.ReactNode> = {
      card: () => (
        <span className="flex flex-col gap-3 rounded-shape-container border border-[var(--color-outline-variant)] p-4 text-body-md">
          <Skeleton {...a} shape="rect" className="h-32" />
          <Skeleton {...a} className="w-3/5" />
          <SkeletonText {...a} lines={2} />
        </span>
      ),
      tableRow: () => (
        <span className="flex items-center gap-4 border-b border-[var(--color-outline-variant)] py-3 text-body-sm">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} {...a} className="flex-1" />
          ))}
        </span>
      ),
      listRow: () => (
        <span className="flex items-center gap-3 py-2 text-body-md">
          <Skeleton {...a} shape="circle" className="shrink-0" />
          <span className="flex min-w-0 flex-1 flex-col gap-2">
            <Skeleton {...a} className="w-2/5" />
            <Skeleton {...a} className="w-3/5" />
          </span>
        </span>
      ),
      chart: () => <Skeleton {...a} shape="rect" className="h-48" />,
      form: () => (
        <span className="flex flex-col gap-2 text-body-md">
          <Skeleton {...a} className="w-24" />
          <Skeleton {...a} shape="rect" className="h-control-md rounded-shape-field" />
        </span>
      ),
    };
    return (
      <div
        ref={ref}
        aria-hidden="true"
        data-preset={preset}
        className={cn('flex flex-col', preset === 'tableRow' || preset === 'listRow' ? 'gap-0' : 'gap-4', className)}
        {...props}
      >
        {Array.from({ length: count }, (_, i) => (
          <React.Fragment key={i}>{one[preset]()}</React.Fragment>
        ))}
      </div>
    );
  },
);

SkeletonPreset.displayName = 'SkeletonPreset';
