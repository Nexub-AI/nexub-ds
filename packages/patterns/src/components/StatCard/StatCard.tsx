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
        ? 'text-[var(--color-success)]'
        : deltaType === 'decrease'
          ? 'text-[var(--color-error)]'
          : 'text-[var(--color-on-surface-muted)]';

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
          'rounded-shape-container border border-[color-mix(in_srgb,var(--color-outline-variant)_60%,transparent)] bg-[var(--color-surface-elevated)] p-6 flex flex-col gap-3',
          className,
        )}
        {...props}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[var(--color-on-surface-muted)]">{label}</span>
          {icon && <span className="text-[var(--color-on-surface-muted)]">{icon}</span>}
        </div>

        <div className="text-3xl font-bold tracking-tight text-[var(--color-on-surface)]">
          {value}
        </div>

        {(delta || description) && (
          <div className="flex items-center gap-2">
            {delta && (
              <span
                className={cn('inline-flex items-center gap-1 text-xs font-medium', deltaColor)}
                data-delta-type={deltaType}
              >
                <DeltaIcon size="xs" aria-hidden="true" />
                {delta}
              </span>
            )}
            {description && (
              <span className="text-xs text-[var(--color-on-surface-muted)]">{description}</span>
            )}
          </div>
        )}
      </div>
    );
  },
);

StatCard.displayName = 'StatCard';
