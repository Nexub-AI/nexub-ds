import * as React from 'react';
import type { CategoryColor } from '@nexub/core';
import { cn } from '../../utils/cn.js';

export interface ComparisonBarSide {
  /** Who or what this side is, e.g. "Team A". */
  label: string;
  value: number;
  /** A stable identity colour. With it the side keeps this colour whether it is ahead or behind. */
  color?: CategoryColor;
}

export interface ComparisonBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** What is compared, e.g. "Orders". */
  label: string;
  /** The side at the inline start (the left in left-to-right text). */
  left: ComparisonBarSide;
  /** The side at the inline end. */
  right: ComparisonBarSide;
  /** @default String */
  valueFormat?: (value: number) => string;
  /** @default 'md' */
  size?: 'sm' | 'md';
  /** The two values and the label above the bar. @default true */
  showValues?: boolean;
  /** The two side labels under the bar. Turn off for every bar but one in a group. @default true */
  showLabels?: boolean;
  /** `higher`: the larger side takes the accent and the other is muted; equal values look the same. @default 'higher' */
  highlight?: 'higher' | 'none';
  /** Replaces the text alternative built from the props ("Orders: Team A 3, Team B 1"). */
  'aria-label'?: string;
}

/** Smallest share of the bar a side gets, in percent, so a zero is still visible. */
const MIN_SHARE = 4;

const segment =
  'h-full min-w-0 rounded-full border border-transparent forced-colors:bg-[CanvasText] ' +
  'transition-[flex-grow] duration-spatial-default ease-spatial-default motion-reduce:transition-none';

/**
 * Two values on one split bar (10.7): this period against the last, one plan
 * against another, two teams. The numbers are always there as text; the bar is
 * an image with a text alternative, so colour is never the only signal.
 */
export const ComparisonBar = React.forwardRef<HTMLDivElement, ComparisonBarProps>(
  (
    { label, left, right, valueFormat = String, size = 'md', showValues = true, showLabels = true, highlight = 'higher', className, 'aria-label': ariaLabel, ...props },
    ref,
  ) => {
    const l = Math.max(0, left.value) || 0;
    const r = Math.max(0, right.value) || 0;
    const share = l + r > 0 ? Math.min(100 - MIN_SHARE, Math.max(MIN_SHARE, (l / (l + r)) * 100)) : 50;
    const sides = [
      { side: left, share, behind: highlight === 'higher' && l < r },
      { side: right, share: 100 - share, behind: highlight === 'higher' && r < l },
    ];
    const text = size === 'sm' ? 'text-label-sm' : 'text-label-md';
    const value = (i: 0 | 1) => (
      <span
        className={cn(
          'tabular-nums',
          size === 'sm' ? 'text-label-md' : 'text-label-lg',
          sides[i]!.behind ? 'text-[var(--color-on-surface-variant)]' : 'font-semibold text-[var(--color-on-surface)]',
        )}
      >
        {valueFormat(sides[i]!.side.value)}
      </span>
    );
    return (
      <div ref={ref} data-nx="comparison-bar" className={cn('flex w-full flex-col gap-1', className)} {...props}>
        {showValues && (
          <div aria-hidden="true" className="flex items-baseline justify-between gap-3">
            {value(0)}
            <span className={cn('min-w-0 text-center text-[var(--color-on-surface-variant)]', text)}>{label}</span>
            {value(1)}
          </div>
        )}
        <div
          role="img"
          aria-label={ariaLabel ?? `${label}: ${left.label} ${valueFormat(left.value)}, ${right.label} ${valueFormat(right.value)}`}
          className={cn('flex w-full gap-0.5', size === 'sm' ? 'h-1.5' : 'h-2.5')}
        >
          {sides.map(({ side, share, behind }, i) => (
            <span
              key={i}
              data-side={i === 0 ? 'start' : 'end'}
              data-category={side.color}
              // flex-grow, not width: the gap comes off both sides evenly and it follows the text direction.
              style={{ flexGrow: share, flexBasis: 0 }}
              className={cn(
                segment,
                side.color
                  ? 'bg-[var(--nx-cat,var(--color-primary))]'
                  : behind
                    ? 'bg-[var(--color-outline)]'
                    : 'bg-[var(--color-primary)]',
              )}
            />
          ))}
        </div>
        {showLabels && (
          <div aria-hidden="true" className={cn('flex justify-between gap-3 text-[var(--color-on-surface-muted)]', text)}>
            <span className="min-w-0">{left.label}</span>
            <span className="min-w-0 text-end">{right.label}</span>
          </div>
        )}
      </div>
    );
  },
);
ComparisonBar.displayName = 'ComparisonBar';
