import * as React from 'react';
import { NexubMark } from '@nexub/icons';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';

export const logoVariants = cva('inline-flex items-center gap-2', {
  variants: {
    size: {
      sm: 'h-6',
      md: 'h-8',
      lg: 'h-10',
    },
    tone: {
      default: 'text-[var(--color-text-primary)]',
      inverse: 'text-white',
    },
  },
  defaultVariants: {
    size: 'md',
    tone: 'default',
  },
});

const iconSizeMap: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'h-5 w-5',
  md: 'h-7 w-7',
  lg: 'h-9 w-9',
};

const wordmarkSizeMap: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-2xl',
};

export interface LogoProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof logoVariants> {
  variant?: 'full' | 'mark';
}

export const Logo = React.forwardRef<HTMLSpanElement, LogoProps>(
  (
    {
      variant = 'full',
      size = 'md',
      tone = 'default',
      className,
      ...rest
    },
    ref,
  ) => {
    const resolvedSize = size ?? 'md';
    const resolvedTone = tone ?? 'default';

    return (
      <span
        ref={ref}
        className={cn(logoVariants({ size: resolvedSize, tone: resolvedTone }), className)}
        aria-label="Nexub"
        {...rest}
      >
        <NexubMark
          className={cn(iconSizeMap[resolvedSize], 'shrink-0')}
          aria-hidden="true"
        />
        {variant === 'full' && (
          <span
            className={cn(
              wordmarkSizeMap[resolvedSize],
              'font-semibold tracking-tight leading-none',
            )}
          >
            nexub
          </span>
        )}
      </span>
    );
  },
);

Logo.displayName = 'Logo';
