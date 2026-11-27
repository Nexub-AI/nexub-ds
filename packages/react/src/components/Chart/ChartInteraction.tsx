'use client';

// The client layer of the charts (10.7): pointer crosshair and tooltip, keyboard
// point navigation, click, and the toggle legend. The charts in Chart.tsx and
// MoreCharts.tsx render one of the Interactive* components below only when
// `interactive`, `onPointClick` or `legend="toggle"` is set; each holds the
// state and draws the chart through its own *View function, so the drawing
// code is not repeated here. The tooltip and marks are positioned with styles
// set after an interaction, so the server HTML still has no style attributes.
import * as React from 'react';
import { cn } from '../../utils/cn.js';
import { useLocale, useNexubMessages } from '../NexubProvider/NexubProvider.js';
import {
  BarChartView, DonutChartView, LineChartView, SparklineView, chartBg, formatSeriesValue, nearestIndex, niceDomain, rawValueOf, segmentAt, valueOf,
  type BarChartProps, type ChartIx, type DonutChartProps, type LineChartProps, type SparklineProps,
} from './Chart.js';
import { FunnelView, HeatmapView, type FunnelProps, type HeatmapProps } from './MoreCharts.js';
import { SeriesToggles, useSeriesToggle } from './ChartToggle.js';
import { referenceValues } from './ChartStory.js';

type Active = NonNullable<ChartIx['active']>;
const fmt = (n: number) => n.toLocaleString();
const pct = (f: number) => `${f * 100}%`;

interface Tip {
  title: string;
  rows?: { swatch?: string; label?: string; value: string; strong?: boolean }[];
}

interface PointLayerProps {
  label?: string;
  /** Points, laid out in equal cells: `cols` per row (default: one row). */
  count: number;
  cols?: number;
  /** Up/Down switch series when there is one row and more than one series. */
  seriesCount?: number;
  active: Active | null;
  onActive: (active: Active | null) => void;
  /** The point at a position (fractions of the box, x mirrored in RTL). Default: the cell. */
  hit?: (fx: number, fy: number) => Active | null;
  /** Where the tooltip points (fractions of the box, from the start edge). Default: the cell's top centre. */
  at?: (i: number) => [number, number];
  /** Put the tooltip beside the crosshair at the top of the box, not above the point. */
  beside?: boolean;
  tip: (active: Active) => Tip;
  /** The keyboard announcement, "label: series value". */
  say: (active: Active) => string;
  onSelect?: (active: Active) => void;
  /** Marks for the active point (crosshair, dots). */
  children?: React.ReactNode;
}

/**
 * One tab stop over the plot. A named `group` (not `application`: no keys are
 * taken from the screen reader, and the data table next to it stays the full
 * reading); arrow keys move a point whose text goes to a polite live region.
 */
function PointLayer({ label, count, cols = count, seriesCount = 1, active, onActive, hit, at, beside, tip, say, onSelect, children }: PointLayerProps) {
  const t = useNexubMessages();
  const rtl = useLocale().dir === 'rtl';
  const ref = React.useRef<HTMLDivElement>(null);
  const last = React.useRef<Active>({ i: 0 });
  const [said, setSaid] = React.useState('');
  const rows = Math.ceil(count / cols);

  const locate = (e: { clientX: number; clientY: number }): Active | null => {
    const r = ref.current!.getBoundingClientRect();
    if (!(r.width > 0 && r.height > 0)) return null;
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    if (hit) return hit(rtl ? 1 - x / r.width : x / r.width, y / r.height);
    const i = nearestIndex(y, r.height, rows) * cols + nearestIndex(x, r.width, cols, rtl);
    return i < count ? { i } : null;
  };
  const point = (a: Active | null) => {
    if (a?.i !== active?.i || a?.s !== active?.s) onActive(a);
    if (a) last.current = a;
  };
  // Where the keyboard was, kept inside data that may have shrunk since.
  const resume = (): Active => ({ i: Math.min(last.current.i, count - 1), s: Math.min(last.current.s ?? 0, seriesCount - 1) });
  const go = (a: Active) => {
    point(a);
    setSaid(say(a));
  };

  // Touch: a tap outside puts the tooltip away.
  const shown = active != null;
  React.useEffect(() => {
    if (!shown) return;
    const away = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) onActive(null);
    };
    document.addEventListener('pointerdown', away);
    return () => document.removeEventListener('pointerdown', away);
  }, [shown, onActive]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onActive(null);
      setSaid('');
      return;
    }
    const cur = active ?? resume();
    const s = cur.s ?? 0;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (active) onSelect?.({ i: cur.i, s });
      return;
    }
    const start = Math.floor(cur.i / cols) * cols;
    const end = Math.min(count, start + cols) - 1;
    let { i } = cur;
    let next = s;
    if (e.key === (rtl ? 'ArrowLeft' : 'ArrowRight')) i = Math.min(end, i + 1);
    else if (e.key === (rtl ? 'ArrowRight' : 'ArrowLeft')) i = Math.max(start, i - 1);
    else if (e.key === 'Home') i = cols > 1 ? start : 0;
    else if (e.key === 'End') i = cols > 1 ? end : count - 1;
    else if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && (rows > 1 || seriesCount > 1)) {
      const d = e.key === 'ArrowDown' ? 1 : -1;
      if (rows > 1) i = i + d * cols >= 0 && i + d * cols < count ? i + d * cols : i;
      else next = Math.min(seriesCount - 1, Math.max(0, s + d));
    } else return;
    e.preventDefault();
    go({ i, s: next });
  };

  const shownTip = active ? tip(active) : null;
  const [ax, ay] = active ? (at?.(active.i) ?? [((active.i % cols) + 0.5) / cols, Math.floor(active.i / cols) / rows]) : [0, 0];
  // Runs on every commit while the tooltip shows: beside the crosshair (flipped
  // near the end edge), or above the point (below it near the top), inside the box.
  const place = (el: HTMLDivElement | null) => {
    const box = ref.current;
    if (!el || !box) return;
    const [W, H, w, h, gap] = [box.clientWidth, box.clientHeight, el.offsetWidth, el.offsetHeight, 8];
    const x = (rtl ? 1 - ax : ax) * W;
    const y = ay * H;
    const centred = Math.max(0, Math.min(W - w, x - w / 2));
    const left = !beside ? centred : x + gap + w <= W ? x + gap : x - gap - w >= 0 ? x - gap - w : centred;
    const top = beside ? 4 : y - gap - h >= 0 ? y - gap - h : y + (at ? 0 : H / rows) + gap;
    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
  };

  const handlers = {
    onKeyDown,
    onFocus: () => {
      if (!active && count > 0) go(resume());
    },
    onBlur: () => {
      onActive(null);
      setSaid('');
    },
    onPointerMove: (e: React.PointerEvent) => point(locate(e)),
    onPointerDown: (e: React.PointerEvent) => point(locate(e)),
    onPointerLeave: (e: React.PointerEvent) => {
      if (e.pointerType !== 'touch') onActive(null);
    },
    onClick: (e: React.MouseEvent) => {
      const a = locate(e);
      point(a);
      if (a) onSelect?.(a);
    },
  };

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription={t.interactiveChart}
      aria-label={label}
      tabIndex={0}
      data-chart-layer=""
      className={cn('absolute inset-0 rounded-shape-tooltip', onSelect && 'cursor-pointer')}
      {...handlers}
    >
      {children}
      {shownTip && (
        <div
          ref={place}
          aria-live="off"
          data-chart-tooltip=""
          className="pointer-events-none absolute z-10 w-max rounded-shape-tooltip bg-[var(--color-inverse-surface)] px-3 py-2 text-label-md text-[var(--color-inverse-on-surface)] shadow-elevation-2"
        >
          <div className="font-semibold">{shownTip.title}</div>
          {shownTip.rows?.map((r, k) => (
            <div key={k} className={cn('flex items-center gap-2 tabular-nums', k === 0 && 'mt-1', r.strong && 'font-semibold')}>
              {r.swatch && <span className={cn('size-2 shrink-0 rounded-full', r.swatch)} />}
              {r.label != null && <span className="flex-1">{r.label}</span>}
              <span className={r.label != null ? 'ps-3' : undefined}>{r.value}</span>
            </div>
          ))}
        </div>
      )}
      <span aria-live="polite" className="sr-only">{said}</span>
    </div>
  );
}

// Marks sit on the start edge, so they mirror with the drawing in RTL. Borders
// and outlines, not backgrounds, carry the crosshair and focus: they stay in forced colours.
const CROSSHAIR = 'pointer-events-none absolute inset-y-0 border-s border-[var(--color-outline)]';
const DOT = 'pointer-events-none absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--color-surface)] rtl:translate-x-1/2';
const FOCUS = 'outline outline-2 outline-[var(--color-on-surface)]';

/** BarChart and LineChart: crosshair, tooltip, keyboard, click and the toggle legend. */
export function InteractiveCartesian<T extends object>({
  kind, interactive, onPointClick, hiddenSeries, defaultHiddenSeries, onHiddenSeriesChange, ...props
}: BarChartProps<T> & LineChartProps<T> & { kind: 'bar' | 'line' }) {
  const { data, index, title, legend, valueFormat = fmt, stacked } = props;
  const t = useNexubMessages();
  const toggle = useSeriesToggle(props.series, { hidden: hiddenSeries, defaultHidden: defaultHiddenSeries, onChange: onHiddenSeriesChange });
  const series = toggle.visible;
  const [active, setActive] = React.useState<Active | null>(null);
  const n = data.length;
  // The data can shrink under an open tooltip (ChartZoom, a hidden series).
  const act = active && active.i < n && (active.s ?? 0) < series.length ? active : null;
  const [lo, hi] = niceDomain([...data.flatMap((row) => series.map((s) => valueOf(row, s.key))), ...referenceValues(props.referenceLines)], props.integerTicks);
  const name = (j: number) => series[j]!.label ?? series[j]!.key;
  const text = (i: number, j: number) => formatSeriesValue(data[i]!, series[j]!, valueFormat);
  // One series is named by the keyboard, by a grouped bar under the pointer, or by being the only one.
  const one = (a: Active) => a.s ?? (series.length === 1 ? 0 : undefined);
  const select = (a: Active) => {
    const j = one(a);
    const picked = j == null ? undefined : props.series.find((s) => s.key === series[j]!.key);
    onPointClick?.({ index: a.i, datum: data[a.i]!, series: picked, value: picked ? (rawValueOf(data[a.i]!, picked.key) ?? undefined) : undefined });
  };

  const overlay = (interactive ?? Boolean(onPointClick)) && n > 0 && (
    <PointLayer
      label={title}
      count={n}
      seriesCount={series.length}
      active={act}
      onActive={setActive}
      beside
      hit={(fx) => {
        const i = nearestIndex(fx, 1, n);
        // A grouped bar fills 70% of its band, split between the series.
        const j = Math.floor(((fx * n - i - 0.15) / 0.7) * series.length);
        return kind === 'bar' && !stacked && series.length > 1 && j >= 0 && j < series.length ? { i, s: j } : { i };
      }}
      tip={(a) => ({
        title: String(data[a.i]![index]),
        rows: series.map((s, j) => ({ swatch: chartBg(s.color, j), label: name(j), value: text(a.i, j), strong: series.length > 1 && a.s === j })),
      })}
      say={(a) => `${String(data[a.i]![index])}: ${name(a.s ?? 0)} ${text(a.i, a.s ?? 0)}`}
      onSelect={onPointClick && select}
    >
      {act && (
        <>
          <span style={{ insetInlineStart: pct(act.i / n), width: pct(1 / n) }} className="pointer-events-none absolute inset-y-0 rounded-shape-tooltip bg-[color-mix(in_oklab,var(--color-on-surface)_6%,transparent)]" />
          <span style={{ insetInlineStart: pct((act.i + 0.5) / n) }} className={CROSSHAIR} />
          {kind === 'line' && series.map((s, j) => rawValueOf(data[act.i]!, s.key) == null ? null : (
            <span
              key={s.key}
              style={{ insetInlineStart: pct((act.i + 0.5) / n), top: pct(1 - (valueOf(data[act.i]!, s.key) - lo) / (hi - lo)) }}
              className={cn(DOT, chartBg(s.color, j), act.s === j && FOCUS)}
            />
          ))}
        </>
      )}
    </PointLayer>
  );
  const ix: ChartIx = {
    active: act,
    overlay: overlay || undefined,
    legend: legend === 'toggle' ? <SeriesToggles {...toggle} label={t.chartSeries} /> : undefined,
  };
  return kind === 'bar' ? <BarChartView {...props} series={series} ix={ix} /> : <LineChartView {...props} series={series} ix={ix} />;
}

/** DonutChart: segment highlight, tooltip with value and share, Left/Right between segments, click. */
export function InteractiveDonut({ interactive: _interactive, onPointClick, ...props }: DonutChartProps) {
  const { data, title, valueFormat = fmt } = props;
  const [active, setActive] = React.useState<Active | null>(null);
  const act = active && active.i < data.length ? active : null;
  const values = data.map((d) => Math.max(0, d.value));
  const total = values.reduce((a, b) => a + b, 0) || 1;
  const text = (i: number) => `${valueFormat(data[i]!.value)} (${Math.round((values[i]! / total) * 100)}%)`;
  const select = (a: Active) => onPointClick?.({ index: a.i, datum: data[a.i]!, value: data[a.i]!.value });
  const overlay = (
    <PointLayer
      label={title}
      count={data.length}
      active={act}
      onActive={setActive}
      hit={(fx, fy) => {
        const i = segmentAt(fx, fy, values);
        return i < 0 ? null : { i };
      }}
      at={(i) => {
        // The middle of the segment, on the ring.
        const turn = (values.slice(0, i).reduce((a, b) => a + b, 0) + values[i]! / 2) / total;
        return [0.5 + 0.38 * Math.sin(turn * 2 * Math.PI), 0.5 - 0.38 * Math.cos(turn * 2 * Math.PI)];
      }}
      tip={(a) => ({ title: data[a.i]!.label, rows: [{ swatch: chartBg(data[a.i]!.color, a.i), value: text(a.i) }] })}
      say={(a) => `${data[a.i]!.label}: ${text(a.i)}`}
      onSelect={onPointClick && select}
    />
  );
  return <DonutChartView {...props} ix={{ active: act, overlay }} />;
}

/** Heatmap: cell tooltip, arrow keys across the grid, click. */
export function InteractiveHeatmap({ interactive: _interactive, onPointClick, ...props }: HeatmapProps) {
  const { data, rowLabels, columnLabels, title, valueFormat = fmt } = props;
  const [active, setActive] = React.useState<Active | null>(null);
  const cols = Math.max(0, ...data.map((r) => r.length));
  const cell = (i: number) => {
    const [row, column] = [Math.floor(i / cols), i % cols];
    const value = data[row]?.[column];
    const label = `${rowLabels[row] ?? ''}${columnLabels?.[column] ? `, ${columnLabels[column]}` : ''}`;
    return { row, column, value, label, text: value == null ? '' : valueFormat(value) };
  };
  const act = active && cell(active.i).value != null ? active : null;
  const select = (a: Active) => {
    const { row, column, value } = cell(a.i);
    if (value != null) onPointClick?.({ index: a.i, row, column, value });
  };
  const overlay = cols > 0 && (
    <PointLayer
      label={title}
      count={data.length * cols}
      cols={cols}
      active={act}
      onActive={setActive}
      tip={(a) => ({ title: cell(a.i).label, rows: [{ value: cell(a.i).text }] })}
      say={(a) => `${cell(a.i).label}: ${cell(a.i).text}`}
      onSelect={onPointClick && select}
    />
  );
  return <HeatmapView {...props} ix={{ active: act, overlay }} />;
}

/** Funnel: step tooltip with the conversion from the first step, Up/Down between steps, click. */
export function InteractiveFunnel({ interactive: _interactive, onPointClick, ...props }: FunnelProps) {
  const { data, title, valueFormat = fmt } = props;
  const [active, setActive] = React.useState<Active | null>(null);
  const act = active && active.i < data.length ? active : null;
  const top = Math.max(1, data[0]?.value ?? 1);
  const text = (i: number) => `${valueFormat(data[i]!.value)} (${Math.round((Math.max(0, data[i]!.value) / top) * 100)}%)`;
  const select = (a: Active) => onPointClick?.({ index: a.i, datum: data[a.i]!, value: data[a.i]!.value });
  const overlay = (
    <PointLayer
      label={title}
      count={data.length}
      cols={1}
      active={act}
      onActive={setActive}
      tip={(a) => ({ title: data[a.i]!.label, rows: [{ value: text(a.i) }] })}
      say={(a) => `${data[a.i]!.label}: ${text(a.i)}`}
      onSelect={onPointClick && select}
    />
  );
  return <FunnelView {...props} ix={{ active: act, overlay }} />;
}

/** Sparkline: crosshair, value tooltip under the line, Left/Right between values, click. */
export function InteractiveSparkline({ interactive: _interactive, onPointClick, ...props }: SparklineProps) {
  const { values, label } = props;
  const [active, setActive] = React.useState<Active | null>(null);
  const n = values.length;
  const act = active && active.i < n ? active : null;
  const min = Math.min(...values);
  const span = Math.max(...values) - min || 1;
  // Points sit on the box's edges, not in bands: the same geometry as the drawing.
  const fx = (i: number) => (n > 1 ? i / (n - 1) : 0);
  const select = (a: Active) => onPointClick?.({ index: a.i, datum: values[a.i]!, value: values[a.i]! });
  const overlay = (
    <PointLayer
      label={label}
      count={n}
      active={act}
      onActive={setActive}
      hit={(x) => ({ i: Math.min(n - 1, Math.max(0, Math.round(x * (n - 1)))) })}
      at={(i) => [fx(i), 1]}
      tip={(a) => ({ title: fmt(values[a.i]!) })}
      say={(a) => `${label ? `${label}: ` : ''}${fmt(values[a.i]!)}`}
      onSelect={onPointClick && select}
    >
      {act && (
        <>
          <span style={{ insetInlineStart: pct(fx(act.i)) }} className={CROSSHAIR} />
          <span
            style={{ insetInlineStart: pct(fx(act.i)), top: pct(0.96 - ((values[act.i]! - min) / span) * 0.92) }}
            className={cn(DOT, chartBg(props.color ?? 1, 0), act.s != null && FOCUS)}
          />
        </>
      )}
    </PointLayer>
  );
  return <SparklineView {...props} ix={{ active: act, overlay }} />;
}
