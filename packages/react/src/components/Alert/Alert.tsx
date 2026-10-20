import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';
import type { ToneValue } from '../Button/Button.js';

export const alertVariants = cva(
  [
    'relative flex gap-3 rounded-shape-container border-s-4 p-4',
    'w-full',
  ],
  {
    variants: {
      tone: {
        neutral:
          'bg-[var(--color-surface-container-low)] border-s-[var(--color-outline)] text-[var(--color-on-surface)]',
        info:
          'bg-[var(--color-info-container)] border-s-[var(--color-info)] text-[var(--color-on-info-container)]',
        success:
          'bg-[var(--color-success-container)] border-s-[var(--color-success)] text-[var(--color-on-success-container)]',
        warning:
          'bg-[var(--color-warning-container)] border-s-[var(--color-warning)] text-[var(--color-on-warning-container)]',
        danger:
          'bg-[var(--color-error-container)] border-s-[var(--color-error)] text-[var(--color-on-error-container)]',
        leap:
          'bg-[var(--color-leap-container)] border-s-[var(--color-leap)] text-[var(--color-on-leap-container)]',
        bookub:
          'bg-[var(--color-bookub-container)] border-s-[var(--color-bookub)] text-[var(--color-on-bookub-container)]',
        payub:
          'bg-[var(--color-payub-container)] border-s-[var(--color-payub)] text-[var(--color-on-payub-container)]',
        founderub:
          'bg-[var(--color-founderub-container)] border-s-[var(--color-founderub)] text-[var(--color-on-founderub-container)]',
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
    const messages = useNexubMessages();
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
            aria-label={messages.dismissAlert}
            onClick={onClose}
            className={cn(
              'nx-state-layer shrink-0 inline-flex items-center justify-center rounded-full w-6 h-6',
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
