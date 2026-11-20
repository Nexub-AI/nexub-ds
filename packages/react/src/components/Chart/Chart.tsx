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
import * as React from 'react';
import { defaultMessages } from '@nexub/core';
import { cn } from '../../utils/cn.js';
import { dataBusy, dataState, type DataStateProps } from '../../utils/dataState.js';
import { Skeleton } from '../Skeleton/Skeleton.js';

/** A colour from the categorical chart palette, 1–8. */
export type ChartColor = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

// Static class lists so Tailwind can see every class at build time.
const FILL = ['fill-chart-1', 'fill-chart-2', 'fill-chart-3', 'fill-chart-4', 'fill-chart-5', 'fill-chart-6', 'fill-chart-7', 'fill-chart-8'];
const STROKE = ['stroke-chart-1', 'stroke-chart-2', 'stroke-chart-3', 'stroke-chart-4', 'stroke-chart-5', 'stroke-chart-6', 'stroke-chart-7', 'stroke-chart-8'];
const BG = ['bg-chart-1', 'bg-chart-2', 'bg-chart-3', 'bg-chart-4', 'bg-chart-5', 'bg-chart-6', 'bg-chart-7', 'bg-chart-8'];

const colorIndex = (color: ChartColor | undefined, i: number) => ((color ?? (i % 8) + 1) - 1) % 8;

export interface ChartSeries {
  /** Key of the value in each data row. */
  key: string;
  /** Name shown in the legend, the tooltip and the data table. Defaults to `key`. */
  label?: string;
  /** Palette colour, 1–8. Defaults to the series' position. */
  color?: ChartColor;
}

/** Rounds up to 1, 2, 2.5 or 5 × 10ⁿ so the four gridlines get round labels. */
export function niceMax(max: number): number {
  if (!(max > 0)) return 1;
  const pow = 10 ** Math.floor(Math.log10(max));
  const step = [1, 2, 2.5, 5, 10].find((s) => s * pow >= max)!;
  return step * pow;
}

/** The axis range for a set of values: [0, nice max], or [−nice, +nice] when some are negative. */
export function niceDomain(values: number[]): [number, number] {
  const lo = Math.min(0, ...values);
  const hi = Math.max(0, ...values);
  if (lo === 0) return [0, niceMax(hi)];
  if (hi === 0) return [-niceMax(-lo), 0];
  return [-niceMax(-lo), niceMax(hi)];
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
  items: { label: string; color?: ChartColor }[];
}

/** A row of colour dots and labels. Charts render one for you when `legend` is on. */
export function ChartLegend({ items, className, ...props }: ChartLegendProps) {
  return (
    <ul className={cn('flex flex-wrap gap-x-4 gap-y-1 text-label-md text-[var(--color-on-surface-variant)]', className)} {...props}>
      {items.map((item, i) => (
        <li key={item.label} className="flex items-center gap-1.5">
          <span aria-hidden="true" className={cn('size-2.5 shrink-0 rounded-full', BG[colorIndex(item.color, i)])} />
          {item.label}
        </li>
      ))}
    </ul>
  );
}

interface CartesianProps<T> extends Omit<React.HTMLAttributes<HTMLElement>, 'title'>, DataStateProps {
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
  /** Show the legend above the chart. Defaults to on for more than one series. */
  legend?: boolean;
}

const valueOf = <T,>(row: T, key: string) => Number(row[key as keyof T]) || 0;

function Frame<T>({
  data, index, series, title, valueFormat = defaultFormat, size = 'md', legend, domain, className, children,
  loading, emptyState, errorState, ...props
}: CartesianProps<T> & { domain: [number, number]; children: React.ReactNode }) {
  const labels = series.map((s) => s.label ?? s.key);
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
  return (
    <figure aria-label={title} className={cn('m-0 flex flex-col gap-3', className)} {...props}>
      {(legend ?? series.length > 1) && (
        <ChartLegend aria-hidden="true" items={series.map((s, i) => ({ label: labels[i]!, color: s.color }))} />
      )}
      <div aria-hidden="true" className="flex gap-2">
        <div className={cn('flex flex-col justify-between text-end text-label-sm tabular-nums text-[var(--color-on-surface-muted)]', PLOT_HEIGHT[size])}>
          {ticks.map((t) => (
            <span key={t} className="flex h-0 items-center justify-end">{valueFormat(lo + (hi - lo) * t)}</span>
          ))}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className={cn('relative', PLOT_HEIGHT[size])}>
            {/* Mirrored in RTL, like the category labels under it. */}
            <svg viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="none" className="size-full overflow-visible rtl:-scale-x-100">
              {ticks.map((t) => (
                <line key={t} x1="0" x2={VB_W} y1={VB_H * (1 - t)} y2={VB_H * (1 - t)} strokeWidth="1" vectorEffect="non-scaling-stroke"
                  className="stroke-[var(--color-outline-variant)]" />
              ))}
              <line x1="0" x2={VB_W} y1={zero} y2={zero} strokeWidth="1" vectorEffect="non-scaling-stroke" className="stroke-[var(--color-outline)]" />
              {children}
            </svg>
            {/* Hover tooltip: one column per category over the plot, CSS only. */}
            <div className="absolute inset-0 grid auto-cols-fr grid-flow-col">
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
                        <span className={cn('size-2 shrink-0 rounded-full', BG[colorIndex(s.color, j)])} />
                        <span className="flex-1">{labels[j]}</span>
                        <span className="ps-3">{valueFormat(valueOf(row, s.key))}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid auto-cols-fr grid-flow-col text-center text-label-sm text-[var(--color-on-surface-muted)]">
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
              {series.map((s) => <td key={s.key}>{valueFormat(valueOf(row, s.key))}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

export interface BarChartProps<T> extends CartesianProps<T> {
  /** Stack the series in one bar per category instead of side by side. */
  stacked?: boolean;
}

/** Bars per category, grouped or stacked. Negative values grow down from the zero line. */
export function BarChart<T extends object>({ stacked = false, ...props }: BarChartProps<T>) {
  const { data, series } = props;
  const totals = data.flatMap((row) => {
    if (!stacked) return series.map((s) => valueOf(row, s.key));
    const vals = series.map((s) => valueOf(row, s.key));
    return [vals.filter((v) => v > 0).reduce((a, b) => a + b, 0), vals.filter((v) => v < 0).reduce((a, b) => a + b, 0)];
  });
  const domain = niceDomain(totals);
  const [lo, hi] = domain;
  const y = (v: number) => VB_H - ((v - lo) / (hi - lo)) * VB_H;
  const slot = VB_W / Math.max(1, data.length);
  const groupW = slot * 0.7;
  const barW = stacked ? groupW : groupW / series.length;
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
        let up = 0;
        let down = 0;
        return (
          <g key={i}>
            {series.map((s, j) => {
              const v = valueOf(row, s.key);
              const from = stacked ? (v >= 0 ? up : down) : 0;
              const to = from + v;
              if (stacked) {
                if (v >= 0) up = to;
                else down = to;
              }
              const top = Math.min(y(from), y(to));
              const x = i * slot + (slot - groupW) / 2 + (stacked ? 0 : j * barW);
              return (
                <rect key={s.key} x={x} y={top} width={Math.max(0, barW - (stacked ? 0 : 1))} height={Math.abs(y(to) - y(from))}
                  data-negative={v < 0 ? '' : undefined}
                  // Bars above the baseline take the gradient; the class is the fallback and the fill of negative bars.
                  {...(v > 0 && !stacked ? { fill: `url(#${gid}${j})` } : {})}
                  className={cn('nx-chart-bar', (v <= 0 || stacked) && FILL[colorIndex(s.color, j)])} />
              );
            })}
          </g>
        );
      })}
    </Frame>
  );
}

export interface LineChartProps<T> extends CartesianProps<T> {
  /** Fill the area under each line (down to the zero line). */
  area?: boolean;
}

/** One line per series across the categories. Negative values go below the zero line. */
export function LineChart<T extends object>({ area = false, ...props }: LineChartProps<T>) {
  const { data, series } = props;
  const domain = niceDomain(data.flatMap((row) => series.map((s) => valueOf(row, s.key))));
  const [lo, hi] = domain;
  const slot = VB_W / Math.max(1, data.length);
  const x = (i: number) => i * slot + slot / 2;
  const y = (v: number) => VB_H - ((v - lo) / (hi - lo)) * VB_H;
  return (
    <Frame {...props} domain={domain}>
      {series.map((s, j) => {
        const c = colorIndex(s.color, j);
        const pts = data.map((row, i) => `${x(i)},${y(valueOf(row, s.key))}`);
        return (
          <g key={s.key} className="nx-chart-line">
            {area && data.length > 0 && (
              <polygon points={`${x(0)},${y(0)} ${pts.join(' ')} ${x(data.length - 1)},${y(0)}`} className={cn(FILL[c], 'opacity-15')} />
            )}
            <polyline points={pts.join(' ')} fill="none" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" className={STROKE[c]} />
          </g>
        );
      })}
    </Frame>
  );
}

export interface DonutChartProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'>, DataStateProps {
  /** One slice each. `href` makes its legend row a link (for example, a list filtered to that slice). */
  data: { label: string; value: number; color?: ChartColor; href?: string }[];
  /** Accessible name of the chart. */
  title: string;
  /** Content in the hole, such as the total. Replaced by the hovered slice while one is hovered. */
  center?: React.ReactNode;
  valueFormat?: (value: number) => string;
  /** Show the legend beside the donut (below it on narrow screens). Default on. */
  legend?: boolean;
  /** Diameter: `sm` 128px, `md` 160px, `lg` 224px. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
}

const DONUT_SIZE = { sm: 'size-32', md: 'size-40', lg: 'size-56' } as const;

/**
 * Parts of a whole. Keep it to six slices or fewer; group the rest as "Other".
 * Hovering a slice or its legend row highlights it (the others dim) and shows
 * its label, value and share in the hole; the legend lists each value and share.
 */
export function DonutChart({
  data, title, center, valueFormat = defaultFormat, legend = true, size = 'md', className, loading, emptyState, errorState, ...props
}: DonutChartProps) {
  const [active, setActive] = React.useState<number | null>(null);
  const states = { loading, emptyState, errorState };
  const state = chartState(states, data.length === 0, cn('min-w-40 flex-1', size === 'lg' ? 'min-h-56' : 'min-h-40'), <Skeleton shape="circle" className={DONUT_SIZE[size]} />);
  if (state) {
    return (
      <figure aria-label={title} aria-busy={dataBusy(states)} className={cn('m-0 flex flex-wrap items-center justify-center gap-6', className)} {...props}>
        {state}
      </figure>
    );
  }
  const total = data.reduce((sum, d) => sum + Math.max(0, d.value), 0) || 1;
  const share = (v: number) => Math.round((Math.max(0, v) / total) * 100);
  const links = data.some((d) => d.href);
  // r = 100 / 2π, so the circumference is 100 and dash lengths are percentages.
  const r = 15.9155;
  let offset = 25; // start at 12 o'clock
  const hot = active == null ? null : data[active];
  return (
    <figure aria-label={title} className={cn('m-0 flex flex-wrap items-center justify-center gap-x-8 gap-y-4', className)} {...props}>
      <div aria-hidden="true" className={cn('relative shrink-0', DONUT_SIZE[size])} onMouseLeave={() => setActive(null)}>
        <svg viewBox="0 0 42 42" className="size-full rtl:-scale-x-100">
          <circle cx="21" cy="21" r={r} fill="none" strokeWidth="6" className="stroke-[var(--color-surface-container-high)]" />
          {data.map((d, i) => {
            const pct = (Math.max(0, d.value) / total) * 100;
            const el = (
              <circle key={d.label} cx="21" cy="21" r={r} fill="none" strokeWidth={active === i ? 7.5 : 6} strokeDasharray={`${pct} ${100 - pct}`} strokeDashoffset={offset}
                data-slice={i} onMouseEnter={() => setActive(i)}
                className={cn(STROKE[colorIndex(d.color, i)], 'cursor-default transition-[stroke-width,opacity] duration-150', active != null && active !== i && 'opacity-35')}>
                <title>{`${d.label}: ${valueFormat(d.value)} (${Math.round(pct)}%)`}</title>
              </circle>
            );
            offset -= pct;
            return el;
          })}
        </svg>
        {(hot || center != null) && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-title-md text-[var(--color-on-surface)]">
            {hot ? (
              <>
                <span className="tabular-nums">{valueFormat(hot.value)}</span>
                <span className="line-clamp-2 text-label-sm text-[var(--color-on-surface-variant)]">{hot.label} · {share(hot.value)}%</span>
              </>
            ) : center}
          </div>
        )}
      </div>
      {legend && (
        <ul aria-hidden={links ? undefined : true} aria-label={links ? title : undefined} className="flex min-w-48 flex-col divide-y divide-[var(--color-outline-variant)] text-label-md text-[var(--color-on-surface-variant)]">
          {data.map((d, i) => {
            const row = (
              <>
                <span aria-hidden="true" className={cn('size-2.5 shrink-0 rounded-full', BG[colorIndex(d.color, i)])} />
                <span className="min-w-0 flex-1 truncate">{d.label}</span>
                <span className="tabular-nums text-[var(--color-on-surface)]">{valueFormat(d.value)}</span>
                <span className="w-10 text-end tabular-nums text-[var(--color-on-surface-muted)]">{share(d.value)}%</span>
              </>
            );
            const hover = { onMouseEnter: () => setActive(i), onMouseLeave: () => setActive(null), onFocus: () => setActive(i), onBlur: () => setActive(null) };
            const rowClass = cn('flex items-center gap-2 rounded-shape-control px-1 py-1.5 transition-colors', active === i && 'bg-[color-mix(in_oklab,var(--color-on-surface)_6%,transparent)]');
            return (
              <li key={d.label}>
                {d.href ? (
                  <a href={d.href} {...hover} className={cn(rowClass, 'hover:text-[var(--color-on-surface)] focus-visible:outline-2 focus-visible:outline-[var(--color-primary)]')}
                    aria-label={`${d.label}: ${valueFormat(d.value)} (${share(d.value)}%)`}>{row}</a>
                ) : (
                  <div {...hover} className={rowClass}>{row}</div>
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
    </figure>
  );
}

export interface SparklineProps extends Omit<React.SVGAttributes<SVGSVGElement>, 'values' | 'color'>, DataStateProps {
  /** Shown when `values` is empty. No default: an empty sparkline stays an empty box. */
  emptyState?: React.ReactNode;
  values: number[];
  /** Accessible summary, e.g. "Revenue, last 12 weeks, up 8%". Without it the sparkline is decorative. */
  label?: string;
  color?: ChartColor;
  /** Fill the area under the line. */
  area?: boolean;
}

/** A tiny trend line with no axes, for stat cards and table cells. Fills its box (default 6rem × 2rem). */
export function Sparkline({ values, label, color = 1, area = false, className, loading, emptyState, errorState, ...props }: SparklineProps) {
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
  const c = colorIndex(color, 0);
  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="none"
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
      className={cn('h-8 w-24 overflow-visible rtl:-scale-x-100', className)} {...props}>
      <g className="nx-chart-line">
        {area && values.length > 1 && <polygon points={`0,${VB_H} ${pts} ${VB_W},${VB_H}`} className={cn(FILL[c], 'opacity-15')} />}
        <polyline points={pts} fill="none" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" className={STROKE[c]} />
      </g>
    </svg>
  );
}
