import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';
import type { ToneValue } from '../Button/Button.js';

export const alertVariants = cva(
  [
    'relative flex gap-3 rounded-lg border-l-4 p-4',
    'w-full',
  ],
  {
    variants: {
      tone: {
        neutral:
          'bg-[var(--color-bg-subtle)] border-l-[var(--color-neutral-500)] text-[var(--color-text-primary)]',
        info: 'bg-[var(--color-semantic-info-default)]/8 border-l-[var(--color-semantic-info-default)] text-[var(--color-semantic-info-default)]',
        success:
          'bg-[var(--color-semantic-success-default)]/8 border-l-[var(--color-semantic-success-default)] text-[var(--color-semantic-success-default)]',
        warning:
          'bg-[var(--color-semantic-warning-default)]/8 border-l-[var(--color-semantic-warning-default)] text-[var(--color-semantic-warning-default)]',
        danger:
          'bg-[var(--color-semantic-error-default)]/8 border-l-[var(--color-semantic-error-default)] text-[var(--color-semantic-error-default)]',
        leap: 'bg-[var(--color-leap-500)]/8 border-l-[var(--color-leap-500)] text-[var(--color-leap-700)]',
        bookub:
          'bg-[var(--color-bookub-500)]/8 border-l-[var(--color-bookub-500)] text-[var(--color-bookub-700)]',
        payub:
          'bg-[var(--color-payub-500)]/8 border-l-[var(--color-payub-500)] text-[var(--color-payub-700)]',
        founderub:
          'bg-[var(--color-founderub-500)]/8 border-l-[var(--color-founderub-500)] text-[var(--color-founderub-700)]',
      },
    },
    defaultVariants: {
      tone: 'neutral',
    },
  },
);

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  tone?: ToneValue;
  title?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  onClose?: () => void;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      tone = 'neutral',
      title,
      icon,
      action,
      onClose,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ tone }), className)}
        data-tone={tone}
        {...props}
      >
        {icon && (
          <span className="shrink-0 mt-0.5 inline-flex items-start" aria-hidden="true">
            {icon}
          </span>
        )}
        <div className="flex-1 min-w-0">
          {title && (
            <p className="font-semibold text-sm mb-0.5">{title}</p>
          )}
          {children && (
            <div className="text-sm opacity-90">{children}</div>
          )}
          {action && <div className="mt-2">{action}</div>}
        </div>
        {onClose && (
          <button
            type="button"
            aria-label="Dismiss alert"
            onClick={onClose}
            className={cn(
              'shrink-0 inline-flex items-center justify-center rounded-md w-6 h-6 opacity-60 hover:opacity-100 transition-opacity',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring-default)] focus-visible:ring-offset-2',
            )}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M10 2L2 10M2 2l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
    );
  },
);

Alert.displayName = 'Alert';
