import * as React from 'react';
import { cn, IconChip, NumberTicker, Skeleton, Sparkline } from '@nexub/react';
import type { CategoryColor } from '@nexub/react';
import { TrendingUp, TrendingDown, Minus } from '@nexub/icons';

// A category's chart series (same hue), for the trend line.
const TREND_COLOR: Record<CategoryColor, 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8> = {
  accent: 1, blue: 1, amber: 2, emerald: 3, pink: 4, violet: 5, cyan: 6, red: 7, lime: 8,
};

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: React.ReactNode;
  delta?: string;
  /** Direction of the change: sets the arrow (and, by default, the colour). */
  deltaType?: 'increase' | 'decrease' | 'neutral';
  /**
   * Whether the change is good or bad, independent of its direction — e.g. churn going
   * down is `deltaType="decrease"` + `sentiment="positive"`.
   * @default derived from `deltaType` (increase → positive, decrease → negative)
   */
  sentiment?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
  /** 10.3: puts the icon on a tinted chip of this colour, and colours the trend line to match. */
  category?: CategoryColor;
  /** 10.3: recent values, drawn as a small trend line beside the delta. */
  trend?: number[];
  /** Accessible summary of the trend, e.g. "Last 12 weeks, rising". Without it the line is decorative. */
  trendLabel?: string;
  description?: string;
  /** Roll digits when a number/string `value` changes (NumberTicker); announced politely. */
  animate?: boolean;
  /** 10.5: skeletons in place of the value and the line under it; the card keeps its size. */
  loading?: boolean;
  /** 11.3: `sm` is the compact tile (less padding, smaller value). @default 'md' */
  size?: 'md' | 'sm';
  /** 11.3: an extra line inside the tile, under the change, e.g. "Includes 2 refunds". */
  note?: React.ReactNode;
  /** 11.3: `bad-when-high` inverts the derived colour (an increase shows the danger tone), for costs, churn, errors. `sentiment` still wins. @default 'default' */
  tone?: 'default' | 'bad-when-high';
  /**
   * 11.3: the change as a number. Sets the arrow from its sign and the text from
   * `changeFormat` (ignored when `delta` is set). Percent takes a fraction: 0.125 → "+12.5%".
   */
  change?: number;
  /** 11.3: how `change` is written. `absolute` adds the sign to the number. @default 'percent' */
  changeFormat?: 'percent' | 'absolute' | ((change: number) => string);
  /** 11.3: text after the change, e.g. "vs last month". */
  changeLabel?: React.ReactNode;
}

const sign = (n: number) => (n > 0 ? '+' : n < 0 ? '\u2212' : '');
function formatChange(n: number, format: StatCardProps['changeFormat'] = 'percent') {
  if (typeof format === 'function') return format(n);
  return format === 'absolute' ? `${sign(n)}${Math.abs(n).toLocaleString()}` : `${sign(n)}${Math.abs(n * 100).toFixed(1)}%`;
}

export const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      label,
      value,
      delta: deltaProp,
      deltaType: deltaTypeProp,
      sentiment,
      size = 'md',
      note,
      tone: toneProp = 'default',
      change,
      changeFormat,
      changeLabel,
      icon,
      category,
      trend,
      trendLabel,
      description,
      animate = false,
      loading = false,
      className,
      ...props
    },
    ref,
  ) => {
    const delta = deltaProp ?? (change === undefined ? undefined : formatChange(change, changeFormat));
    const deltaType =
      deltaTypeProp ??
      (change === undefined || deltaProp !== undefined ? 'neutral' : change > 0 ? 'increase' : change < 0 ? 'decrease' : 'neutral');
    const up = toneProp === 'bad-when-high' ? 'negative' : 'positive';
    const down = toneProp === 'bad-when-high' ? 'positive' : 'negative';
    const tone = sentiment ?? (deltaType === 'increase' ? up : deltaType === 'decrease' ? down : 'neutral');
    const deltaColor =
      tone === 'positive'
        ? 'text-[var(--color-success)]'
        : tone === 'negative'
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
        // Styling hook for the expression layers (@nexub/themes/vivid lifts it on hover).
        data-nx="stat-card"
        data-size={size === 'sm' ? 'sm' : undefined}
        aria-busy={loading || undefined}
        className={cn(
          'rounded-shape-container border border-[color-mix(in_srgb,var(--color-outline-variant)_60%,transparent)] bg-[var(--color-surface-elevated)] flex flex-col',
          size === 'sm' ? 'p-4 gap-2' : 'p-6 gap-3',
          className,
        )}
        {...props}
      >
        <div className="flex items-center justify-between">
          <span className="text-body-sm font-medium text-[var(--color-on-surface-muted)]">{label}</span>
          {icon &&
            (category ? (
              <IconChip category={category} size="sm">
                {icon}
              </IconChip>
            ) : (
              <span className="text-[var(--color-on-surface-muted)]">{icon}</span>
            ))}
        </div>

        <div
          className={cn(
            'font-bold tracking-tight tabular-nums text-[var(--color-on-surface)]',
            size === 'sm' ? 'text-headline-sm' : 'text-[1.875rem] leading-9',
          )}
        >
          {loading ? (
            <Skeleton className="inline-block h-7 w-24 align-middle" />
          ) : animate && (typeof value === 'number' || typeof value === 'string') ? (
            <NumberTicker value={value} aria-live="polite" />
          ) : (
            value
          )}
        </div>

        {(delta || description || changeLabel || trend) && (
          <div className={cn('flex items-center gap-2', loading && 'invisible')}>
            {delta && (
              <span
                className={cn('inline-flex items-center gap-1 text-label-sm font-medium', deltaColor)}
                data-delta-type={deltaType}
                data-sentiment={tone}
              >
                <DeltaIcon size="xs" aria-hidden="true" />
                {delta}
              </span>
            )}
            {changeLabel != null && changeLabel !== false && (
              <span className="text-label-sm font-normal text-[var(--color-on-surface-muted)]">{changeLabel}</span>
            )}
            {description && (
              <span className="text-label-sm font-normal text-[var(--color-on-surface-muted)]">{description}</span>
            )}
            {trend && trend.length > 1 && (
              <Sparkline
                values={trend}
                label={trendLabel}
                area
                color={TREND_COLOR[category ?? 'blue']}
                className="ms-auto h-6 w-20 shrink-0"
              />
            )}
          </div>
        )}

        {note != null && note !== false && (
          <div className={cn('text-body-sm text-[var(--color-on-surface-muted)]', loading && 'invisible')}>{note}</div>
        )}
      </div>
    );
  },
);

StatCard.displayName = 'StatCard';
