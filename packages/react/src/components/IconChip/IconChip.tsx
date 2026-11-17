import * as React from 'react';
import type { CategoryColor } from '@nexub/core';
import { cn } from '../../utils/cn.js';

const sizes = {
  sm: 'size-8 [&>svg]:size-4',
  md: 'size-10 [&>svg]:size-5',
  lg: 'size-12 [&>svg]:size-6',
} as const;

export interface IconChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Colour of the chip. `'accent'` is the product's spot accent. Without it the chip is neutral. */
  category?: CategoryColor;
  /** @default 'md' */
  size?: keyof typeof sizes;
  /** @default 'square' */
  shape?: 'square' | 'circle';
}

/**
 * An icon on a tinted tile (10.3): the leading mark of a stat card, a list row
 * or a settings section. Decorative unless you give it an `aria-label`.
 */
export const IconChip = React.forwardRef<HTMLSpanElement, IconChipProps>(
  ({ className, category, size = 'md', shape = 'square', ...props }, ref) => {
    const labelled = props['aria-label'] != null || props['aria-labelledby'] != null;
    return (
      <span
        ref={ref}
        data-category={category}
        role={labelled ? 'img' : undefined}
        aria-hidden={labelled ? undefined : true}
        className={cn(
          'inline-grid shrink-0 place-items-center',
          'bg-[var(--nx-cat-container,var(--color-surface-container-high))] text-[var(--nx-on-cat-container,var(--color-on-surface-variant))]',
          shape === 'circle' ? 'rounded-full' : 'rounded-shape-control',
          sizes[size],
          className,
        )}
        {...props}
      />
    );
  },
);
IconChip.displayName = 'IconChip';
