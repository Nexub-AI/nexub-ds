// Charts 2.0 (4.5): Gauge, Heatmap, Funnel and KpiTile. Same rules as Chart.tsx:
// server components, SVG attributes only (strict-CSP safe), colours from the
// --color-chart-* palette, and a visually hidden table or text for screen
// readers with the drawing aria-hidden.
import * as React from 'react';
import { defaultMessages } from '@nexub/core';
import { cn } from '../../utils/cn.js';
import { dataBusy, dataState, type DataStateProps } from '../../utils/dataState.js';
import { Skeleton } from '../Skeleton/Skeleton.js';
import { Sparkline, chartState, pt, type ChartColor, type ChartInteractiveProps, type ChartIx, type ChartPoint } from './Chart.js';
import { InteractiveFunnel, InteractiveHeatmap } from './ChartInteraction.js';
import { ChartTableView } from './ChartTable.js';

const FILL = ['fill-chart-1', 'fill-chart-2', 'fill-chart-3', 'fill-chart-4', 'fill-chart-5', 'fill-chart-6', 'fill-chart-7', 'fill-chart-8'];
const STROKE = ['stroke-chart-1', 'stroke-chart-2', 'stroke-chart-3', 'stroke-chart-4', 'stroke-chart-5', 'stroke-chart-6', 'stroke-chart-7', 'stroke-chart-8'];
// Sequential palette, light → dark, for heatmap intensity.
const SEQ = ['fill-chart-seq-1', 'fill-chart-seq-2', 'fill-chart-seq-3', 'fill-chart-seq-4', 'fill-chart-seq-5', 'fill-chart-seq-6', 'fill-chart-seq-7'];
const ci = (c: ChartColor | undefined) => ((c ?? 1) - 1) % 8;
const fmt = (n: number) => n.toLocaleString();

/* ── Gauge ─────────────────────────────────────────────────────────────────── */

/** 11.3: a status colour for the gauge arc, in place of `color`. Pair it with a `caption` so colour is not the only signal. */
export type GaugeTone = 'good' | 'warning' | 'danger';
const TONE_STROKE: Record<GaugeTone, string> = { good: 'stroke-success', warning: 'stroke-warning', danger: 'stroke-error' };

export interface GaugeProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'color'>, DataStateProps {
  value: number;
  /** @default 100 */
  max?: number;
  /** Accessible name, e.g. "Storage used". */
  title: string;
  /** Shown in the middle; defaults to the percentage. */
  label?: React.ReactNode;
  color?: ChartColor;
  /** 11.3: success, warning or error colour for the arc; wins over `color`. */
  tone?: GaugeTone;
  /** 11.3: a short line under the value, e.g. "of 50 GB" or "On track". Also read with the value. */
  caption?: React.ReactNode;
}

/** Progress toward a target on a 270° arc. */
export function Gauge({ value, max = 100, title, label, color = 1, tone, caption, className, loading, emptyState, errorState, ...props }: GaugeProps) {
  const states = { loading, emptyState, errorState };
  // Empty is a value that is not a number yet (undefined, NaN).
  const state = chartState(states, !Number.isFinite(value), 'min-h-36 min-w-36', <Skeleton shape="circle" className="size-36" />);
  if (state) {
    return (
      <figure aria-label={title} aria-busy={dataBusy(states)} className={cn('m-0 inline-flex flex-col items-center', className)} {...props}>
        {state}
      </figure>
    );
  }
  const pct = Math.max(0, Math.min(1, value / max));
  // r = 100 / 2π → circumference 100; the arc uses 75 of it (270°).
  const r = 15.9155;
  const shown = label ?? `${Math.round(pct * 100)}%`;
  return (
    <figure aria-label={title} className={cn('m-0 inline-flex flex-col items-center', className)} {...props}>
      <div aria-hidden="true" className="relative size-36">
        <svg viewBox="0 0 42 42" className="size-full rotate-[135deg]">
          <circle cx="21" cy="21" r={r} fill="none" strokeWidth="4" strokeLinecap="round" strokeDasharray="75 25" className="stroke-[var(--color-surface-container-high)]" />
          <circle cx="21" cy="21" r={r} fill="none" strokeWidth="4" strokeLinecap="round" strokeDasharray={`${pct * 75} ${100 - pct * 75}`} className={tone ? TONE_STROKE[tone] : STROKE[ci(color)]} />
        </svg>
        {caption == null ? (
          <div className="absolute inset-0 flex items-center justify-center text-title-lg tabular-nums text-[var(--color-on-surface)]">{shown}</div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <span className="text-title-lg tabular-nums text-on-surface">{shown}</span>
            <span data-gauge-caption="" className="line-clamp-2 text-label-sm text-on-surface-variant">{caption}</span>
          </div>
        )}
      </div>
      <figcaption className="sr-only">
        {`${title}: ${fmt(value)} of ${fmt(max)} (${Math.round(pct * 100)}%)`}
        {caption != null && <>, {caption}</>}
      </figcaption>
    </figure>
  );
}

/* ── Heatmap ───────────────────────────────────────────────────────────────── */

/** The cell handed to a Heatmap's `onPointClick` (10.7). `index` counts cells row by row. */
export interface HeatmapPoint {
  index: number;
  row: number;
  column: number;
  value: number;
}

export interface HeatmapProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'>, DataStateProps, ChartInteractiveProps<HeatmapPoint> {
  /**
   * Rows of values, e.g. one row per weekday, one column per week. 11.3: a missing
   * cell (`null`, `undefined` or a hole) is drawn as an empty hatched cell and listed as "—".
   */
  data: (number | null | undefined)[][];
  rowLabels: string[];
  columnLabels?: string[];
  title: string;
  valueFormat?: (value: number) => string;
  /** 11.3: a low → high scale under the grid with the min and max values. */
  legend?: boolean;
  /** 11.3: a "Show as table" disclosure under the drawing; a string sets its label. */
  tableView?: boolean | string;
}

/** Intensity over a grid (activity by day and week, load by hour). Seven steps of the sequential palette. */
export function Heatmap(props: HeatmapProps) {
  return (props.interactive ?? props.onPointClick) ? <InteractiveHeatmap {...props} /> : <HeatmapView {...props} />;
}

/** A missing heatmap cell: outlined and struck through, so it reads as "no value", not as "low". */
const MissingCell = ({ x, y }: { x: number; y: number }) => (
  <>
    <rect x={x + 1.5} y={y + 1.5} width="9" height="9" rx="2" fill="none" strokeWidth="0.75" className="stroke-outline-variant" />
    <line x1={x + 3.5} y1={y + 8.5} x2={x + 8.5} y2={y + 3.5} strokeWidth="0.75" strokeLinecap="round" className="stroke-outline-variant" />
  </>
);

/** Internal: the drawing. */
export function HeatmapView({
  data, rowLabels, columnLabels, title, valueFormat = fmt, legend, tableView, className, loading, emptyState, errorState, ix,
  interactive: _interactive, onPointClick: _onPointClick, ...props
}: HeatmapProps & { ix?: ChartIx }) {
  const flat = data.flat().filter((v): v is number => typeof v === 'number');
  const states = { loading, emptyState, errorState };
  const state = chartState(states, flat.length === 0, 'min-h-32 min-w-0 flex-1');
  if (state) {
    return (
      <figure aria-label={title} aria-busy={dataBusy(states)} className={cn('m-0 flex gap-2', className)} {...props}>
        {state}
      </figure>
    );
  }
  const lo = Math.min(...flat);
  const hi = Math.max(...flat);
  const span = hi - lo || 1;
  const step = (v: number) => Math.min(SEQ.length - 1, Math.floor(((v - lo) / span) * SEQ.length));
  const cols = Math.max(...data.map((r) => r.length));
  const say = (v: number | null | undefined) => (v == null ? defaultMessages.noValue : valueFormat(v));
  const missing = data.some((row) => Array.from(row).some((v) => v == null));
  const cells = (className: string) => (
    <svg aria-hidden="true" viewBox={`0 0 ${cols * 12} ${data.length * 12}`} className={className}>
      {data.map((row, y) =>
        // Array.from visits holes, which row.map would skip.
        Array.from(row, (v, x) => {
          const name = `${rowLabels[y]}${columnLabels?.[x] ? `, ${columnLabels[x]}` : ''}: ${say(v)}`;
          if (v == null) {
            return (
              <g key={`${x}-${y}`} data-missing="">
                <title>{name}</title>
                <MissingCell x={x * 12} y={y * 12} />
              </g>
            );
          }
          return (
            <rect key={`${x}-${y}`} x={x * 12 + 1} y={y * 12 + 1} width="10" height="10" rx="2" data-pt={pt(ix, y * cols + x)} className={SEQ[step(v)]}>
              <title>{name}</title>
            </rect>
          );
        }),
      )}
    </svg>
  );
  const grid = (
    <>
      <div aria-hidden="true" className="flex flex-col justify-around text-label-sm text-[var(--color-on-surface-muted)]">
        {rowLabels.map((l) => <span key={l}>{l}</span>)}
      </div>
      {ix?.overlay != null ? (
        <div className="relative min-w-0 flex-1 self-start">
          {cells('block h-auto w-full rtl:-scale-x-100')}
          {ix.overlay}
        </div>
      ) : cells('h-auto min-w-0 flex-1 rtl:-scale-x-100')}
      <table className="sr-only">
        <caption>{title}</caption>
        <tbody>
          {data.map((row, y) => (
            <tr key={y}>
              <th scope="row">{rowLabels[y]}</th>
              {Array.from(row, (v, x) => <td key={x}>{say(v)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
  if (!legend && !tableView) {
    return (
      <figure aria-label={title} className={cn('m-0 flex gap-2', className)} {...props}>
        {grid}
      </figure>
    );
  }
  return (
    <figure aria-label={title} className={cn('m-0 flex flex-col gap-3', className)} {...props}>
      <div className="flex gap-2">{grid}</div>
      {legend && (
        // The table carries every value; the scale is for sighted readers.
        <div aria-hidden="true" data-chart-legend="" className="flex flex-wrap items-center gap-2 text-label-sm tabular-nums text-on-surface-variant">
          <span>{valueFormat(lo)}</span>
          <svg viewBox={`0 0 ${SEQ.length * 12} 12`} className="h-3 w-auto rtl:-scale-x-100">
            {SEQ.map((c, i) => <rect key={c} x={i * 12 + 1} y="1" width="10" height="10" rx="2" className={c} />)}
          </svg>
          <span>{valueFormat(hi)}</span>
          {missing && (
            <span className="ms-2 inline-flex items-center gap-1">
              <svg viewBox="0 0 12 12" className="size-3"><MissingCell x={0} y={0} /></svg>
              {defaultMessages.chartNoData}
            </span>
          )}
        </div>
      )}
      {tableView && (
        <ChartTableView
          caption={title}
          label={typeof tableView === 'string' ? tableView : undefined}
          columns={[defaultMessages.chartLabel, ...Array.from({ length: cols }, (_, x) => columnLabels?.[x] ?? String(x + 1))]}
          rows={data.map((row, y) => [rowLabels[y] ?? '', ...Array.from({ length: cols }, (_, x) => say(row[x]))])}
        />
      )}
    </figure>
  );
}

/* ── Funnel ────────────────────────────────────────────────────────────────── */

/** One step of a Funnel. 11.3: `values` holds the other series' numbers, keyed by series key. */
export interface FunnelDatum {
  label: string;
  value: number;
  values?: Record<string, number>;
}

/** 11.3: one series of a several-series Funnel. `key` is `'value'` (the datum's own value) or a key of `values`. */
export interface FunnelSeries {
  key: string;
  label?: string;
  color?: ChartColor;
}

export interface FunnelProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'color'>, DataStateProps, ChartInteractiveProps<ChartPoint<{ label: string; value: number }>> {
  data: FunnelDatum[];
  title: string;
  valueFormat?: (value: number) => string;
  color?: ChartColor;
  /**
   * 11.3: several series per step (this month vs last, web vs app), drawn as stacked
   * thin bars with a legend. `{ key: 'value' }` reads each step's `value`, any other
   * key reads `values[key]`. The interactive tooltip and `onPointClick` use `value`.
   */
  series?: FunnelSeries[];
  /**
   * 11.3: visible numbers under each step: `conversion` (share of the first step and of
   * the previous step), `drop-off` (how many left since the previous step), or `both`.
   * Unset draws the bars only, as before.
   */
  show?: 'drop-off' | 'conversion' | 'both';
  /** 11.3: a "Show as table" disclosure under the drawing; a string sets its label. */
  tableView?: boolean | string;
}

/** Drop-off through ordered steps, with the conversion from the first step. */
export function Funnel(props: FunnelProps) {
  return (props.interactive ?? props.onPointClick) ? <InteractiveFunnel {...props} /> : <FunnelView {...props} />;
}

const percent = (part: number, whole: number) => `${whole > 0 ? Math.round((Math.max(0, part) / whole) * 100) : 0}%`;

/** Internal: the drawing. */
export function FunnelView({
  data, title, valueFormat = fmt, color = 1, series, show, tableView, className, loading, emptyState, errorState, ix,
  interactive: _interactive, onPointClick: _onPointClick, ...props
}: FunnelProps & { ix?: ChartIx }) {
  const states = { loading, emptyState, errorState };
  // Three bars, each as tall as a step's row.
  const state = chartState(states, data.length === 0, 'min-h-24 gap-2', [0, 1, 2].map((i) => <Skeleton key={i} shape="rect" className="h-7" />));
  if (state) {
    return (
      <figure aria-label={title} aria-busy={dataBusy(states)} className={cn('m-0 flex flex-col gap-2', className)} {...props}>
        {state}
      </figure>
    );
  }
  const list: FunnelSeries[] = series?.length ? series : [{ key: 'value', color }];
  const many = list.length > 1;
  const get = (d: FunnelDatum | undefined, key: string) => (key === 'value' ? d?.value : d?.values?.[key]) ?? 0;
  const nameOf = (s: FunnelSeries) => s.label ?? (s.key === 'value' ? defaultMessages.chartValue : s.key);
  // One width scale for every series, so they compare.
  const top = Math.max(1, ...list.map((s) => get(data[0], s.key)));
  const first = data[0]!.label;
  // The visible numbers under a step, for one series.
  const meta = (i: number, key: string) => {
    const v = get(data[i], key);
    const prev = get(data[i - 1], key);
    const parts: string[] = [];
    if (show === 'conversion' || show === 'both') {
      parts.push(defaultMessages.chartOfFirst(percent(v, get(data[0], key)), first));
      if (i > 0) parts.push(defaultMessages.chartOfPrevious(percent(v, prev)));
    }
    if ((show === 'drop-off' || show === 'both') && i > 0) parts.push(defaultMessages.chartDropOff(valueFormat(Math.max(0, prev - v))));
    return parts.join(' · ');
  };
  const steps = data.map((d, i) => {
    const bar = (s: FunnelSeries, j: number, cls: string) => {
      const pct = Math.max(0, get(d, s.key)) / top;
      return (
        <svg key={s.key} viewBox="0 0 100 10" preserveAspectRatio="none" className={cls}>
          <rect x={(100 - pct * 100) / 2} y="0" width={pct * 100} height="10" rx="1.5" data-pt={pt(ix, i)} className={FILL[ci(s.color ?? ((j + 1) as ChartColor))]} />
        </svg>
      );
    };
    // Before 11.3 (one series, no `show`): exactly the old row.
    if (!many && !show) {
      return (
        <div key={d.label} aria-hidden="true" className="grid grid-cols-[8rem_1fr_4rem] items-center gap-3 text-body-sm">
          <span className="truncate text-[var(--color-on-surface-variant)]">{d.label}</span>
          {bar(list[0]!, 0, 'h-7 w-full')}
          <span className="text-end tabular-nums text-[var(--color-on-surface)]">{valueFormat(d.value)}</span>
        </div>
      );
    }
    return (
      <div key={d.label} aria-hidden="true" className="grid grid-cols-[8rem_1fr_4rem] items-center gap-x-3 gap-y-1 text-body-sm">
        <span className="truncate text-on-surface-variant">{d.label}</span>
        {many ? <div className="flex flex-col gap-0.5">{list.map((s, j) => bar(s, j, 'h-3 w-full'))}</div> : bar(list[0]!, 0, 'h-7 w-full')}
        <span className={cn('flex flex-col text-end tabular-nums text-on-surface', many && 'text-label-sm')}>
          {list.map((s) => <span key={s.key}>{valueFormat(get(d, s.key))}</span>)}
        </span>
        {show && (
          <span data-funnel-meta="" className="col-span-2 col-start-2 flex flex-col text-label-sm text-on-surface-variant">
            {/* A no-break space keeps every row the same height (the interactive layer splits the box evenly). */}
            {list.map((s) => <span key={s.key}>{many ? `${nameOf(s)}: ${meta(i, s.key) || '—'}` : meta(i, s.key) || ' '}</span>)}
          </span>
        )}
      </div>
    );
  });
  return (
    <figure aria-label={title} className={cn('m-0 flex flex-col gap-2', className)} {...props}>
      {many && (
        <div aria-hidden="true" data-chart-legend="" className="flex flex-wrap gap-x-4 gap-y-1 text-label-sm text-on-surface-variant">
          {list.map((s, j) => (
            <span key={s.key} className="inline-flex items-center gap-1.5">
              <svg viewBox="0 0 10 10" className="size-2.5"><rect width="10" height="10" rx="2" className={FILL[ci(s.color ?? ((j + 1) as ChartColor))]} /></svg>
              {nameOf(s)}
            </span>
          ))}
        </div>
      )}
      {ix?.overlay != null ? <div className="relative flex flex-col gap-2">{steps}{ix.overlay}</div> : steps}
      {!many && !show ? (
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
      ) : (
        // A wrapper takes the sr-only box: a table ignores the 1px width, and the long
        // conversion text would make the page scroll sideways at 400% zoom.
        <div className="sr-only">
        <table>
          <caption>{title}</caption>
          <thead>
            <tr>
              <th scope="col">{defaultMessages.chartLabel}</th>
              {list.map((s) => <th key={s.key} scope="col">{nameOf(s)}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr key={d.label}>
                <th scope="row">{d.label}</th>
                {list.map((s) => (
                  <td key={s.key}>{[valueFormat(get(d, s.key)), meta(i, s.key) || defaultMessages.chartOfFirst(percent(get(d, s.key), get(data[0], s.key)), first)].join(', ')}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
      {tableView && (
        <ChartTableView
          caption={title}
          label={typeof tableView === 'string' ? tableView : undefined}
          columns={[defaultMessages.chartLabel, ...list.map(nameOf)]}
          rows={data.map((d, i) => [d.label, ...list.map((s) => [valueFormat(get(d, s.key)), meta(i, s.key)].filter(Boolean).join(' · '))])}
        />
      )}
    </figure>
  );
}

/* ── KpiTile ───────────────────────────────────────────────────────────────── */

export interface KpiTileProps extends React.HTMLAttributes<HTMLDivElement>, DataStateProps {
  /** Shown in place of the value when `value` is null or undefined. No default. */
  emptyState?: React.ReactNode;
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
export function KpiTile({ label, value, change, invert = false, trend, className, loading, emptyState, errorState, ...props }: KpiTileProps) {
  const states = { loading, emptyState, errorState };
  // The label stays; a skeleton one value-line tall stands in for the number.
  const state = dataState(
    states,
    value == null,
    <span className="flex h-[1lh] items-center text-headline-sm"><Skeleton className="w-20" /></span>,
    null,
  );
  const good = change === undefined ? undefined : invert ? change < 0 : change > 0;
  const pct = change === undefined ? '' : `${change > 0 ? '+' : change < 0 ? '−' : ''}${Math.abs(change * 100).toFixed(1)}%`;
  return (
    <div aria-busy={dataBusy(states)} className={cn('flex items-end justify-between gap-4 rounded-shape-container border border-[var(--color-outline-variant)] bg-[var(--color-surface-elevated)] p-4', className)} {...props}>
      <div className="flex min-w-0 flex-col gap-1">
        <span className="text-label-md text-[var(--color-on-surface-variant)]">{label}</span>
        {state ?? <span className="text-headline-sm tabular-nums text-[var(--color-on-surface)]">{value}</span>}
        {state == null && change !== undefined && (
          <span className={cn('text-label-md tabular-nums', good ? 'text-[var(--color-success)]' : change === 0 ? 'text-[var(--color-on-surface-variant)]' : 'text-[var(--color-error)]')}>
            {pct} <span className="sr-only">versus last period</span>
          </span>
        )}
      </div>
      {state == null && trend && trend.length > 1 && <Sparkline values={trend} area color={1} className="h-10 w-28 shrink-0" />}
    </div>
  );
}
