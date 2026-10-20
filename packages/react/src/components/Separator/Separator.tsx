import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';
import type { ToneValue } from '../Button/Button.js';

export const separatorVariants = cva('', {
  variants: {
    orientation: {
      horizontal: 'w-full border-t',
      vertical: 'h-full border-l self-stretch',
    },
    tone: {
      neutral: 'border-[var(--color-outline-variant)]',
      info: 'border-[color-mix(in_srgb,var(--color-info)_30%,transparent)]',
      success: 'border-[color-mix(in_srgb,var(--color-success)_30%,transparent)]',
      warning: 'border-[color-mix(in_srgb,var(--color-warning)_30%,transparent)]',
      danger: 'border-[color-mix(in_srgb,var(--color-error)_30%,transparent)]',
      leap: 'border-[color-mix(in_srgb,var(--color-leap)_30%,transparent)]',
      bookub: 'border-[color-mix(in_srgb,var(--color-bookub)_30%,transparent)]',
      payub: 'border-[color-mix(in_srgb,var(--color-payub)_30%,transparent)]',
      founderub: 'border-[color-mix(in_srgb,var(--color-founderub)_30%,transparent)]',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
    tone: 'neutral',
  },
});

export interface SeparatorProps
  extends React.HTMLAttributes<HTMLHRElement | HTMLDivElement>,
    VariantProps<typeof separatorVariants> {
  orientation?: 'horizontal' | 'vertical';
  tone?: ToneValue;
}

export const Separator = React.forwardRef<
  HTMLHRElement | HTMLDivElement,
  SeparatorProps
>(({ className, orientation = 'horizontal', tone = 'neutral', ...props }, ref) => {
  if (orientation === 'horizontal') {
    return (
      <hr
        ref={ref as React.Ref<HTMLHRElement>}
        role="separator"
        aria-orientation="horizontal"
        className={cn(separatorVariants({ orientation, tone }), className)}
        {...(props as React.HTMLAttributes<HTMLHRElement>)}
      />
    );
  }

  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      role="separator"
      aria-orientation="vertical"
      className={cn(separatorVariants({ orientation, tone }), className)}
      {...props}
    />
  );
});

Separator.displayName = 'Separator';
