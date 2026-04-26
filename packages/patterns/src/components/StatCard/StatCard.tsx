import * as React from 'react';
import { cn } from '@nexub/react';
import { TrendingUp, TrendingDown, Minus } from '@nexub/icons';

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: React.ReactNode;
  delta?: string;
  deltaType?: 'increase' | 'decrease' | 'neutral';
  icon?: React.ReactNode;
  description?: string;
}

export const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      label,
      value,
      delta,
      deltaType = 'neutral',
      icon,
      description,
      className,
      ...props
    },
    ref,
  ) => {
    const deltaColor =
      deltaType === 'increase'
        ? 'var(--color-success-500)'
        : deltaType === 'decrease'
          ? 'var(--color-error-500)'
          : 'var(--color-text-muted)';

    const DeltaIcon =
      deltaType === 'increase'
        ? TrendingUp
        : deltaType === 'decrease'
          ? TrendingDown
          : Minus;

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-default)] p-6 flex flex-col gap-3',
          className,
        )}
        {...props}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[var(--color-text-muted)]">{label}</span>
          {icon && <span className="text-[var(--color-text-muted)]">{icon}</span>}
        </div>

        <div className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
          {value}
        </div>

        {(delta || description) && (
          <div className="flex items-center gap-2">
            {delta && (
              <span
                className="inline-flex items-center gap-1 text-xs font-medium"
                style={{ color: deltaColor }}
                data-delta-type={deltaType}
              >
                <DeltaIcon size="xs" aria-hidden="true" />
                {delta}
              </span>
            )}
            {description && (
              <span className="text-xs text-[var(--color-text-muted)]">{description}</span>
            )}
          </div>
        )}
      </div>
    );
  },
);

StatCard.displayName = 'StatCard';
