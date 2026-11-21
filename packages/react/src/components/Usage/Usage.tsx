'use client';

// UsageTile and UsageBar (11.3): "used of limit" with a bar that warns near and
// at the limit. The bar is a Progress with role="meter" (a usage level, not a
// task's progress); the level is also said in text, never colour alone.
import * as React from 'react';
import { cn } from '../../utils/cn.js';
import { dataBusy, dataState, type DataStateProps } from '../../utils/dataState.js';
import { Progress } from '../Progress/Progress.js';
import { Skeleton } from '../Skeleton/Skeleton.js';
import { useIntlLocale, useNexubMessages } from '../NexubProvider/NexubProvider.js';

export type UsageLevel = 'ok' | 'warning' | 'danger' | 'unlimited';

/** Share used (0…, may pass 1) and the level: `warning` from `warnAt`, `danger` at or over the limit. */
export function usageLevel(used: number, limit: number | null | undefined, warnAt = 0.8): { ratio: number; percent: number; level: UsageLevel } {
  if (limit == null || limit === Infinity) return { ratio: 0, percent: 0, level: 'unlimited' };
  const ratio = limit > 0 ? used / limit : used > 0 ? 1 : 0;
  const level = ratio >= 1 ? 'danger' : ratio >= warnAt ? 'warning' : 'ok';
  return { ratio, percent: Math.round(ratio * 100), level };
}

const BAR_TONE = { ok: 'info', warning: 'warning', danger: 'danger', unlimited: 'neutral' } as const;
const TEXT_TONE = { ok: 'text-on-surface-variant', warning: 'text-warning', danger: 'text-error', unlimited: 'text-on-surface-variant' };

interface UsageBaseProps {
  used: number;
  /** `null` or `Infinity` = no limit: the value and "Unlimited", no bar. */
  limit: number | null;
  /** Share of the limit that turns the bar to the warning tone. @default 0.8 */
  warnAt?: number;
  /** Formats `used` and `limit`. @default toLocaleString */
  valueFormat?: (value: number) => string;
}

function useUsage({ used, limit, warnAt, valueFormat }: UsageBaseProps) {
  const t = useNexubMessages();
  const locale = useIntlLocale();
  const fmt = valueFormat ?? ((n: number) => n.toLocaleString(locale));
  const u = usageLevel(used ?? 0, limit, warnAt);
  const hint = u.level === 'danger' ? t.limitReached : u.level === 'unlimited' ? t.unlimited : t.usagePercent(u.percent);
  const of = u.level === 'unlimited' ? `${fmt(used)}, ${hint}` : `${t.usageOf(fmt(used), fmt(limit as number))}, ${hint}`;
  return { ...u, fmt, hint, of };
}

const meter = (u: ReturnType<typeof useUsage>, size: 'sm' | 'md', name: Record<string, string | undefined>, className?: string) => (
  <Progress
    role="meter"
    {...name}
    aria-valuetext={u.of}
    data-level={u.level}
    value={Math.min(u.percent, 100)}
    size={size}
    tone={BAR_TONE[u.level]}
    className={className}
  />
);

/* ── UsageTile ─────────────────────────────────────────────────────────────── */

export interface UsageTileProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>, Omit<UsageBaseProps, 'used'>, DataStateProps {
  label: React.ReactNode;
  /** `null` / undefined = no data yet (empty state). */
  used: number | null | undefined;
  /** Extra line under the bar, e.g. "Resets on 1 May". */
  note?: React.ReactNode;
  /** A control beside the label, e.g. an "Upgrade" link. */
  action?: React.ReactNode;
}

/** A tile for "used of limit": the value, the limit, and a bar that warns near and at the limit. */
export const UsageTile = React.forwardRef<HTMLDivElement, UsageTileProps>(
  ({ label, used, limit, warnAt, valueFormat, note, action, loading, emptyState, errorState, className, ...props }, ref) => {
    const t = useNexubMessages();
    const id = React.useId();
    const states = { loading, emptyState, errorState };
    const state = dataState(states, used == null, <span className="flex h-[1lh] items-center text-headline-sm"><Skeleton className="w-20" /></span>, t.emptyStates.noData.title);
    const u = useUsage({ used: used ?? 0, limit, warnAt, valueFormat });
    const unlimited = u.level === 'unlimited';
    return (
      <div
        ref={ref}
        data-nx="usage-tile"
        data-level={state == null ? u.level : undefined}
        aria-busy={dataBusy(states)}
        className={cn('flex flex-col gap-2 rounded-shape-container border border-outline-variant bg-surface-elevated p-4', className)}
        {...props}
      >
        <div className="flex items-start justify-between gap-2">
          <span id={id} className="text-label-md text-on-surface-variant">{label}</span>
          {action}
        </div>
        {state ?? (
          <>
            <p className="m-0 flex flex-wrap items-baseline gap-x-1">
              <span className="text-headline-sm tabular-nums text-on-surface">{u.fmt(used as number)}</span>
              {!unlimited && <span className="text-body-sm tabular-nums text-on-surface-variant">/ {u.fmt(limit as number)}</span>}
            </p>
            {!unlimited && meter(u, 'md', { 'aria-labelledby': id })}
            <span className={cn('text-label-md', TEXT_TONE[u.level], u.level === 'danger' && 'font-medium')}>{u.hint}</span>
          </>
        )}
        {note != null && note !== false && <div className="text-body-sm text-on-surface-muted">{note}</div>}
      </div>
    );
  },
);
UsageTile.displayName = 'UsageTile';

/* ── UsageBar ──────────────────────────────────────────────────────────────── */

export interface UsageBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>, UsageBaseProps {
  /** Inline text beside the bar. @default "used / limit"; `false` hides it. */
  label?: React.ReactNode;
  /** Names the meter, e.g. "Seats". Without it the meter is named by its value. */
  'aria-label'?: string;
  /** @default 'sm' */
  size?: 'sm' | 'md';
}

/** Compact used-of-limit bar for table cells and fact grids. */
export const UsageBar = React.forwardRef<HTMLDivElement, UsageBarProps>(
  ({ used, limit, warnAt, valueFormat, label, size = 'sm', 'aria-label': name, className, ...props }, ref) => {
    const u = useUsage({ used, limit, warnAt, valueFormat });
    const unlimited = u.level === 'unlimited';
    const text = label ?? (unlimited ? `${u.fmt(used)} · ${u.hint}` : `${u.fmt(used)} / ${u.fmt(limit as number)}`);
    return (
      <div ref={ref} data-nx="usage-bar" data-level={u.level} className={cn('flex min-w-0 items-center gap-2', className)} {...props}>
        {!unlimited && meter(u, size, { 'aria-label': name ?? u.of }, 'min-w-12 flex-1')}
        {text !== false && (
          <span
            aria-hidden={unlimited ? undefined : true}
            className={cn('whitespace-nowrap tabular-nums', size === 'sm' ? 'text-label-sm' : 'text-label-md', TEXT_TONE[u.level], u.level === 'danger' && 'font-medium')}
          >
            {text}
          </span>
        )}
      </div>
    );
  },
);
UsageBar.displayName = 'UsageBar';
