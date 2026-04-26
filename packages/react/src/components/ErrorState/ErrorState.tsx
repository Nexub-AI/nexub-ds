import * as React from 'react';
import { AlertTriangle, AlertCircle, Info } from '@nexub/icons';
import { cn } from '../../utils/cn.js';

type ErrorTone = 'error' | 'warning' | 'info';

const toneConfig: Record<ErrorTone, { icon: React.ReactNode; color: string }> = {
  error: {
    icon: <AlertCircle size="xl" aria-hidden="true" />,
    color: 'text-[var(--color-semantic-error-default)]',
  },
  warning: {
    icon: <AlertTriangle size="xl" aria-hidden="true" />,
    color: 'text-[var(--color-semantic-warning-default)]',
  },
  info: {
    icon: <Info size="xl" aria-hidden="true" />,
    color: 'text-[var(--color-semantic-info-default)]',
  },
};

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  tone?: ErrorTone;
  onRetry?: () => void;
}

export const ErrorState = React.forwardRef<HTMLDivElement, ErrorStateProps>(
  ({ className, title, description, tone = 'error', onRetry, ...props }, ref) => {
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
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">{title}</h3>
          {description && (
            <p className="max-w-sm text-sm text-[var(--color-text-muted)]">{description}</p>
          )}
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex h-9 items-center justify-center rounded-md bg-[var(--color-brand-primary-500)] px-4 text-sm font-medium text-white hover:bg-[var(--color-brand-primary-600)] transition-colors"
          >
            Try again
          </button>
        )}
      </div>
    );
  },
);
ErrorState.displayName = 'ErrorState';
