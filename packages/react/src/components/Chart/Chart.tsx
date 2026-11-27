// Charts kit (3.2, interactive in 4.1): small, dependency-free SVG charts on
// the --color-chart-* palette. Server components (no hooks), so they render in
// RSC and ship no JS. Geometry is SVG attributes only (no style attributes), so
// server HTML stays valid under a strict CSP. Every chart carries a visually
// hidden data table for screen readers; the drawing is decorative.
//
// 4.1: negative values (a zero line, bars grow up or down from it), a hover
// tooltip per category built from a CSS grid over the plot (no JS), and a
// draw-in on first paint (.nx-chart-bar / .nx-chart-line in @nexub/themes,
// off under reduced motion).
//
// 10.7: `interactive`, `onPointClick` and `legend="toggle"` are opt-in and hand
// the chart to the client layer in ChartInteraction.tsx, which draws it through
// the same *View functions below. Without them nothing here changes: same
// markup, no client code run.
import * as React from 'react';
import { defaultMessages } from '@nexub/core';
import { cn } from '../../utils/cn.js';
import { dataBusy, dataState, type DataStateProps } from '../../utils/dataState.js';
import { Skeleton } from '../Skeleton/Skeleton.js';
import { InteractiveCartesian, InteractiveDonut, InteractiveSparkline } from './ChartInteraction.js';
import { ChartTableView } from './ChartTable.js';
import { chartStory, referenceValues, type ChartStoryProps } from './ChartStory.js';

/** A colour from the categorical chart palette, 1–8. */
export type ChartColor = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
/**
 * 11.3: a semantic tone beside the categorical palette, for values that are good or bad
 * (on target, over budget). `neutral` is the muted outline colour (totals, "other").
 */
export type ChartTone = 'good' | 'warning' | 'danger' | 'neutral';
/** A palette colour or a semantic tone. */
export type ChartPaint = ChartColor | ChartTone;

// Static class lists so Tailwind can see every class at build time.
const FILL = ['fill-chart-1', 'fill-chart-2', 'fill-chart-3', 'fill-chart-4', 'fill-chart-5', 'fill-chart-6', 'fill-chart-7', 'fill-chart-8'];
const STROKE = ['stroke-chart-1', 'stroke-chart-2', 'stroke-chart-3', 'stroke-chart-4', 'stroke-chart-5', 'stroke-chart-6', 'stroke-chart-7', 'stroke-chart-8'];
const BG = ['bg-chart-1', 'bg-chart-2', 'bg-chart-3', 'bg-chart-4', 'bg-chart-5', 'bg-chart-6', 'bg-chart-7', 'bg-chart-8'];

const TONE_FILL: Record<ChartTone, string> = { good: 'fill-success', warning: 'fill-warning', danger: 'fill-error', neutral: 'fill-outline' };
const TONE_STROKE: Record<ChartTone, string> = { good: 'stroke-success', warning: 'stroke-warning', danger: 'stroke-error', neutral: 'stroke-outline' };
const TONE_BG: Record<ChartTone, string> = { good: 'bg-success', warning: 'bg-warning', danger: 'bg-error', neutral: 'bg-outline' };

const isTone = (color: ChartPaint | undefined): color is ChartTone => typeof color === 'string';
const colorIndex = (color: ChartPaint | undefined, i: number) => (isTone(color) ? 0 : ((color ?? (i % 8) + 1) - 1) % 8);
const fillOf = (color: ChartPaint | undefined, i: number) => (isTone(color) ? TONE_FILL[color] : FILL[colorIndex(color, i)]!);
const strokeOf = (color: ChartPaint | undefined, i: number) => (isTone(color) ? TONE_STROKE[color] : STROKE[colorIndex(color, i)]!);
/** Internal: the swatch class of a series colour. */
export const chartBg = (color: ChartPaint | undefined, i: number) => (isTone(color) ? TONE_BG[color] : BG[colorIndex(color, i)]!);

export interface ChartSeries {
  /** Key of the value in each data row. */
  key: string;
  /** Name shown in the legend, the tooltip and the data table. Defaults to `key`. */
  label?: string;
  /** Palette colour, 1–8, or (11.3) a tone: `good`, `warning`, `danger`, `neutral`. Defaults to the series' position. */
  color?: ChartPaint;
  /**
   * 11.3: formats this series' values in the tooltip and the table (one formatter per series,
   * e.g. a currency each). The axis keeps the chart's `valueFormat`.
   */
  valueFormat?: (value: number) => string;
}

/** Rounds up to 1, 2, 2.5 or 5 × 10ⁿ so the four gridlines get round labels. */
export function niceMax(max: number): number {
  if (!(max > 0)) return 1;
  const pow = 10 ** Math.floor(Math.log10(max));
  const step = [1, 2, 2.5, 5, 10].find((s) => s * pow >= max)!;
  return step * pow;
}

/** The axis range for a set of values: [0, nice max], or [−nice, +nice] when some are negative. */
export function niceDomain(values: number[], integer = false): [number, number] {
  const lo = Math.min(0, ...values);
  const hi = Math.max(0, ...values);
  // 11.3 `integerTicks`: the four gridlines fall on whole numbers (counts of people, orders).
  const nice = (v: number) => {
    const n = niceMax(v);
    return integer && !Number.isInteger(n / 4) ? Math.max(4, Math.ceil(n / 4) * 4) : n;
  };
  if (lo === 0) return [0, nice(hi)];
  if (hi === 0) return [-nice(-lo), 0];
  return [-nice(-lo), nice(hi)];
}

/** The point handed to `onPointClick` (10.7). `series` and `value` are set when the click names one series. */
export interface ChartPoint<T> {
  index: number;
  datum: T;
  series?: ChartSeries;
  value?: number;
}

/** The opt-in pointer and keyboard layer (10.7). Either prop makes the chart a client component. */
export interface ChartInteractiveProps<P> {
  /** A crosshair and tooltip that follow the pointer, and arrow-key navigation between points. */
  interactive?: boolean;
  /** Click, tap, or Enter/Space on a point. Turns `interactive` on unless it is set to false. */
  onPointClick?: (point: P) => void;
}

/** Internal: what the client layer hands a chart's drawing. */
export interface ChartIx {
  /** The point under the pointer or the keyboard; `s` names one series (or marks keyboard focus). */
  active: { i: number; s?: number } | null;
  /** Replaces the CSS-only hover overlay. */
  overlay?: React.ReactNode;
  /** Replaces the legend. */
  legend?: React.ReactNode;
}

/** Internal: data-pt of a mark: '' at rest, 'on' / 'focus' when active, 'off' while another is. */
export const pt = (ix: ChartIx | undefined, i: number, s = 0) =>
  !ix?.overlay ? undefined : !ix.active ? '' : ix.active.i !== i ? 'off' : ix.active.s === s ? 'focus' : 'on';

const wantsLayer = (p: ChartInteractiveProps<never>) => Boolean(p.interactive ?? p.onPointClick);

/** The equal band a pointer is over: `x` within `width`, split in `count` bands, mirrored in RTL. */
export function nearestIndex(x: number, width: number, count: number, rtl = false): number {
  if (!(width > 0) || count < 1) return 0;
  const i = Math.min(count - 1, Math.max(0, Math.floor((x / width) * count)));
  return rtl ? count - 1 - i : i;
}

/** The donut segment under a point (fractions of the donut's box, x mirrored in RTL), or -1 off the ring. */
export function segmentAt(fx: number, fy: number, values: number[]): number {
  const r = Math.hypot(fx - 0.5, fy - 0.5);
  const total = values.reduce((sum, v) => sum + Math.max(0, v), 0);
  if (r < 0.3 || r > 0.46 || !total) return -1;
  // Turns clockwise from 12 o'clock, where the first segment starts.
  let turn = (Math.atan2(fx - 0.5, 0.5 - fy) / (2 * Math.PI) + 1) % 1;
  for (let i = 0; i < values.length; i++) {
    const share = Math.max(0, values[i]!) / total;
    if (turn < share) return i;
    turn -= share;
  }
  return values.length - 1;
}

const defaultFormat = (n: number) => n.toLocaleString();
const PLOT_HEIGHT = { sm: 'h-32', md: 'h-48', lg: 'h-64' } as const;
const VB_W = 300;
const VB_H = 100;
const PLOT_MIN = { sm: 'min-h-32', md: 'min-h-48', lg: 'min-h-64' } as const;

/**
 * The box a data state (10.5) takes in place of a plot, or null to draw the
 * chart. `box` gives it at least the plot's size, so the page does not jump
 * when the data arrives. Charts have no hooks, so the default empty text is the
 * English default; pass `emptyState` to translate it.
 */
export function chartState(
  props: DataStateProps,
  empty: boolean,
  box: string,
  skeleton: React.ReactNode = <Skeleton shape="rect" className="flex-1" />,
) {
  const state = dataState(props, empty, skeleton, defaultMessages.emptyStates.noData.title);
  return state == null ? null : (
    <div data-chart-state="" className={cn('flex flex-col', box)}>
      {state}
    </div>
  );
}

export interface ChartLegendProps extends React.HTMLAttributes<HTMLUListElement> {
  items: { label: string; color?: ChartPaint }[];
}

/** A row of colour dots and labels. Charts render one for you when `legend` is on. */
export function ChartLegend({ items, className, ...props }: ChartLegendProps) {
  return (
    <ul className={cn('flex flex-wrap gap-x-4 gap-y-1 text-label-md text-[var(--color-on-surface-variant)]', className)} {...props}>
      {items.map((item, i) => (
        <li key={item.label} className="flex items-center gap-1.5">
          <span aria-hidden="true" className={cn('size-2.5 shrink-0 rounded-full', chartBg(item.color, i))} />
          {item.label}
        </li>
      ))}
    </ul>
  );
}

interface CartesianProps<T> extends Omit<React.HTMLAttributes<HTMLElement>, 'title'>, DataStateProps, ChartInteractiveProps<ChartPoint<T>>, ChartStoryProps {
  /** One row per category, in order. */
  data: T[];
  /** Key of the category label in each row (the x axis). */
  index: keyof T & string;
  /** The values to plot, one entry per series. */
  series: ChartSeries[];
  /** Accessible name of the chart, e.g. "Revenue by month". */
  title: string;
  /** Formats axis labels, the tooltip and the data table. */
  valueFormat?: (value: number) => string;
  /** Height of the plot area. */
  size?: keyof typeof PLOT_HEIGHT;
  /**
   * Show the legend above the chart. Defaults to on for more than one series.
   * `'toggle'` (10.7) makes its entries buttons that hide and show a series; one always stays on.
   */
  legend?: boolean | 'toggle';
  /** Keys of the hidden series, controlled (10.7). */
  hiddenSeries?: string[];
  /** Keys of the series hidden at first. */
  defaultHiddenSeries?: string[];
  onHiddenSeriesChange?: (hidden: string[]) => void;
  /** 11.3: gridlines and axis labels on whole numbers only (counts). */
  integerTicks?: boolean;
  /**
   * 11.3: a visible "Show as table" under the chart that lists the same data as a table. A
   * native disclosure, so it works without JS. Pass a string to label it.
   */
  tableView?: boolean | string;
}

/** Internal: a value as a number, 0 when missing (for the axis range and stacking). */
export const valueOf = <T,>(row: T, key: string) => Number(row[key as keyof T]) || 0;

/**
 * Internal (11.3): a value, or null when it is missing (`null`, `undefined`, empty or not a
 * number). Missing values are drawn as a gap, not as 0, and listed as "—".
 */
export const rawValueOf = <T,>(row: T, key: string): number | null => {
  const v = row[key as keyof T] as unknown;
  if (v == null || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

/** Internal (11.3): a series' value as text: its own formatter, "—" when missing. */
export const formatSeriesValue = <T,>(row: T, s: ChartSeries, fallback: (v: number) => string) => {
  const v = rawValueOf(row, s.key);
  return v == null ? defaultMessages.noValue : (s.valueFormat ?? fallback)(v);
};

const wantsClient = (p: ChartInteractiveProps<never> & { legend?: unknown; hiddenSeries?: unknown; defaultHiddenSeries?: unknown }) =>
  wantsLayer(p) || p.legend === 'toggle' || p.hiddenSeries != null || p.defaultHiddenSeries != null;

function Frame<T>({
  data, index, series, title, valueFormat = defaultFormat, size = 'md', legend, domain, className, children,
  loading, emptyState, errorState, ix, tableView,
  interactive: _interactive, onPointClick: _onPointClick, hiddenSeries: _hidden, defaultHiddenSeries: _defaultHidden, onHiddenSeriesChange: _onHidden,
  integerTicks: _integer, annotations, referenceLines, change,
  ...props
}: CartesianProps<T> & { domain: [number, number]; children: React.ReactNode; ix?: ChartIx }) {
  const labels = series.map((s) => s.label ?? s.key);
  // 12.3: annotations, reference lines and the change callout, each also given as text.
  const storyId = React.useId();
  const states = { loading, emptyState, errorState };
  const state = chartState(states, data.length === 0, cn('flex-1', PLOT_MIN[size]));
  if (state) {
    return (
      <figure aria-label={title} aria-busy={dataBusy(states)} className={cn('m-0 flex flex-col gap-3', className)} {...props}>
        {(legend ?? series.length > 1) && (
          <ChartLegend aria-hidden="true" items={series.map((s, i) => ({ label: labels[i]!, color: s.color }))} />
        )}
        <div className="flex flex-col gap-1">
          {state}
          {/* The category labels' row, kept so the height matches the drawn chart. */}
          <div aria-hidden="true" className="h-[1lh] text-label-sm" />
        </div>
      </figure>
    );
  }
  const [lo, hi] = domain;
  const ticks = [1, 0.75, 0.5, 0.25, 0];
  const zero = VB_H - ((0 - lo) / (hi - lo)) * VB_H;
  // With the client layer the plot holds a focusable group, so the drawing is hidden piece by piece.
  const live = ix?.overlay != null;
  const piece = live ? 'true' : undefined;
  const story = chartStory({ annotations, referenceLines, change }, { data, index, series, valueFormat, domain, w: VB_W, h: VB_H }, storyId);
  return (
    <figure aria-label={title} aria-describedby={story.describedBy} className={cn('m-0 flex flex-col gap-3', className)} {...props}>
      {story.callout}
      {ix?.legend ?? ((legend ?? series.length > 1) && (
        <ChartLegend aria-hidden="true" items={series.map((s, i) => ({ label: labels[i]!, color: s.color }))} />
      ))}
      <div aria-hidden={live ? undefined : 'true'} className="flex gap-2">
        <div aria-hidden={piece} className={cn('flex flex-col justify-between text-end text-label-sm tabular-nums text-[var(--color-on-surface-muted)]', PLOT_HEIGHT[size])}>
          {ticks.map((t) => (
            <span key={t} className="flex h-0 items-center justify-end">{valueFormat(lo + (hi - lo) * t)}</span>
          ))}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className={cn('relative', PLOT_HEIGHT[size])}>
            {/* Mirrored in RTL, like the category labels under it. */}
            <svg aria-hidden={piece} viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="none" className="size-full overflow-visible rtl:-scale-x-100">
              {ticks.map((t) => (
                <line key={t} x1="0" x2={VB_W} y1={VB_H * (1 - t)} y2={VB_H * (1 - t)} strokeWidth="1" vectorEffect="non-scaling-stroke"
                  className="stroke-[var(--color-outline-variant)]" />
              ))}
              <line x1="0" x2={VB_W} y1={zero} y2={zero} strokeWidth="1" vectorEffect="non-scaling-stroke" className="stroke-[var(--color-outline)]" />
              {children}
              {story.plot}
            </svg>
            {story.marks}
            {/* Hover tooltip: one column per category over the plot, CSS only. The client layer (10.7) replaces it. */}
            {live ? ix.overlay : <div className="absolute inset-0 grid auto-cols-fr grid-flow-col">
              {data.map((row, i) => (
                <div key={i} className="group/col relative rounded-shape-tooltip transition-colors hover:bg-[color-mix(in_oklab,var(--color-on-surface)_6%,transparent)]">
                  {/* Crosshair (4.5): a guide through the hovered category. */}
                  <span className="absolute inset-y-0 start-1/2 w-px bg-[var(--color-outline)] opacity-0 transition-opacity group-hover/col:opacity-100" />
                  {/* Anchored to the column's start edge in the first third of the plot, its end edge
                      in the last third and centred between, so it stays inside the chart: centred
                      everywhere, the edge tooltips ran past it and widened the page at 400% zoom (9.4). */}
                  <div
                    className={cn(
                      'pointer-events-none absolute top-1 z-10 min-w-max rounded-shape-tooltip bg-[var(--color-inverse-surface)] px-3 py-2 text-label-md text-[var(--color-inverse-on-surface)] opacity-0 shadow-elevation-2 transition-opacity group-hover/col:opacity-100',
                      i < data.length / 3 ? 'start-0' : i >= (data.length * 2) / 3 ? 'end-0' : 'start-1/2 -translate-x-1/2 rtl:translate-x-1/2',
                    )}
                  >
                    <div className="mb-1 font-semibold">{String(row[index])}</div>
                    {series.map((s, j) => (
                      <div key={s.key} className="flex items-center gap-2 tabular-nums">
                        <span className={cn('size-2 shrink-0 rounded-full', chartBg(s.color, j))} />
                        <span className="flex-1">{labels[j]}</span>
                        <span className="ps-3">{formatSeriesValue(row, s, valueFormat)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>}
          </div>
          <div aria-hidden={piece} className="grid auto-cols-fr grid-flow-col text-center text-label-sm text-[var(--color-on-surface-muted)]">
            {data.map((row, i) => (
              <span key={i} className="truncate px-0.5">{String(row[index])}</span>
            ))}
          </div>
        </div>
      </div>
      <table className="sr-only">
        <caption>{title}</caption>
        <thead>
          <tr>
            <th scope="col">{index}</th>
            {labels.map((l) => <th key={l} scope="col">{l}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <th scope="row">{String(row[index])}</th>
              {series.map((s) => <td key={s.key}>{formatSeriesValue(row, s, valueFormat)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
      {story.summary}
      {tableView && (
        <ChartTableView
          caption={title}
          label={typeof tableView === 'string' ? tableView : undefined}
          columns={[index, ...labels]}
          rows={data.map((row) => [String(row[index]), ...series.map((s) => formatSeriesValue(row, s, valueFormat))])}
        />
      )}
    </figure>
  );
}

export interface BarChartProps<T> extends CartesianProps<T> {
  /** Stack the series in one bar per category instead of side by side. */
  stacked?: boolean;
  /**
   * 11.3: `horizontal` lays the categories down the side and the bars across, for long
   * category names and ranked lists. Drawn without the pointer layer: `interactive` and
   * `onPointClick` apply to vertical bars.
   */
  orientation?: 'vertical' | 'horizontal';
  /**
   * 11.3: `waterfall` draws the first series as steps from a running total: rises in the
   * `good` tone, falls in `danger`, and rows marked by `totalKey` as full bars from zero in the
   * series colour. Vertical only.
   */
  variant?: 'default' | 'waterfall';
  /** 11.3 waterfall: the key of a boolean in each row that marks a total (opening, subtotal, closing). */
  totalKey?: keyof T & string;
  /** 11.3: a colour per bar, e.g. red for the months over budget. Return undefined for the series colour. */
  colorOf?: (row: T, series: ChartSeries, index: number) => ChartPaint | undefined;
}

/** Bars per category, grouped or stacked. Negative values grow down from the zero line. */
export function BarChart<T extends object>(props: BarChartProps<T>) {
  if (props.orientation === 'horizontal') return <HorizontalBars {...props} />;
  return wantsClient(props) ? <InteractiveCartesian kind="bar" {...props} /> : <BarChartView {...props} />;
}

/** Internal: the waterfall steps: [from, to] per row, totals from zero. */
function waterfallSteps<T>(data: T[], key: string, totalKey: string | undefined): [number, number][] {
  let running = 0;
  return data.map((row) => {
    const v = valueOf(row, key);
    if (totalKey && row[totalKey as keyof T]) {
      running = v;
      return [0, v];
    }
    const from = running;
    running += v;
    return [from, running];
  });
}

/** Internal: the drawing. */
export function BarChartView<T extends object>({ stacked = false, variant = 'default', totalKey, colorOf, orientation: _o, ...props }: BarChartProps<T> & { ix?: ChartIx }) {
  const { data, series, ix, integerTicks } = props;
  const waterfall = variant === 'waterfall' && series.length > 0;
  const steps = waterfall ? waterfallSteps(data, series[0]!.key, totalKey) : [];
  const totals = waterfall
    ? steps.flat()
    : data.flatMap((row) => {
        if (!stacked) return series.map((s) => valueOf(row, s.key));
        const vals = series.map((s) => valueOf(row, s.key));
        return [vals.filter((v) => v > 0).reduce((a, b) => a + b, 0), vals.filter((v) => v < 0).reduce((a, b) => a + b, 0)];
      });
  const domain = niceDomain([...totals, ...referenceValues(props.referenceLines)], integerTicks);
  const [lo, hi] = domain;
  const y = (v: number) => VB_H - ((v - lo) / (hi - lo)) * VB_H;
  const slot = VB_W / Math.max(1, data.length);
  const groupW = slot * 0.7;
  const barW = stacked || waterfall ? groupW : groupW / series.length;
  // One vertical gradient per series, in the series colour. It is a flat fill
  // unless an expression layer fades the lower stop (--nx-chart-fade, vivid).
  const gid = React.useId();
  return (
    <Frame {...props} domain={domain}>
      <defs>
        {series.map((s, j) => {
          const c = colorIndex(s.color, j);
          return (
            <linearGradient key={s.key} id={`${gid}${j}`} x1="0" y1="0" x2="0" y2="1" className={`nx-chart-grad nx-chart-grad-${c + 1}`}>
              <stop offset="0" />
              <stop offset="1" />
            </linearGradient>
          );
        })}
      </defs>
      {data.map((row, i) => {
        if (waterfall) {
          const s = series[0]!;
          if (rawValueOf(row, s.key) == null) return <g key={i} />;
          const [from, to] = steps[i]!;
          const total = Boolean(totalKey && row[totalKey as keyof T]);
          const paint = colorOf?.(row, s, i) ?? (total ? s.color : to >= from ? 'good' : 'danger');
          return (
            <g key={i}>
              <rect x={i * slot + (slot - groupW) / 2} y={Math.min(y(from), y(to))} width={groupW} height={Math.abs(y(to) - y(from))}
                data-pt={pt(ix, i, 0)} data-total={total ? '' : undefined}
                className={cn('nx-chart-bar', fillOf(paint, 0))} />
            </g>
          );
        }
        let up = 0;
        let down = 0;
        return (
          <g key={i}>
            {series.map((s, j) => {
              // 11.3: a missing value draws nothing (a gap), not a zero bar.
              if (rawValueOf(row, s.key) == null) return null;
              const v = valueOf(row, s.key);
              const from = stacked ? (v >= 0 ? up : down) : 0;
              const to = from + v;
              if (stacked) {
                if (v >= 0) up = to;
                else down = to;
              }
              const top = Math.min(y(from), y(to));
              const x = i * slot + (slot - groupW) / 2 + (stacked ? 0 : j * barW);
              const paint = colorOf?.(row, s, i) ?? s.color;
              const flat = v <= 0 || stacked || isTone(paint) || paint !== s.color;
              return (
                <rect key={s.key} x={x} y={top} width={Math.max(0, barW - (stacked ? 0 : 1))} height={Math.abs(y(to) - y(from))}
                  data-negative={v < 0 ? '' : undefined}
                  data-pt={pt(ix, i, j)}
                  // Bars above the baseline take the gradient; the class is the fallback and the fill of negative bars.
                  {...(!flat ? { fill: `url(#${gid}${j})` } : {})}
                  className={cn('nx-chart-bar', flat && fillOf(paint, j))} />
              );
            })}
          </g>
        );
      })}
    </Frame>
  );
}

/**
 * Internal (11.3): horizontal bars, one row per category: the label, then the bars across.
 * HTML, not SVG, so long labels wrap and the rows read in order.
 */
function HorizontalBars<T extends object>({
  data, index, series, title, valueFormat = defaultFormat, legend, className, loading, emptyState, errorState, tableView, colorOf, integerTicks,
  stacked: _stacked, variant: _variant, totalKey: _totalKey, orientation: _orientation, size: _size,
  annotations: _annotations, referenceLines: _referenceLines, change: _change,
  interactive: _interactive, onPointClick: _onPointClick, hiddenSeries: _hidden, defaultHiddenSeries: _defaultHidden, onHiddenSeriesChange: _onHidden,
  ...props
}: BarChartProps<T>) {
  const labels = series.map((s) => s.label ?? s.key);
  const states = { loading, emptyState, errorState };
  const state = chartState(states, data.length === 0, 'min-h-32 flex-1');
  const showLegend = legend ?? series.length > 1;
  const [lo, hi] = niceDomain(data.flatMap((row) => series.map((s) => valueOf(row, s.key))), integerTicks);
  const at = (v: number) => ((v - lo) / (hi - lo)) * 100;
  return (
    <figure aria-label={title} aria-busy={state ? dataBusy(states) : undefined} data-orientation="horizontal" className={cn('m-0 flex flex-col gap-3', className)} {...props}>
      {showLegend && <ChartLegend aria-hidden="true" items={series.map((s, i) => ({ label: labels[i]!, color: s.color }))} />}
      {state ?? (
        <div aria-hidden="true" className="grid grid-cols-[minmax(0,auto)_minmax(0,1fr)] items-center gap-x-3 gap-y-2 text-label-sm">
          {data.map((row, i) => (
            <React.Fragment key={i}>
              <span className="text-end text-on-surface-variant">{String(row[index])}</span>
              <div className="flex flex-col gap-0.5">
                {series.map((s, j) => {
                  const v = rawValueOf(row, s.key);
                  const zero = at(0);
                  const end = v == null ? zero : at(v);
                  return (
                    <div key={s.key} className="flex items-center gap-2">
                      <div className="relative h-3 flex-1">
                        {v != null && (
                          <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="absolute inset-0 size-full rtl:-scale-x-100">
                            <rect x={Math.min(zero, end)} y="0" width={Math.abs(end - zero)} height="10" className={cn('nx-chart-bar', fillOf(colorOf?.(row, s, i) ?? s.color, j))} />
                          </svg>
                        )}
                      </div>
                      <span className="w-16 shrink-0 tabular-nums text-on-surface">{formatSeriesValue(row, s, valueFormat)}</span>
                    </div>
                  );
                })}
              </div>
            </React.Fragment>
          ))}
        </div>
      )}
      {!state && (
        <table className="sr-only">
          <caption>{title}</caption>
          <thead>
            <tr>
              <th scope="col">{index}</th>
              {labels.map((l) => <th key={l} scope="col">{l}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                <th scope="row">{String(row[index])}</th>
                {series.map((s) => <td key={s.key}>{formatSeriesValue(row, s, valueFormat)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {!state && tableView && (
        <ChartTableView
          caption={title}
          label={typeof tableView === 'string' ? tableView : undefined}
          columns={[index, ...labels]}
          rows={data.map((row) => [String(row[index]), ...series.map((s) => formatSeriesValue(row, s, valueFormat))])}
        />
      )}
    </figure>
  );
}

export interface LineChartProps<T> extends CartesianProps<T> {
  /** Fill the area under each line (down to the zero line). */
  area?: boolean;
}

/** One line per series across the categories. Negative values go below the zero line. */
export function LineChart<T extends object>(props: LineChartProps<T>) {
  return wantsClient(props) ? <InteractiveCartesian kind="line" {...props} /> : <LineChartView {...props} />;
}

/** Internal (11.3): runs of consecutive present values, so a missing value breaks the line. */
function runs<T>(data: T[], key: string): number[][] {
  const out: number[][] = [];
  let cur: number[] = [];
  data.forEach((row, i) => {
    if (rawValueOf(row, key) == null) {
      if (cur.length) out.push(cur);
      cur = [];
    } else cur.push(i);
  });
  if (cur.length) out.push(cur);
  return out;
}

/** Internal: the drawing. */
export function LineChartView<T extends object>({ area = false, ...props }: LineChartProps<T> & { ix?: ChartIx }) {
  const { data, series, integerTicks } = props;
  const domain = niceDomain([...data.flatMap((row) => series.map((s) => valueOf(row, s.key))), ...referenceValues(props.referenceLines)], integerTicks);
  const [lo, hi] = domain;
  const slot = VB_W / Math.max(1, data.length);
  const x = (i: number) => i * slot + slot / 2;
  const y = (v: number) => VB_H - ((v - lo) / (hi - lo)) * VB_H;
  return (
    <Frame {...props} domain={domain}>
      {series.map((s, j) => (
        <g key={s.key} className="nx-chart-line">
          {/* 11.3: a missing value is a gap; a lone point between gaps is a dot. */}
          {runs(data, s.key).map((run) => {
            const pts = run.map((i) => `${x(i)},${y(valueOf(data[i]!, s.key))}`);
            const first = run[0]!;
            const last = run[run.length - 1]!;
            return (
              <React.Fragment key={first}>
                {area && run.length > 1 && (
                  <polygon points={`${x(first)},${y(0)} ${pts.join(' ')} ${x(last)},${y(0)}`} className={cn(fillOf(s.color, j), 'opacity-15')} />
                )}
                {run.length === 1 ? (
                  <circle cx={x(first)} cy={y(valueOf(data[first]!, s.key))} r="1.5" className={fillOf(s.color, j)} />
                ) : (
                  <polyline points={pts.join(' ')} fill="none" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" className={strokeOf(s.color, j)} />
                )}
              </React.Fragment>
            );
          })}
        </g>
      ))}
    </Frame>
  );
}

export interface DonutDatum {
  label: string;
  value: number;
  color?: ChartPaint;
  /** 11.3: makes the slice's legend row a link, e.g. to the list filtered to that slice. */
  href?: string;
}

export interface DonutChartProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'>, DataStateProps, ChartInteractiveProps<ChartPoint<DonutDatum>> {
  data: DonutDatum[];
  /** Accessible name of the chart. */
  title: string;
  /** Content in the hole, such as the total. */
  center?: React.ReactNode;
  valueFormat?: (value: number) => string;
  /** Show the legend beside the donut. Default on. */
  legend?: boolean;
  /** 11.3: each legend row also lists its value and share. */
  legendValues?: boolean;
  /**
   * 11.3: at most this many slices: the smallest of the rest are added up into one "Other" slice
   * (in the `neutral` tone), so a long tail stays readable.
   */
  maxSlices?: number;
  /** 11.3: the label of the grouped slice. @default 'Other' */
  otherLabel?: string;
  /** 11.3: diameter: `sm` 8rem, `md` 10rem, `lg` 14rem. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** 11.3: a visible "Show as table" under the chart. Pass a string to label it. */
  tableView?: boolean | string;
}

const DONUT_SIZE = { sm: 'size-32', md: 'size-40', lg: 'size-56' } as const;

/** Internal (11.3): the largest `max - 1` slices and one "Other" for the rest. */
export function groupDonut(data: DonutDatum[], max: number | undefined, otherLabel: string): DonutDatum[] {
  if (!max || max < 2 || data.length <= max) return data;
  const ranked = data.map((d, i) => ({ d, i })).sort((a, b) => b.d.value - a.d.value);
  const keep = new Set(ranked.slice(0, max - 1).map((r) => r.i));
  const rest = data.filter((_, i) => !keep.has(i)).reduce((sum, d) => sum + Math.max(0, d.value), 0);
  return [...data.filter((_, i) => keep.has(i)), { label: otherLabel, value: rest, color: 'neutral' }];
}

/** Parts of a whole. Keep it to six slices or fewer, or let `maxSlices` group the rest as "Other". */
export function DonutChart(props: DonutChartProps) {
  const data = groupDonut(props.data, props.maxSlices, props.otherLabel ?? defaultMessages.other);
  return wantsLayer(props) ? <InteractiveDonut {...props} data={data} /> : <DonutChartView {...props} data={data} />;
}

/** Internal: the drawing. */
export function DonutChartView({
  data, title, center, valueFormat = defaultFormat, legend = true, legendValues = false, size = 'md', tableView, className, loading, emptyState, errorState, ix,
  interactive: _interactive, onPointClick: _onPointClick, maxSlices: _max, otherLabel: _other, ...props
}: DonutChartProps & { ix?: ChartIx }) {
  const states = { loading, emptyState, errorState };
  const state = chartState(states, data.length === 0, cn('min-w-40 flex-1', size === 'lg' ? 'min-h-56' : size === 'sm' ? 'min-h-32' : 'min-h-40'), <Skeleton shape="circle" className={DONUT_SIZE[size]} />);
  if (state) {
    return (
      <figure aria-label={title} aria-busy={dataBusy(states)} className={cn('m-0 flex flex-wrap items-center gap-6', className)} {...props}>
        {state}
      </figure>
    );
  }
  const total = data.reduce((sum, d) => sum + Math.max(0, d.value), 0) || 1;
  const share = (v: number) => Math.round((Math.max(0, v) / total) * 100);
  // r = 100 / 2π, so the circumference is 100 and dash lengths are percentages.
  const r = 15.9155;
  let offset = 25; // start at 12 o'clock
  const live = ix?.overlay != null;
  const piece = live ? 'true' : undefined;
  const links = data.some((d) => d.href);
  const rich = legendValues || links;
  return (
    <figure aria-label={title} className={cn('m-0 flex flex-wrap items-center gap-6', className)} {...props}>
      <div aria-hidden={live ? undefined : 'true'} className={cn('relative shrink-0', DONUT_SIZE[size])}>
        <svg aria-hidden={piece} viewBox="0 0 42 42" className="size-full rtl:-scale-x-100">
          <circle cx="21" cy="21" r={r} fill="none" strokeWidth="6" className="stroke-[var(--color-surface-container-high)]" />
          {data.map((d, i) => {
            const pct = (Math.max(0, d.value) / total) * 100;
            const dash = `${pct} ${100 - pct}`;
            const el = (
              <circle key={d.label} cx="21" cy="21" r={r} fill="none" strokeWidth="6" strokeDasharray={dash} strokeDashoffset={offset} data-pt={pt(ix, i)} className={strokeOf(d.color, i)}>
                <title>{`${d.label}: ${valueFormat(d.value)} (${Math.round(pct)}%)`}</title>
              </circle>
            );
            offset -= pct;
            return el;
          })}
        </svg>
        {center != null && <div aria-hidden={piece} className="absolute inset-0 flex items-center justify-center text-center text-title-md text-[var(--color-on-surface)]">{center}</div>}
        {ix?.overlay}
      </div>
      {legend && !rich && <ChartLegend aria-hidden="true" className="flex-col" items={data.map((d) => ({ label: d.label, color: d.color }))} />}
      {legend && rich && (
        // 11.3 (from #673): value and share per row; a slice's `href` makes its row a link.
        <ul aria-hidden={links ? undefined : true} aria-label={links ? title : undefined} className="flex min-w-48 flex-col divide-y divide-outline-variant text-label-md text-on-surface-variant">
          {data.map((d, i) => {
            const row = (
              <>
                <span aria-hidden="true" className={cn('size-2.5 shrink-0 rounded-full', chartBg(d.color, i))} />
                <span className="min-w-0 flex-1 truncate">{d.label}</span>
                {legendValues && <span className="tabular-nums text-on-surface">{valueFormat(d.value)}</span>}
                {legendValues && <span className="w-10 text-end tabular-nums text-on-surface-muted">{share(d.value)}%</span>}
              </>
            );
            const rowClass = 'flex items-center gap-2 rounded-shape-control px-1 py-1.5';
            return (
              <li key={d.label}>
                {d.href ? (
                  <a href={d.href} className={cn(rowClass, 'nx-state-layer hover:text-on-surface')}>
                    {row}
                    {/* The name is the visible text; without legendValues the value and share are added for screen readers. */}
                    {!legendValues && <span className="sr-only">{`: ${valueFormat(d.value)} (${share(d.value)}%)`}</span>}
                  </a>
                ) : (
                  <div className={rowClass}>{row}</div>
                )}
              </li>
            );
          })}
        </ul>
      )}
      <table className="sr-only">
        <caption>{title}</caption>
        <tbody>
          {data.map((d) => (
            <tr key={d.label}>
              <th scope="row">{d.label}</th>
              <td>{valueFormat(d.value)}</td>
              <td>{share(d.value)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
      {tableView && (
        <ChartTableView
          className="basis-full"
          caption={title}
          label={typeof tableView === 'string' ? tableView : undefined}
          columns={[defaultMessages.chartLabel, defaultMessages.chartValue, defaultMessages.chartShare]}
          rows={data.map((d) => [d.label, valueFormat(d.value), `${share(d.value)}%`])}
        />
      )}
    </figure>
  );
}

export interface SparklineProps extends Omit<React.SVGAttributes<SVGSVGElement>, 'values' | 'color'>, DataStateProps, ChartInteractiveProps<ChartPoint<number>> {
  /** Shown when `values` is empty. No default: an empty sparkline stays an empty box. */
  emptyState?: React.ReactNode;
  values: number[];
  /** Accessible summary, e.g. "Revenue, last 12 weeks, up 8%". Without it the sparkline is decorative. */
  label?: string;
  /** Palette colour or (11.3) a tone. */
  color?: ChartPaint;
  /** Fill the area under the line. */
  area?: boolean;
}

/** A tiny trend line with no axes, for stat cards and table cells. Fills its box (default 6rem × 2rem). */
export function Sparkline(props: SparklineProps) {
  return wantsLayer(props) ? <InteractiveSparkline {...props} /> : <SparklineView {...props} />;
}

/** Internal: the drawing. */
export function SparklineView({
  values, label, color = 1, area = false, className, loading, emptyState, errorState, ix,
  interactive: _interactive, onPointClick: _onPointClick, ...props
}: SparklineProps & { ix?: ChartIx }) {
  const state = dataState(
    { loading, emptyState, errorState },
    values.length === 0,
    <Skeleton shape="rect" className={cn('inline-block h-8 w-24 rounded-shape-min', className)} />,
    null,
  );
  if (state != null) return <>{state}</>;
  const min = Math.min(...values);
  const span = Math.max(...values) - min || 1;
  const step = values.length > 1 ? VB_W / (values.length - 1) : 0;
  const pts = values.map((v, i) => `${i * step},${VB_H - 4 - ((v - min) / span) * (VB_H - 8)}`).join(' ');
  const line = (
    <g className="nx-chart-line">
      {area && values.length > 1 && <polygon points={`0,${VB_H} ${pts} ${VB_W},${VB_H}`} className={cn(fillOf(color, 0), 'opacity-15')} />}
      <polyline points={pts} fill="none" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" className={strokeOf(color, 0)} />
    </g>
  );
  // With the client layer the box is a span that holds the drawing and the layer; the layer carries the label.
  if (ix?.overlay != null && values.length > 0) {
    return (
      <span className={cn('relative inline-block h-8 w-24', className)}>
        <svg aria-hidden="true" viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="none" className="size-full overflow-visible rtl:-scale-x-100" {...props}>
          {line}
        </svg>
        {ix.overlay}
      </span>
    );
  }
  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="none"
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
      className={cn('h-8 w-24 overflow-visible rtl:-scale-x-100', className)} {...props}>
      {line}
    </svg>
  );
}
