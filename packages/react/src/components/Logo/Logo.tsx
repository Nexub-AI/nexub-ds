import * as React from 'react';
import { NexubMark } from '@nexub/icons';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';

// min-w-0/max-w-full: in a narrow container the product name truncates.
export const logoVariants = cva('inline-flex min-w-0 max-w-full items-center gap-2', {
  variants: {
    size: {
      sm: 'h-6',
      md: 'h-8',
      lg: 'h-10',
    },
    tone: {
      default: 'text-[var(--color-on-surface)]',
      // Brand asset: the inverse mark is always white (on dark or imagery), in both themes.
      inverse: 'text-[var(--color-palette-neutral-100)]',
    },
  },
  defaultVariants: {
    size: 'md',
    tone: 'default',
  },
});

// The mark is 78×56: size it by height; aspect-ratio overrides the square
// width/height attributes the icon wrapper sets.
const iconSizeMap: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'h-5 w-auto aspect-[78/56]',
  md: 'h-7 w-auto aspect-[78/56]',
  lg: 'h-9 w-auto aspect-[78/56]',
};

const wordmarkSizeMap: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-2xl',
};

export interface LogoProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof logoVariants> {
  /** `full` = mark + wordmark; `icon` = mark only. `mark` is the old name for `icon`. */
  variant?: 'full' | 'icon' | 'mark';
  /** `color` (default) = the official mark in brand colours; `mono` = `currentColor`. */
  mark?: 'color' | 'mono';
  /** Product name shown after the wordmark, e.g. "Command Hub". Ignored for `variant="icon"`. */
  product?: string;
}

export const Logo = React.forwardRef<HTMLSpanElement, LogoProps>(
  (
    {
      variant = 'full',
      mark = 'color',
      product,
      size = 'md',
      tone = 'default',
      className,
      ...rest
    },
    ref,
  ) => {
    const resolvedSize = size ?? 'md';
    const resolvedTone = tone ?? 'default';
    const full = variant === 'full';

    return (
      <span
        ref={ref}
        role="img"
        aria-label={product ? `Nexub ${product}` : 'Nexub'}
        className={cn(logoVariants({ size: resolvedSize, tone: resolvedTone }), className)}
        {...rest}
      >
        <NexubMark
          variant={mark}
          className={cn(iconSizeMap[resolvedSize], 'shrink-0')}
          aria-hidden="true"
        />
        {full && (
          <span
            className={cn(
              wordmarkSizeMap[resolvedSize],
              'shrink-0 font-semibold tracking-tight leading-none',
            )}
          >
            nexub
          </span>
        )}
        {full && product && (
          <>
            <span aria-hidden="true" className="h-1/2 w-px shrink-0 bg-current opacity-25" />
            <span
              className={cn(
                wordmarkSizeMap[resolvedSize],
                // leading-normal so the clip box doesn't cut descenders.
                'min-w-0 truncate font-medium tracking-tight leading-normal',
                resolvedTone === 'inverse' ? 'opacity-70' : 'text-[var(--color-on-surface-muted)]',
              )}
            >
              {product}
            </span>
          </>
        )}
      </span>
    );
  },
);

Logo.displayName = 'Logo';
