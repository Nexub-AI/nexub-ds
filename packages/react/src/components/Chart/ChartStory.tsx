// 12.3 "Charts that tell a story": annotations, a highlighted change and reference lines on
// BarChart and LineChart. Same rules as the rest of the kit: server-rendered, geometry in SVG
// attributes only (no style attributes, so strict CSP holds), and the 10.3 rule: the product
// accent stays out of charts. Marks use the outline and on-surface tokens; only the change
// callout and a reference line's `tone` take a semantic colour (success / error), because
// there the colour means good or bad. Every note is also text: the change callout is visible
// HTML, and annotations and reference lines are listed in a visually hidden list, both tied to
// the figure with aria-describedby.
import * as React from 'react';
import { defaultMessages } from '@nexub/core';
import { cn } from '../../utils/cn.js';
import type { ChartSeries, ChartTone } from './Chart.js';

/** A labelled point or range on the plot (12.3). */
export interface ChartAnnotation {
  /** The category it marks: a value of the chart's `index` key, e.g. `'Mar'`. */
  at: string | number;
  /** With `to`, the note shades the range from `at` to `to` instead of marking one point. */
  to?: string | number;
  /** The note's text, drawn on the plot and read by screen readers. */
  label: string;
  /** A point note on one series: also marks that series' value with a dot. */
  series?: string;
}

/** A labelled straight line across the plot, e.g. a target or an average (12.3). */
export interface ChartReferenceLine {
  /** A value on the value axis (a horizontal line), or with `axis: 'category'` the category it crosses (a vertical line). */
  value: number | string;
  /** @default 'value' */
  axis?: 'value' | 'category';
  /** The line's text, e.g. "Target". */
  label: string;
  /** A semantic tone for the line, when crossing it is good or bad. The label stays neutral text. @default 'neutral' */
  tone?: ChartTone;
}

/** A callout comparing two points, e.g. "Up 12% (+$1,200) since March" (12.3). */
export interface ChartChange {
  /** The category to compare from. */
  from: string | number;
  /** The category to compare to. Defaults to the last one. */
  to?: string | number;
  /** The series to compare. Defaults to the first. */
  series?: string;
  /** For metrics where down is good (churn, costs): a fall shows in the success colour. */
  invert?: boolean;
  /** Locale of the percentage. The amount uses the series' `valueFormat`, then the chart's. Defaults to the runtime locale. */
  locale?: string;
  /** Names the starting point in the text ("since March"). Defaults to the `from` category. */
  label?: string;
  /** Replaces the whole sentence, e.g. a translation. The marks and colour stay computed. */
  text?: string;
}

/** The storytelling props shared by BarChart and LineChart (12.3). All optional; without them nothing changes. */
export interface ChartStoryProps {
  /** Labelled points or ranges on the plot. */
  annotations?: ChartAnnotation[];
  /** Labelled horizontal (value) or vertical (category) lines. A value line widens the axis to stay in view. */
  referenceLines?: ChartReferenceLine[];
  /** A callout above the plot with the change between two points, its delta computed and formatted. */
  change?: ChartChange;
}

const TONE_LINE: Record<ChartTone, string> = {
  good: 'stroke-[var(--color-success)]',
  warning: 'stroke-[var(--color-warning)]',
  danger: 'stroke-[var(--color-error)]',
  neutral: 'stroke-[var(--color-on-surface-variant)]',
};
const CHANGE_TEXT = { good: 'text-[var(--color-success)]', danger: 'text-[var(--color-error)]', neutral: 'text-[var(--color-on-surface-variant)]' } as const;
// Labels sit on a halo of the surface colour so they stay legible over gridlines and bars. In RTL
// the plot is mirrored; each label flips back about its own box so it reads the right way.
const LABEL =
  'nx-chart-note fill-[var(--color-on-surface-variant)] stroke-[var(--color-surface)] text-label-sm [paint-order:stroke] [stroke-linejoin:round] rtl:origin-center rtl:-scale-x-100 rtl:[transform-box:fill-box]';

const num = (row: unknown, key: string): number | null => {
  const v = (row as Record<string, unknown>)[key];
  if (v == null || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

/** Internal: the value-axis numbers of the reference lines, so the domain keeps them in view. */
export const referenceValues = (lines: ChartReferenceLine[] | undefined): number[] =>
  (lines ?? []).filter((l) => (l.axis ?? 'value') === 'value' && typeof l.value === 'number' && Number.isFinite(l.value)).map((l) => l.value as number);

interface Plot<T> {
  data: T[];
  index: string;
  series: ChartSeries[];
  valueFormat: (v: number) => string;
  domain: [number, number];
  w: number;
  h: number;
}

const catIndex = <T,>(p: Plot<T>, at: string | number | undefined) =>
  at == null ? -1 : p.data.findIndex((row) => String((row as Record<string, unknown>)[p.index]) === String(at));
const catLabel = <T,>(p: Plot<T>, i: number) => String((p.data[i] as Record<string, unknown>)[p.index]);

export interface ComputedChange {
  direction: 'up' | 'down' | 'flat';
  tone: 'good' | 'danger' | 'neutral';
  text: string;
  /** Change as a fraction of the starting value (0.12 for +12%), or undefined from 0. */
  ratio: number | undefined;
  delta: number;
  points: [{ i: number; v: number }, { i: number; v: number }];
  seriesIndex: number;
}

/** Internal: the change between two points, or null when either point or value is missing. */
export function computeChange<T>(change: ChartChange, p: Pick<Plot<T>, 'data' | 'index' | 'series' | 'valueFormat'>): ComputedChange | null {
  const plot = p as Plot<T>;
  const a = catIndex(plot, change.from);
  const b = change.to == null ? p.data.length - 1 : catIndex(plot, change.to);
  const j = change.series == null ? 0 : p.series.findIndex((s) => s.key === change.series);
  const s = p.series[j];
  if (a < 0 || b < 0 || !s) return null;
  const from = num(p.data[a], s.key);
  const to = num(p.data[b], s.key);
  if (from == null || to == null) return null;
  const delta = to - from;
  const direction = delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat';
  const ratio = from === 0 ? undefined : delta / Math.abs(from);
  const format = s.valueFormat ?? p.valueFormat;
  const amount = `${delta > 0 ? '+' : delta < 0 ? '−' : ''}${format(Math.abs(delta))}`;
  const percent = ratio == null ? undefined : new Intl.NumberFormat(change.locale, { style: 'percent', maximumFractionDigits: 1 }).format(Math.abs(ratio));
  const good = change.invert ? delta < 0 : delta > 0;
  return {
    direction,
    tone: direction === 'flat' ? 'neutral' : good ? 'good' : 'danger',
    text: change.text ?? defaultMessages.chartChange(direction, amount, percent, change.label ?? catLabel(plot, a)),
    ratio,
    delta,
    points: [{ i: a, v: from }, { i: b, v: to }],
    seriesIndex: j,
  };
}

/** Internal: what the frame needs to draw the story layers. */
export function chartStory<T>(props: ChartStoryProps, p: Plot<T>, id: string) {
  const { annotations = [], referenceLines = [], change } = props;
  const n = Math.max(1, p.data.length);
  const [lo, hi] = p.domain;
  const slot = p.w / n;
  const cx = (i: number) => i * slot + slot / 2;
  const cy = (v: number) => p.h - ((v - lo) / (hi - lo)) * p.h;
  const px = (i: number) => `${((i + 0.5) / n) * 100}%`;
  const py = (v: number) => `${(cy(v) / p.h) * 100}%`;
  const computed = change ? computeChange(change, p) : null;

  const notes = annotations
    .map((a) => ({ a, i: catIndex(p, a.at), j: a.to == null ? -1 : catIndex(p, a.to) }))
    .filter((x) => x.i >= 0);
  const lines = referenceLines
    .map((l) => ({ l, cat: (l.axis ?? 'value') === 'category', i: (l.axis ?? 'value') === 'category' ? catIndex(p, l.value) : -1 }))
    .filter((x) => (x.cat ? x.i >= 0 : typeof x.l.value === 'number' && Number.isFinite(x.l.value)));
  const any = notes.length > 0 || lines.length > 0 || computed != null;

  // In the plot's own (stretched, mirrored) viewBox: bands, guides, lines, the change connector.
  const plot = any ? (
    <g data-chart-story="" aria-hidden="true">
      {notes.map(({ i, j }, k) =>
        j >= 0 ? (
          <rect key={`a${k}`} data-annotation="range" x={Math.min(i, j) * slot} width={(Math.abs(j - i) + 1) * slot} y="0" height={p.h}
            className="fill-[var(--color-on-surface)] opacity-[0.06]" />
        ) : (
          <line key={`a${k}`} data-annotation="point" x1={cx(i)} x2={cx(i)} y1="0" y2={p.h} strokeWidth="1" strokeDasharray="2 3" vectorEffect="non-scaling-stroke"
            className="stroke-[var(--color-outline)]" />
        ),
      )}
      {lines.map(({ l, cat, i }, k) =>
        cat ? (
          <line key={`r${k}`} data-reference="category" x1={cx(i)} x2={cx(i)} y1="0" y2={p.h} strokeWidth="1.5" strokeDasharray="6 4" vectorEffect="non-scaling-stroke"
            className={TONE_LINE[l.tone ?? 'neutral']} />
        ) : (
          <line key={`r${k}`} data-reference="value" x1="0" x2={p.w} y1={cy(l.value as number)} y2={cy(l.value as number)} strokeWidth="1.5" strokeDasharray="6 4" vectorEffect="non-scaling-stroke"
            className={TONE_LINE[l.tone ?? 'neutral']} />
        ),
      )}
      {computed && (
        <line data-change="" x1={cx(computed.points[0].i)} y1={cy(computed.points[0].v)} x2={cx(computed.points[1].i)} y2={cy(computed.points[1].v)}
          strokeWidth="1" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" className="stroke-[var(--color-on-surface-variant)]" />
      )}
    </g>
  ) : null;

  // Over the plot, in percentages of its box (not stretched): dots stay round, text keeps its shape.
  const marks = any ? (
    // `direction="ltr"`: the anchors and offsets below are worked out for the unmirrored plot, and
    // the mirror (with each label's flip back) takes care of RTL. Inherited RTL would swap the anchors.
    <svg aria-hidden="true" direction="ltr" className="pointer-events-none absolute inset-0 size-full overflow-visible rtl:-scale-x-100">
      {notes.map(({ a, i, j }, k) => {
        const start = j >= 0 ? Math.min(i, j) : i;
        const nearEnd = j < 0 && i >= n / 2;
        const sv = a.series != null && j < 0 ? num(p.data[i], a.series) : null;
        return (
          <React.Fragment key={k}>
            {sv != null && (
              <circle cx={px(i)} cy={py(sv)} r="4" strokeWidth="2" className="fill-[var(--color-surface)] stroke-[var(--color-on-surface)]" />
            )}
            <text x={j >= 0 ? `${(start / n) * 100}%` : px(i)} y="0" dx={nearEnd ? -4 : 4} dy="0.9em" textAnchor={nearEnd ? 'end' : 'start'}
              strokeWidth="3" className={LABEL}>{a.label}</text>
          </React.Fragment>
        );
      })}
      {lines.map(({ l, cat, i }, k) => {
        if (cat) {
          const nearEnd = i >= n / 2;
          return (
            <text key={k} x={px(i)} y="100%" dx={nearEnd ? -4 : 4} dy="-0.4em" textAnchor={nearEnd ? 'end' : 'start'} strokeWidth="3" className={LABEL}>
              {l.label}
            </text>
          );
        }
        // Above the line, or below it when the line runs along the top.
        const top = cy(l.value as number) / p.h < 0.15;
        return (
          <text key={k} x="100%" y={py(l.value as number)} dx="-4" dy={top ? '1.1em' : '-0.4em'} textAnchor="end" strokeWidth="3" className={LABEL}>
            {l.label}
          </text>
        );
      })}
      {computed?.points.map((pt, k) => (
        <circle key={`c${k}`} data-change-point="" cx={px(pt.i)} cy={py(pt.v)} r="4" strokeWidth="2" className="fill-[var(--color-surface)] stroke-[var(--color-on-surface)]" />
      ))}
    </svg>
  ) : null;

  const callout = computed && (
      <p id={`${id}c`} data-change={computed.direction} className={cn('m-0 flex items-center gap-1.5 text-label-lg font-medium tabular-nums', CHANGE_TEXT[computed.tone])}>
        {computed.direction !== 'flat' && (
          <svg aria-hidden="true" viewBox="0 0 16 16" className={cn('size-4 shrink-0', computed.direction === 'down' && 'rotate-180')}>
            <path d="M8 3 13 9H9.5v4h-3V9H3z" className="fill-current" />
          </svg>
        )}
        {computed.text}
      </p>
  );

  // The figure is described by each entry, not by the list: a list's own name would replace its text.
  const summary = notes.length + lines.length > 0 && (
      <ul aria-label={defaultMessages.chartNotes} className="sr-only">
        {notes.map(({ a, i, j }, k) => (
          <li key={`a${k}`} id={`${id}a${k}`}>
            {defaultMessages.chartAnnotation(a.label, j >= 0 ? `${catLabel(p, Math.min(i, j))}–${catLabel(p, Math.max(i, j))}` : catLabel(p, i))}
          </li>
        ))}
        {lines.map(({ l, cat, i }, k) => (
          <li key={`r${k}`} id={`${id}r${k}`}>{defaultMessages.chartReferenceLine(l.label, cat ? catLabel(p, i) : p.valueFormat(l.value as number))}</li>
        ))}
      </ul>
  );
  const describedBy = [
    ...(computed ? [`${id}c`] : []),
    ...notes.map((_, k) => `${id}a${k}`),
    ...lines.map((_, k) => `${id}r${k}`),
  ].join(' ') || undefined;

  return { plot, marks, callout, summary, describedBy };
}
