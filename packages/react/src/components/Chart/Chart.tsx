// Charts kit (3.2): small, dependency-free SVG charts on the --color-chart-*
// palette. Server components (no hooks), so they render in RSC and ship no JS.
// Geometry is SVG attributes only (no style attributes), so server HTML stays
// valid under a strict CSP. Every chart carries a visually hidden data table
// for screen readers; the SVG itself is decorative.
//
// ponytail: values are assumed >= 0 and hover is the native SVG <title>.
// Add negative domains or an interactive tooltip when a product asks for them.
import * as React from 'react';
import { cn } from '../../utils/cn.js';

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
  /** Name shown in the legend and the data table. Defaults to `key`. */
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

const defaultFormat = (n: number) => n.toLocaleString();
const PLOT_HEIGHT = { sm: 'h-32', md: 'h-48', lg: 'h-64' } as const;
const VB_W = 300;
const VB_H = 100;

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

interface CartesianProps<T> extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** One row per category, in order. */
  data: T[];
  /** Key of the category label in each row (the x axis). */
  index: keyof T & string;
  /** The values to plot, one entry per series. */
  series: ChartSeries[];
  /** Accessible name of the chart, e.g. "Revenue by month". */
  title: string;
  /** Formats axis labels, the hover text and the data table. */
  valueFormat?: (value: number) => string;
  /** Height of the plot area. */
  size?: keyof typeof PLOT_HEIGHT;
  /** Show the legend above the chart. Defaults to on for more than one series. */
  legend?: boolean;
}

function Frame<T>({
  data, index, series, title, valueFormat = defaultFormat, size = 'md', legend, max, className, children, ...props
}: CartesianProps<T> & { max: number; children: React.ReactNode }) {
  const labels = series.map((s) => s.label ?? s.key);
  const ticks = [1, 0.75, 0.5, 0.25, 0];
  return (
    <figure aria-label={title} className={cn('m-0 flex flex-col gap-3', className)} {...props}>
      {(legend ?? series.length > 1) && (
        <ChartLegend aria-hidden="true" items={series.map((s, i) => ({ label: labels[i]!, color: s.color }))} />
      )}
      <div aria-hidden="true" className="flex gap-2">
        <div className={cn('flex flex-col justify-between text-end text-label-sm tabular-nums text-[var(--color-on-surface-muted)]', PLOT_HEIGHT[size])}>
          {ticks.map((t) => (
            <span key={t} className="flex h-0 items-center justify-end">{valueFormat(max * t)}</span>
          ))}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          {/* Mirrored in RTL, like the category labels under it. */}
          <svg viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="none" className={cn('w-full overflow-visible rtl:-scale-x-100', PLOT_HEIGHT[size])}>
            {ticks.map((t) => (
              <line key={t} x1="0" x2={VB_W} y1={VB_H * (1 - t)} y2={VB_H * (1 - t)} strokeWidth="1" vectorEffect="non-scaling-stroke"
                className={t === 0 ? 'stroke-[var(--color-outline)]' : 'stroke-[var(--color-outline-variant)]'} />
            ))}
            {children}
          </svg>
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
              {series.map((s) => <td key={s.key}>{valueFormat(Number(row[s.key as keyof T]) || 0)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

const valueOf = <T,>(row: T, key: string) => Math.max(0, Number(row[key as keyof T]) || 0);

export interface BarChartProps<T> extends CartesianProps<T> {
  /** Stack the series in one bar per category instead of side by side. */
  stacked?: boolean;
}

/** Bars per category, grouped or stacked. Values must be 0 or more. */
export function BarChart<T extends object>({ stacked = false, ...props }: BarChartProps<T>) {
  const { data, series, index, valueFormat = defaultFormat } = props;
  const max = niceMax(Math.max(0, ...data.map((row) =>
    stacked ? series.reduce((sum, s) => sum + valueOf(row, s.key), 0) : Math.max(0, ...series.map((s) => valueOf(row, s.key))))));
  const slot = VB_W / Math.max(1, data.length);
  const groupW = slot * 0.7;
  const barW = stacked ? groupW : groupW / series.length;
  return (
    <Frame {...props} max={max}>
      {data.map((row, i) => {
        let base = 0;
        return (
          <g key={i}>
            {series.map((s, j) => {
              const v = valueOf(row, s.key);
              const h = (v / max) * VB_H;
              const x = i * slot + (slot - groupW) / 2 + (stacked ? 0 : j * barW);
              const y = VB_H - base - h;
              if (stacked) base += h;
              return (
                <rect key={s.key} x={x} y={y} width={Math.max(0, barW - (stacked ? 0 : 1))} height={h} className={FILL[colorIndex(s.color, j)]}>
                  <title>{`${String(row[index])} · ${s.label ?? s.key}: ${valueFormat(v)}`}</title>
                </rect>
              );
            })}
          </g>
        );
      })}
    </Frame>
  );
}

export interface LineChartProps<T> extends CartesianProps<T> {
  /** Fill the area under each line. */
  area?: boolean;
}

/** One line per series across the categories. Values must be 0 or more. */
export function LineChart<T extends object>({ area = false, ...props }: LineChartProps<T>) {
  const { data, series, index, valueFormat = defaultFormat } = props;
  const max = niceMax(Math.max(0, ...data.flatMap((row) => series.map((s) => valueOf(row, s.key)))));
  const slot = VB_W / Math.max(1, data.length);
  const x = (i: number) => i * slot + slot / 2;
  const y = (v: number) => VB_H - (v / max) * VB_H;
  return (
    <Frame {...props} max={max}>
      {series.map((s, j) => {
        const c = colorIndex(s.color, j);
        const pts = data.map((row, i) => `${x(i)},${y(valueOf(row, s.key))}`);
        return (
          <g key={s.key}>
            {area && data.length > 0 && (
              <polygon points={`${x(0)},${VB_H} ${pts.join(' ')} ${x(data.length - 1)},${VB_H}`} className={cn(FILL[c], 'opacity-15')} />
            )}
            <polyline points={pts.join(' ')} fill="none" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" className={STROKE[c]} />
            {data.map((row, i) => (
              // A wide, invisible hit area per point carries the hover text.
              <rect key={i} x={x(i) - slot / 2} y="0" width={slot} height={VB_H} className="fill-transparent">
                <title>{`${String(row[index])} · ${s.label ?? s.key}: ${valueFormat(valueOf(row, s.key))}`}</title>
              </rect>
            ))}
          </g>
        );
      })}
    </Frame>
  );
}

export interface DonutChartProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  data: { label: string; value: number; color?: ChartColor }[];
  /** Accessible name of the chart. */
  title: string;
  /** Content in the hole, such as the total. */
  center?: React.ReactNode;
  valueFormat?: (value: number) => string;
  /** Show the legend beside the donut. Default on. */
  legend?: boolean;
}

/** Parts of a whole. Keep it to six slices or fewer; group the rest as "Other". */
export function DonutChart({ data, title, center, valueFormat = defaultFormat, legend = true, className, ...props }: DonutChartProps) {
  const total = data.reduce((sum, d) => sum + Math.max(0, d.value), 0) || 1;
  // r = 100 / 2π, so the circumference is 100 and dash lengths are percentages.
  const r = 15.9155;
  let offset = 25; // start at 12 o'clock
  return (
    <figure aria-label={title} className={cn('m-0 flex flex-wrap items-center gap-6', className)} {...props}>
      <div aria-hidden="true" className="relative size-40 shrink-0">
        <svg viewBox="0 0 42 42" className="size-full rtl:-scale-x-100">
          <circle cx="21" cy="21" r={r} fill="none" strokeWidth="6" className="stroke-[var(--color-surface-container-high)]" />
          {data.map((d, i) => {
            const pct = (Math.max(0, d.value) / total) * 100;
            const dash = `${pct} ${100 - pct}`;
            const el = (
              <circle key={d.label} cx="21" cy="21" r={r} fill="none" strokeWidth="6" strokeDasharray={dash} strokeDashoffset={offset} className={STROKE[colorIndex(d.color, i)]}>
                <title>{`${d.label}: ${valueFormat(d.value)} (${Math.round(pct)}%)`}</title>
              </circle>
            );
            offset -= pct;
            return el;
          })}
        </svg>
        {center != null && <div className="absolute inset-0 flex items-center justify-center text-center text-title-md text-[var(--color-on-surface)]">{center}</div>}
      </div>
      {legend && <ChartLegend aria-hidden="true" className="flex-col" items={data.map((d) => ({ label: d.label, color: d.color }))} />}
      <table className="sr-only">
        <caption>{title}</caption>
        <tbody>
          {data.map((d) => (
            <tr key={d.label}>
              <th scope="row">{d.label}</th>
              <td>{valueFormat(d.value)}</td>
              <td>{Math.round((Math.max(0, d.value) / total) * 100)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

export interface SparklineProps extends Omit<React.SVGAttributes<SVGSVGElement>, 'values' | 'color'> {
  values: number[];
  /** Accessible summary, e.g. "Revenue, last 12 weeks, up 8%". Without it the sparkline is decorative. */
  label?: string;
  color?: ChartColor;
  /** Fill the area under the line. */
  area?: boolean;
}

/** A tiny trend line with no axes, for stat cards and table cells. Fills its box (default 6rem × 2rem). */
export function Sparkline({ values, label, color = 1, area = false, className, ...props }: SparklineProps) {
  const min = Math.min(...values);
  const span = Math.max(...values) - min || 1;
  const step = values.length > 1 ? VB_W / (values.length - 1) : 0;
  const pts = values.map((v, i) => `${i * step},${VB_H - 4 - ((v - min) / span) * (VB_H - 8)}`).join(' ');
  const c = colorIndex(color, 0);
  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="none"
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
      className={cn('h-8 w-24 overflow-visible rtl:-scale-x-100', className)} {...props}>
      {area && values.length > 1 && <polygon points={`0,${VB_H} ${pts} ${VB_W},${VB_H}`} className={cn(FILL[c], 'opacity-15')} />}
      <polyline points={pts} fill="none" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" className={STROKE[c]} />
    </svg>
  );
}
