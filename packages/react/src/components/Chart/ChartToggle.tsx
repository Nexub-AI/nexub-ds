'use client';

// ChartToggle (4.6): a legend whose entries are toggle buttons. It renders the
// legend and passes the visible series to its child function, so it works with
// any chart (BarChart, LineChart) while the charts themselves stay server
// components. At least one series always stays on.
import * as React from 'react';
import { cn } from '../../utils/cn.js';
import type { ChartColor, ChartSeries } from './Chart.js';

const BG = ['bg-chart-1', 'bg-chart-2', 'bg-chart-3', 'bg-chart-4', 'bg-chart-5', 'bg-chart-6', 'bg-chart-7', 'bg-chart-8'];

export interface ChartToggleProps {
  series: ChartSeries[];
  /** Renders the chart with the series that are switched on. */
  children: (visible: ChartSeries[]) => React.ReactNode;
  /** Accessible name for the group of toggles. @default 'Series' */
  label?: string;
  className?: string;
}

export function ChartToggle({ series, children, label = 'Series', className }: ChartToggleProps) {
  const [hidden, setHidden] = React.useState<Set<string>>(() => new Set());
  // Keep each series' palette colour stable while others are hidden.
  const coloured = series.map((s, i) => ({ ...s, color: s.color ?? (((i % 8) + 1) as ChartColor) }));
  const visible = coloured.filter((s) => !hidden.has(s.key));
  const toggle = (key: string) =>
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else if (series.length - next.size > 1) next.add(key);
      return next;
    });
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div role="group" aria-label={label} className="flex flex-wrap gap-2">
        {coloured.map((s) => {
          const on = !hidden.has(s.key);
          return (
            <button
              key={s.key}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(s.key)}
              className={cn(
                'nx-state-layer inline-flex h-control-xs items-center gap-1.5 rounded-full border px-2.5 text-label-md',
                on ? 'border-[var(--color-outline-variant)] text-[var(--color-on-surface)]' : 'border-dashed border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] line-through',
              )}
            >
              <span aria-hidden="true" className={cn('size-2.5 rounded-full', on ? BG[(s.color - 1) % 8] : 'bg-[var(--color-outline-variant)]')} />
              {s.label ?? s.key}
            </button>
          );
        })}
      </div>
      {children(visible)}
    </div>
  );
}
