import * as React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, G, Line, Polygon, Polyline, Rect, Text as SvgText } from 'react-native-svg';
import { CATEGORY_COLORS } from '@nexub/core';
import { ArrowDown, ArrowUp } from '@nexub/icons/native';
import { Text } from '../primitives/Text';
import { useTheme, type NexubTheme, type RoleName } from '../theme/ThemeProvider';
import { Skeleton } from './feedback';

// 12.5: the native twins of web LineChart and (vertical) BarChart, drawn with react-native-svg
// (already a peer). Same data shape and prop names, including the 12.3 storytelling props
// (`annotations`, `referenceLines`, `change`). The 10.3 rule holds: the product accent stays out
// of charts. Series take the category palette (one hue per chart colour, as web), and only the
// change callout and a reference line's `tone` take a semantic colour. The drawing is hidden
// from screen readers; the chart is one image whose label is a text summary of the same data.

/** A colour from the categorical chart palette, 1–8. */
export type ChartColor = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
/** A semantic tone beside the categorical palette, for values that are good or bad. */
export type ChartTone = 'good' | 'warning' | 'danger' | 'neutral';
/** A palette colour or a semantic tone. */
export type ChartPaint = ChartColor | ChartTone;

export interface ChartSeries {
  /** Key of the value in each data row. */
  key: string;
  /** Name shown in the legend and the summary. Defaults to `key`. */
  label?: string;
  /** Palette colour, 1–8, or a tone: `good`, `warning`, `danger`, `neutral`. Defaults to the series' position. */
  color?: ChartPaint;
  /** Formats this series' values in the summary. The axis keeps the chart's `valueFormat`. */
  valueFormat?: (value: number) => string;
}

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
  /** A semantic tone for the line, when crossing it is good or bad. @default 'neutral' */
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
  /** Locale of the percentage. @default the provider's */
  locale?: string;
  /** Names the starting point in the text ("since March"). Defaults to the `from` category. */
  label?: string;
  /** Replaces the whole sentence, e.g. a translation. The marks and colour stay computed. */
  text?: string;
}

interface CartesianProps<T> {
  /** One row per category, in order. */
  data: T[];
  /** Key of the category label in each row (the x axis). */
  index: keyof T & string;
  /** The values to plot, one entry per series. */
  series: ChartSeries[];
  /** Accessible name of the chart, e.g. "Revenue by month". */
  title: string;
  /** Formats axis labels and the summary. */
  valueFormat?: (value: number) => string;
  /** Height of the plot: 128, 192 or 256 pt. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Show the legend above the chart. Defaults to on for more than one series. */
  legend?: boolean;
  /** Gridlines and axis labels on whole numbers only (counts). */
  integerTicks?: boolean;
  /** Labelled points or ranges on the plot (12.3). */
  annotations?: ChartAnnotation[];
  /** Labelled horizontal (value) or vertical (category) lines. A value line widens the axis to stay in view (12.3). */
  referenceLines?: ChartReferenceLine[];
  /** A callout above the plot with the change between two points, its delta computed and formatted (12.3). */
  change?: ChartChange;
  /** A placeholder the size of the plot while the data loads. */
  loading?: boolean;
  /** Shown when `data` is empty. @default the "Nothing here yet" text */
  emptyState?: React.ReactNode;
  /** Shown in place of the plot when set (a failed load). */
  errorState?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export interface LineChartProps<T> extends CartesianProps<T> {
  /** Fill the area under each line (down to the zero line). */
  area?: boolean;
}

export interface BarChartProps<T> extends CartesianProps<T> {
  /** Stack the series in one bar per category instead of side by side. */
  stacked?: boolean;
  /** A colour per bar, e.g. red for the months over budget. Return undefined for the series colour. */
  colorOf?: (row: T, series: ChartSeries, index: number) => ChartPaint | undefined;
}

// ─── Maths (as web) ──────────────────────────────────────────────────────────

/** Rounds up to 1, 2, 2.5 or 5 × 10ⁿ so the four gridlines get round labels. */
function niceMax(max: number): number {
  if (!(max > 0)) return 1;
  const pow = 10 ** Math.floor(Math.log10(max));
  return [1, 2, 2.5, 5, 10].find((s) => s * pow >= max)! * pow;
}

function niceDomain(values: number[], integer = false): [number, number] {
  const lo = Math.min(0, ...values);
  const hi = Math.max(0, ...values);
  const nice = (v: number) => {
    const n = niceMax(v);
    return integer && !Number.isInteger(n / 4) ? Math.max(4, Math.ceil(n / 4) * 4) : n;
  };
  if (lo === 0) return [0, nice(hi)];
  if (hi === 0) return [-nice(-lo), 0];
  return [-nice(-lo), nice(hi)];
}

/** A value, or null when it is missing (drawn as a gap, listed as "—"). */
const rawValueOf = <T,>(row: T, key: string): number | null => {
  const v = (row as Record<string, unknown>)[key];
  if (v == null || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};
const valueOf = <T,>(row: T, key: string) => rawValueOf(row, key) ?? 0;
const referenceValues = (lines: ChartReferenceLine[] | undefined) =>
  (lines ?? []).filter((l) => (l.axis ?? 'value') === 'value' && typeof l.value === 'number' && Number.isFinite(l.value)).map((l) => l.value as number);

const PALETTE = CATEGORY_COLORS.filter((c) => c !== 'accent');
const TONE_ROLE: Record<ChartTone, RoleName> = { good: 'success', warning: 'warning', danger: 'error', neutral: 'outline' };
/** A series colour: the category hue for a palette number, a role for a tone. Never the product accent. */
const paintOf = (theme: NexubTheme, color: ChartPaint | undefined, i: number) =>
  typeof color === 'string'
    ? theme.roles[TONE_ROLE[color]]
    : theme.tokens.color.categories[theme.scheme][PALETTE[((color ?? (i % 8) + 1) - 1) % 8]!].color;

interface Computed {
  direction: 'up' | 'down' | 'flat';
  tone: 'good' | 'danger' | 'neutral';
  text: string;
  points: [{ i: number; v: number }, { i: number; v: number }];
}

function computeChange<T>(change: ChartChange, data: T[], index: string, series: ChartSeries[], valueFormat: (v: number) => string, theme: NexubTheme): Computed | null {
  const cat = (at: string | number) => data.findIndex((row) => String((row as Record<string, unknown>)[index]) === String(at));
  const a = cat(change.from);
  const b = change.to == null ? data.length - 1 : cat(change.to);
  const s = series[change.series == null ? 0 : series.findIndex((x) => x.key === change.series)];
  if (a < 0 || b < 0 || !s) return null;
  const from = rawValueOf(data[a], s.key);
  const to = rawValueOf(data[b], s.key);
  if (from == null || to == null) return null;
  const delta = to - from;
  const direction = delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat';
  const ratio = from === 0 ? undefined : delta / Math.abs(from);
  const amount = `${delta > 0 ? '+' : delta < 0 ? '−' : ''}${(s.valueFormat ?? valueFormat)(Math.abs(delta))}`;
  const percent =
    ratio == null ? undefined : new Intl.NumberFormat(change.locale ?? theme.locale, { style: 'percent', maximumFractionDigits: 1 }).format(Math.abs(ratio));
  const good = change.invert ? delta < 0 : delta > 0;
  const label = change.label ?? String((data[a] as Record<string, unknown>)[index]);
  return {
    direction,
    tone: direction === 'flat' ? 'neutral' : good ? 'good' : 'danger',
    text: change.text ?? theme.messages.chartChange(direction, amount, percent, label),
    points: [
      { i: a, v: from },
      { i: b, v: to },
    ],
  };
}

// ─── Frame ───────────────────────────────────────────────────────────────────

type Draw = (plot: { w: number; h: number; x: (i: number) => number; y: (v: number) => number; slot: number }) => React.ReactNode;

function Frame<T>({
  data,
  index,
  series,
  title,
  valueFormat = (n: number) => n.toLocaleString(),
  size = 'md',
  legend,
  annotations = [],
  referenceLines = [],
  change,
  loading = false,
  emptyState,
  errorState,
  style,
  testID,
  domain,
  draw,
}: CartesianProps<T> & { domain: [number, number]; draw: Draw }) {
  const theme = useTheme();
  const { roles, tokens, messages, dir } = theme;
  const s = tokens.spacing;
  const h = { sm: s[32], md: s[48], lg: s[64] }[size];
  const [w, setW] = React.useState(0);
  const labels = series.map((x) => x.label ?? x.key);
  const showLegend = legend ?? series.length > 1;
  const legendRow = showLegend && (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{ flexDirection: 'row', flexWrap: 'wrap', columnGap: s[4], rowGap: s[1] }}
    >
      {series.map((x, i) => (
        <View key={x.key} style={{ flexDirection: 'row', alignItems: 'center', gap: s['1-5'] }}>
          <View style={{ width: s['2-5'], height: s['2-5'], borderRadius: s['2-5'] / 2, backgroundColor: paintOf(theme, x.color, i) }} />
          <Text variant="label-md" color="on-surface-variant">
            {labels[i]}
          </Text>
        </View>
      ))}
    </View>
  );

  const state =
    errorState != null
      ? errorState
      : loading
        ? <Skeleton height={h} radius="container" />
        : data.length === 0
          ? emptyState ?? (
              <Text variant="body-md" color="on-surface-muted">
                {messages.emptyStates.noData.title}
              </Text>
            )
          : null;
  if (state != null) {
    return (
      <View testID={testID} accessibilityLabel={title} accessibilityState={{ busy: loading }} style={[{ gap: s[3] }, style]}>
        {legendRow}
        <View style={{ minHeight: h, justifyContent: 'center' }}>{state}</View>
      </View>
    );
  }

  const [lo, hi] = domain;
  const n = Math.max(1, data.length);
  const slot = w / n;
  const rtl = dir === 'rtl';
  // Mirrored in RTL: the first category sits at the start edge, as the labels under the plot do.
  const x = (i: number) => (rtl ? w - (i * slot + slot / 2) : i * slot + slot / 2);
  const y = (v: number) => h - ((v - lo) / (hi - lo || 1)) * h;
  const ticks = [1, 0.75, 0.5, 0.25, 0];
  const cat = (at: string | number | undefined) => (at == null ? -1 : data.findIndex((row) => String(row[index]) === String(at)));
  const catLabel = (i: number) => String(data[i]![index]);
  const fmtOf = (x: ChartSeries) => x.valueFormat ?? valueFormat;

  const computed = change ? computeChange(change, data, index, series, valueFormat, theme) : null;
  const notes = annotations.map((a) => ({ a, i: cat(a.at), j: a.to == null ? -1 : cat(a.to) })).filter((nt) => nt.i >= 0);
  const lines = referenceLines
    .map((l) => ({ l, isCat: (l.axis ?? 'value') === 'category', i: (l.axis ?? 'value') === 'category' ? cat(l.value) : -1 }))
    .filter((r) => (r.isCat ? r.i >= 0 : typeof r.l.value === 'number' && Number.isFinite(r.l.value)));
  const toneLine: Record<ChartTone, string> = { good: roles.success, warning: roles.warning, danger: roles.error, neutral: roles['on-surface-variant'] };
  const changeColor: Record<Computed['tone'], RoleName> = { good: 'success', danger: 'error', neutral: 'on-surface-variant' };
  const font = tokens.type['label-sm'];
  // Labels near the far edge anchor back towards the plot; `end` is the far edge, mirrored in RTL.
  const anchor = (nearEnd: boolean) => ((nearEnd ? !rtl : rtl) ? 'end' : 'start');
  const nudge = (nearEnd: boolean) => (nearEnd !== rtl ? -s[1] : s[1]);

  // The text alternative: the change, every row, then the notes (web's hidden table and list).
  const summary = [
    title,
    computed?.text,
    ...data.map(
      (row) =>
        `${String(row[index])}: ${series
          .map((x, k) => {
            const v = rawValueOf(row, x.key);
            return `${labels[k]} ${v == null ? messages.noValue : fmtOf(x)(v)}`;
          })
          .join(', ')}`,
    ),
    ...notes.map(({ a, i, j }) =>
      messages.chartAnnotation(a.label, j >= 0 ? `${catLabel(Math.min(i, j))}–${catLabel(Math.max(i, j))}` : catLabel(i)),
    ),
    ...lines.map(({ l, isCat, i }) => messages.chartReferenceLine(l.label, isCat ? catLabel(i) : valueFormat(l.value as number))),
  ]
    .filter(Boolean)
    .join('. ');

  return (
    <View testID={testID} accessible accessibilityRole="image" accessibilityLabel={summary} style={[{ gap: s[3] }, style]}>
      {computed && (
        <View testID={testID ? `${testID}-change` : undefined} style={{ flexDirection: 'row', alignItems: 'center', gap: s['1-5'] }}>
          {computed.direction !== 'flat' &&
            React.createElement(computed.direction === 'up' ? ArrowUp : ArrowDown, { size: tokens.size.icon.sm, color: roles[changeColor[computed.tone]] })}
          <Text variant="label-lg" color={changeColor[computed.tone]} tabular>
            {computed.text}
          </Text>
        </View>
      )}
      {legendRow}
      <View style={{ flexDirection: 'row', gap: s[2] }}>
        <View style={{ height: h, justifyContent: 'space-between' }}>
          {ticks.map((t) => (
            <View key={t} style={{ height: 0, justifyContent: 'center' }}>
              <Text variant="label-sm" color="on-surface-muted" tabular style={{ textAlign: rtl ? 'left' : 'right' }}>
                {valueFormat(lo + (hi - lo) * t)}
              </Text>
            </View>
          ))}
        </View>
        <View style={{ flex: 1, minWidth: 0, gap: s[1] }}>
          <View testID={testID ? `${testID}-plot` : undefined} style={{ height: h }} onLayout={(e) => setW(e.nativeEvent.layout.width)}>
            {w > 0 && (
              <Svg width={w} height={h} style={{ overflow: 'visible' }}>
                {ticks.map((t) => (
                  <Line key={t} x1={0} x2={w} y1={h * (1 - t)} y2={h * (1 - t)} stroke={roles['outline-variant']} strokeWidth={1} />
                ))}
                <Line x1={0} x2={w} y1={y(0)} y2={y(0)} stroke={roles.outline} strokeWidth={1} />
                {notes.map(({ i, j }, k) =>
                  j >= 0 ? (
                    <Rect
                      key={`a${k}`}
                      x={rtl ? w - (Math.max(i, j) + 1) * slot : Math.min(i, j) * slot}
                      width={(Math.abs(j - i) + 1) * slot}
                      y={0}
                      height={h}
                      fill={roles['on-surface']}
                      opacity={0.06}
                    />
                  ) : (
                    <Line key={`a${k}`} x1={x(i)} x2={x(i)} y1={0} y2={h} stroke={roles.outline} strokeWidth={1} strokeDasharray="2 3" />
                  ),
                )}
                {draw({ w, h, x, y, slot })}
                {lines.map(({ l, isCat, i }, k) => {
                  const color = toneLine[l.tone ?? 'neutral'];
                  if (isCat) {
                    const nearEnd = i >= n / 2;
                    return (
                      <G key={`r${k}`}>
                        <Line x1={x(i)} x2={x(i)} y1={0} y2={h} stroke={color} strokeWidth={1.5} strokeDasharray="6 4" />
                        <SvgText x={x(i) + nudge(nearEnd)} y={h - s[1]} textAnchor={anchor(nearEnd)} fontSize={font.size} fill={roles['on-surface-variant']}>
                          {l.label}
                        </SvgText>
                      </G>
                    );
                  }
                  const ly = y(l.value as number);
                  const top = ly / h < 0.15;
                  return (
                    <G key={`r${k}`}>
                      <Line x1={0} x2={w} y1={ly} y2={ly} stroke={color} strokeWidth={1.5} strokeDasharray="6 4" />
                      <SvgText
                        x={rtl ? s[1] : w - s[1]}
                        y={top ? ly + font.lineHeight : ly - s[1]}
                        textAnchor={rtl ? 'start' : 'end'}
                        fontSize={font.size}
                        fill={roles['on-surface-variant']}
                      >
                        {l.label}
                      </SvgText>
                    </G>
                  );
                })}
                {notes.map(({ a, i, j }, k) => {
                  const nearEnd = j < 0 && i >= n / 2;
                  const sv = a.series != null && j < 0 ? rawValueOf(data[i], a.series) : null;
                  const lx = j >= 0 ? (rtl ? w - Math.min(i, j) * slot : Math.min(i, j) * slot) : x(i);
                  return (
                    <G key={`n${k}`}>
                      {sv != null && <Circle cx={x(i)} cy={y(sv)} r={s[1]} fill={roles.surface} stroke={roles['on-surface']} strokeWidth={2} />}
                      <SvgText x={lx + nudge(nearEnd)} y={font.lineHeight} textAnchor={anchor(nearEnd)} fontSize={font.size} fill={roles['on-surface-variant']}>
                        {a.label}
                      </SvgText>
                    </G>
                  );
                })}
                {computed && (
                  <G>
                    <Line
                      x1={x(computed.points[0].i)}
                      y1={y(computed.points[0].v)}
                      x2={x(computed.points[1].i)}
                      y2={y(computed.points[1].v)}
                      stroke={roles['on-surface-variant']}
                      strokeWidth={1}
                      strokeDasharray="3 3"
                    />
                    {computed.points.map((p, k) => (
                      <Circle key={k} cx={x(p.i)} cy={y(p.v)} r={s[1]} fill={roles.surface} stroke={roles['on-surface']} strokeWidth={2} />
                    ))}
                  </G>
                )}
              </Svg>
            )}
          </View>
          <View style={{ flexDirection: 'row' }}>
            {data.map((row, i) => (
              <Text key={i} variant="label-sm" color="on-surface-muted" numberOfLines={1} style={{ flex: 1, textAlign: 'center', paddingHorizontal: s['0-5'] }}>
                {String(row[index])}
              </Text>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

// ─── LineChart ───────────────────────────────────────────────────────────────

/** Runs of consecutive present values, so a missing value breaks the line. */
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

/** One line per series across the categories (web LineChart on mobile). Negative values go below the zero line. */
export function LineChart<T extends object>({ area = false, ...props }: LineChartProps<T>) {
  const theme = useTheme();
  const { data, series, integerTicks } = props;
  const domain = niceDomain([...data.flatMap((row) => series.map((x) => valueOf(row, x.key))), ...referenceValues(props.referenceLines)], integerTicks);
  return (
    <Frame
      {...props}
      domain={domain}
      draw={({ x, y }) =>
        series.map((x0, j) => {
          const color = paintOf(theme, x0.color, j);
          return (
            <G key={x0.key}>
              {runs(data, x0.key).map((run) => {
                const pts = run.map((i) => `${x(i)},${y(valueOf(data[i]!, x0.key))}`);
                const first = run[0]!;
                const last = run[run.length - 1]!;
                return (
                  <G key={first}>
                    {area && run.length > 1 && (
                      <Polygon points={`${x(first)},${y(0)} ${pts.join(' ')} ${x(last)},${y(0)}`} fill={color} opacity={0.15} />
                    )}
                    {run.length === 1 ? (
                      <Circle cx={x(first)} cy={y(valueOf(data[first]!, x0.key))} r={theme.tokens.spacing['0-5'] + 1} fill={color} />
                    ) : (
                      <Polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
                    )}
                  </G>
                );
              })}
            </G>
          );
        })
      }
    />
  );
}

// ─── BarChart ────────────────────────────────────────────────────────────────

/** Bars per category, grouped or stacked (web BarChart, vertical, on mobile). Negative values grow down from the zero line. */
export function BarChart<T extends object>({ stacked = false, colorOf, ...props }: BarChartProps<T>) {
  const theme = useTheme();
  const { data, series, integerTicks } = props;
  const totals = data.flatMap((row) => {
    const vals = series.map((x) => valueOf(row, x.key));
    if (!stacked) return vals;
    return [vals.filter((v) => v > 0).reduce((a, b) => a + b, 0), vals.filter((v) => v < 0).reduce((a, b) => a + b, 0)];
  });
  const domain = niceDomain([...totals, ...referenceValues(props.referenceLines)], integerTicks);
  return (
    <Frame
      {...props}
      domain={domain}
      draw={({ x, y, slot }) => {
        const groupW = slot * 0.7;
        const barW = stacked ? groupW : groupW / Math.max(1, series.length);
        return data.map((row, i) => {
          let up = 0;
          let down = 0;
          return (
            <G key={i}>
              {series.map((x0, j) => {
                if (rawValueOf(row, x0.key) == null) return null;
                const v = valueOf(row, x0.key);
                const from = stacked ? (v >= 0 ? up : down) : 0;
                const to = from + v;
                if (stacked) {
                  if (v >= 0) up = to;
                  else down = to;
                }
                // The group is centred on the category; side-by-side bars run from its start edge.
                const offset = stacked ? -groupW / 2 : -groupW / 2 + j * barW;
                const left = theme.dir === 'rtl' ? x(i) - offset - barW : x(i) + offset;
                return (
                  <Rect
                    key={x0.key}
                    x={left}
                    y={Math.min(y(from), y(to))}
                    width={Math.max(0, barW - (stacked ? 0 : 1))}
                    height={Math.abs(y(to) - y(from))}
                    fill={paintOf(theme, colorOf?.(row, x0, i) ?? x0.color, j)}
                  />
                );
              })}
            </G>
          );
        });
      }}
    />
  );
}
