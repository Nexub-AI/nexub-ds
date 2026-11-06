// Charts 2.0 (4.5): Gauge, Heatmap, Funnel and KpiTile. Same rules as Chart.tsx:
// server components, SVG attributes only (strict-CSP safe), colours from the
// --color-chart-* palette, and a visually hidden table or text for screen
// readers with the drawing aria-hidden.
import * as React from 'react';
import { cn } from '../../utils/cn.js';
import { Sparkline, type ChartColor } from './Chart.js';

const FILL = ['fill-chart-1', 'fill-chart-2', 'fill-chart-3', 'fill-chart-4', 'fill-chart-5', 'fill-chart-6', 'fill-chart-7', 'fill-chart-8'];
const STROKE = ['stroke-chart-1', 'stroke-chart-2', 'stroke-chart-3', 'stroke-chart-4', 'stroke-chart-5', 'stroke-chart-6', 'stroke-chart-7', 'stroke-chart-8'];
// Sequential palette, light → dark, for heatmap intensity.
const SEQ = ['fill-chart-seq-1', 'fill-chart-seq-2', 'fill-chart-seq-3', 'fill-chart-seq-4', 'fill-chart-seq-5', 'fill-chart-seq-6', 'fill-chart-seq-7'];
const ci = (c: ChartColor | undefined) => ((c ?? 1) - 1) % 8;
const fmt = (n: number) => n.toLocaleString();

/* ── Gauge ─────────────────────────────────────────────────────────────────── */

export interface GaugeProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'color'> {
  value: number;
  /** @default 100 */
  max?: number;
  /** Accessible name, e.g. "Storage used". */
  title: string;
  /** Shown in the middle; defaults to the percentage. */
  label?: React.ReactNode;
  color?: ChartColor;
}

/** Progress toward a target on a 270° arc. */
export function Gauge({ value, max = 100, title, label, color = 1, className, ...props }: GaugeProps) {
  const pct = Math.max(0, Math.min(1, value / max));
  // r = 100 / 2π → circumference 100; the arc uses 75 of it (270°).
  const r = 15.9155;
  return (
    <figure aria-label={title} className={cn('m-0 inline-flex flex-col items-center', className)} {...props}>
      <div aria-hidden="true" className="relative size-36">
        <svg viewBox="0 0 42 42" className="size-full rotate-[135deg]">
          <circle cx="21" cy="21" r={r} fill="none" strokeWidth="4" strokeLinecap="round" strokeDasharray="75 25" className="stroke-[var(--color-surface-container-high)]" />
          <circle cx="21" cy="21" r={r} fill="none" strokeWidth="4" strokeLinecap="round" strokeDasharray={`${pct * 75} ${100 - pct * 75}`} className={STROKE[ci(color)]} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-title-lg tabular-nums text-[var(--color-on-surface)]">
          {label ?? `${Math.round(pct * 100)}%`}
        </div>
      </div>
      <figcaption className="sr-only">{`${title}: ${fmt(value)} of ${fmt(max)} (${Math.round(pct * 100)}%)`}</figcaption>
    </figure>
  );
}

/* ── Heatmap ───────────────────────────────────────────────────────────────── */

export interface HeatmapProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Rows of values, e.g. one row per weekday, one column per week. */
  data: number[][];
  rowLabels: string[];
  columnLabels?: string[];
  title: string;
  valueFormat?: (value: number) => string;
}

/** Intensity over a grid (activity by day and week, load by hour). Seven steps of the sequential palette. */
export function Heatmap({ data, rowLabels, columnLabels, title, valueFormat = fmt, className, ...props }: HeatmapProps) {
  const flat = data.flat();
  const lo = Math.min(...flat);
  const span = Math.max(...flat) - lo || 1;
  const step = (v: number) => Math.min(SEQ.length - 1, Math.floor(((v - lo) / span) * SEQ.length));
  const cols = Math.max(...data.map((r) => r.length));
  return (
    <figure aria-label={title} className={cn('m-0 flex gap-2', className)} {...props}>
      <div aria-hidden="true" className="flex flex-col justify-around text-label-sm text-[var(--color-on-surface-muted)]">
        {rowLabels.map((l) => <span key={l}>{l}</span>)}
      </div>
      <svg aria-hidden="true" viewBox={`0 0 ${cols * 12} ${data.length * 12}`} className="h-auto min-w-0 flex-1 rtl:-scale-x-100">
        {data.map((row, y) =>
          row.map((v, x) => (
            <rect key={`${x}-${y}`} x={x * 12 + 1} y={y * 12 + 1} width="10" height="10" rx="2" className={SEQ[step(v)]}>
              <title>{`${rowLabels[y]}${columnLabels?.[x] ? `, ${columnLabels[x]}` : ''}: ${valueFormat(v)}`}</title>
            </rect>
          )),
        )}
      </svg>
      <table className="sr-only">
        <caption>{title}</caption>
        <tbody>
          {data.map((row, y) => (
            <tr key={y}>
              <th scope="row">{rowLabels[y]}</th>
              {row.map((v, x) => <td key={x}>{valueFormat(v)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

/* ── Funnel ────────────────────────────────────────────────────────────────── */

export interface FunnelProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'color'> {
  data: { label: string; value: number }[];
  title: string;
  valueFormat?: (value: number) => string;
  color?: ChartColor;
}

/** Drop-off through ordered steps, with the conversion from the first step. */
export function Funnel({ data, title, valueFormat = fmt, color = 1, className, ...props }: FunnelProps) {
  const top = Math.max(1, data[0]?.value ?? 1);
  return (
    <figure aria-label={title} className={cn('m-0 flex flex-col gap-2', className)} {...props}>
      {data.map((d) => {
        const pct = Math.max(0, d.value) / top;
        return (
          <div key={d.label} aria-hidden="true" className="grid grid-cols-[8rem_1fr_4rem] items-center gap-3 text-body-sm">
            <span className="truncate text-[var(--color-on-surface-variant)]">{d.label}</span>
            <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="h-7 w-full">
              <rect x={(100 - pct * 100) / 2} y="0" width={pct * 100} height="10" rx="1.5" className={FILL[ci(color)]} />
            </svg>
            <span className="text-end tabular-nums text-[var(--color-on-surface)]">{valueFormat(d.value)}</span>
          </div>
        );
      })}
      <table className="sr-only">
        <caption>{title}</caption>
        <tbody>
          {data.map((d) => (
            <tr key={d.label}>
              <th scope="row">{d.label}</th>
              <td>{valueFormat(d.value)}</td>
              <td>{Math.round((Math.max(0, d.value) / top) * 100)}% of {data[0]?.label}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

/* ── KpiTile ───────────────────────────────────────────────────────────────── */

export interface KpiTileProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: React.ReactNode;
  /** Change versus the previous period, e.g. 0.114 for +11.4%. */
  change?: number;
  /** For metrics where down is good (churn, costs). */
  invert?: boolean;
  /** Recent values for the sparkline, oldest first. */
  trend?: number[];
}

/** A headline number with its change and a trend line. The change text carries good/bad colour; the trend stays the accent. */
export function KpiTile({ label, value, change, invert = false, trend, className, ...props }: KpiTileProps) {
  const good = change === undefined ? undefined : invert ? change < 0 : change > 0;
  const pct = change === undefined ? '' : `${change > 0 ? '+' : change < 0 ? '−' : ''}${Math.abs(change * 100).toFixed(1)}%`;
  return (
    <div className={cn('flex items-end justify-between gap-4 rounded-shape-container border border-[var(--color-outline-variant)] bg-[var(--color-surface-elevated)] p-4', className)} {...props}>
      <div className="flex min-w-0 flex-col gap-1">
        <span className="text-label-md text-[var(--color-on-surface-variant)]">{label}</span>
        <span className="text-headline-sm tabular-nums text-[var(--color-on-surface)]">{value}</span>
        {change !== undefined && (
          <span className={cn('text-label-md tabular-nums', good ? 'text-[var(--color-success)]' : change === 0 ? 'text-[var(--color-on-surface-variant)]' : 'text-[var(--color-error)]')}>
            {pct} <span className="sr-only">versus last period</span>
          </span>
        )}
      </div>
      {trend && trend.length > 1 && <Sparkline values={trend} area color={1} className="h-10 w-28 shrink-0" />}
    </div>
  );
}
