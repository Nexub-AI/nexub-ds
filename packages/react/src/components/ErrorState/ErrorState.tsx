'use client';

import * as React from 'react';
import { AlertTriangle, AlertCircle, Info } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import { pressable } from '../../utils/control.js';

type ErrorTone = 'error' | 'warning' | 'info';

const toneConfig: Record<ErrorTone, { icon: React.ReactNode; color: string }> = {
  error: {
    icon: <AlertCircle size="xl" aria-hidden="true" />,
    color: 'text-[var(--color-error)]',
  },
  warning: {
    icon: <AlertTriangle size="xl" aria-hidden="true" />,
    color: 'text-[var(--color-warning)]',
  },
  info: {
    icon: <Info size="xl" aria-hidden="true" />,
    color: 'text-[var(--color-info)]',
  },
};

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  tone?: ErrorTone;
  onRetry?: () => void;
  /** Text of the retry button. @default 'Try again' */
  retryLabel?: React.ReactNode;
}

export const ErrorState = React.forwardRef<HTMLDivElement, ErrorStateProps>(
  ({ className, title, description, tone = 'error', onRetry, retryLabel = 'Try again', ...props }, ref) => {
    const { icon, color } = toneConfig[tone];
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center gap-4 py-16 text-center',
          className,
        )}
        {...props}
      >
        <span className={color}>{icon}</span>
        <div className="flex flex-col gap-1">
          <h3 className="text-body-lg font-semibold text-[var(--color-on-surface)]">{title}</h3>
          {description && (
            <p className="max-w-sm text-body-sm text-[var(--color-on-surface-muted)]">{description}</p>
          )}
        </div>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className={cn(pressable, 'inline-flex h-9 items-center justify-center bg-[var(--color-primary)] px-4 text-label-lg text-[var(--color-on-primary)]')}
          >
            {retryLabel}
          </button>
        )}
      </div>
    );
  },
);
ErrorState.displayName = 'ErrorState';
