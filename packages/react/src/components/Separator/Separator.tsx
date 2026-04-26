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
      neutral: 'border-[var(--color-border-default)]',
      info: 'border-[var(--color-semantic-info-default)]/30',
      success: 'border-[var(--color-semantic-success-default)]/30',
      warning: 'border-[var(--color-semantic-warning-default)]/30',
      danger: 'border-[var(--color-semantic-error-default)]/30',
      leap: 'border-[var(--color-leap-500)]/30',
      bookub: 'border-[var(--color-bookub-500)]/30',
      payub: 'border-[var(--color-payub-500)]/30',
      founderub: 'border-[var(--color-founderub-500)]/30',
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
