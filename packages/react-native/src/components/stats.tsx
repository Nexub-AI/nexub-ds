import * as React from 'react';
import { View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import Svg, { Polyline } from 'react-native-svg';
import type { CategoryColor } from '@nexub/core';
import { Minus, TrendingDown, TrendingUp, type NativeIconProps } from '@nexub/icons/native';
import type { NativeTypeRole } from '@nexub/tokens/native';
import { Pressable } from '../primitives/Pressable';
import { Surface } from '../primitives/Surface';
import { Text } from '../primitives/Text';
import { useTheme, type RoleName } from '../theme/ThemeProvider';
import { nxSpring, useSpringValue } from '../theme/motion';
import { IconChip, categoryPalette } from './display';
import { Skeleton } from './feedback';

// ─── NumberTicker ────────────────────────────────────────────────────────────

export interface NumberTickerProps extends Omit<ViewProps, 'children'> {
  /** A number (formatted with `format` / `locale`) or an already-formatted string. */
  value: number | string;
  format?: Intl.NumberFormatOptions;
  /** BCP 47 locale. @default the provider's */
  locale?: string;
  /** Roll digits when the value changes. Off, or under Reduce Motion, the new value just appears. @default true */
  animate?: boolean;
  /** Announce changes to screen readers (web `aria-live="polite"`). @default false */
  live?: boolean;
  /** Type role. @default 'body-md' */
  variant?: NativeTypeRole;
  /** Colour role. @default 'on-surface' */
  color?: RoleName;
}

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const isDigit = (c: string) => c >= '0' && c <= '9';
// Hebrew/Arabic letters and the RLM/ALM marks Intl puts in RTL-locale formats.
const RTL = /[\u0590-\u08FF\u200F\u061C\uFB1D-\uFDFF\uFE70-\uFEFF]/;

function Digit({
  digit,
  height,
  variant,
  color,
}: {
  digit: number;
  height: number;
  variant: NativeTypeRole;
  color: RoleName;
}) {
  // Starts at its value (no roll on mount), then springs to each new one.
  const y = useSpringValue(-digit * height, 'spatial', 'default');
  const strip = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  return (
    <View style={{ height, overflow: 'hidden' }}>
      {/* In flow for the width; the strip rides over it. */}
      <Text variant={variant} tabular style={{ opacity: 0 }}>
        0
      </Text>
      <Animated.View style={[{ position: 'absolute', top: 0, left: 0, right: 0, alignItems: 'center' }, strip]}>
        {DIGITS.map((d) => (
          <Text key={d} variant={variant} color={color} tabular style={{ height }}>
            {d}
          </Text>
        ))}
      </Animated.View>
    </View>
  );
}

/**
 * A rolling number: each digit is a 0–9 strip that slides to its value on the
 * spatial spring; separators, symbols and signs stay static. The first render
 * shows the value as-is; only later changes animate. Screen readers get the
 * whole value as one label. Same idea and props as web `NumberTicker`.
 */
export function NumberTicker({
  value,
  format,
  locale,
  animate = true,
  live = false,
  variant = 'body-md',
  color = 'on-surface',
  style,
  ...rest
}: NumberTickerProps) {
  const theme = useTheme();
  const text =
    typeof value === 'number'
      ? new Intl.NumberFormat(locale ?? theme.locale, format).format(value)
      : value;
  // The height of one line at the user's text size, measured (Dynamic Type curves are the OS's).
  const [height, setHeight] = React.useState(0);
  // ponytail: text with RTL letters or marks (e.g. 'ar' currency formats) is shown
  // without the roll; isolate digit runs like web if an RTL product needs it.
  const roll = animate && !theme.reducedMotion && height > 0 && !RTL.test(text);
  const chars = Array.from(text);
  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={text}
      accessibilityLiveRegion={live ? 'polite' : 'none'}
      // Digits read left to right in every locale.
      style={[{ flexDirection: 'row', direction: 'ltr', alignSelf: 'flex-start' }, style]}
      {...rest}
    >
      <Text
        variant={variant}
        tabular
        onLayout={(e) => setHeight(e.nativeEvent.layout.height)}
        style={{ position: 'absolute', opacity: 0 }}
      >
        0
      </Text>
      {roll ? (
        chars.map((char, i) => {
          // Keyed from the right so the ones digit keeps its strip as the number grows.
          const key = `${chars.length - 1 - i}${isDigit(char) ? 'd' : `s${char}`}`;
          return isDigit(char) ? (
            <Digit key={key} digit={Number(char)} height={height} variant={variant} color={color} />
          ) : (
            <Text key={key} variant={variant} color={color} tabular>
              {char}
            </Text>
          );
        })
      ) : (
        <Text variant={variant} color={color} tabular>
          {text}
        </Text>
      )}
    </View>
  );
}

// ─── StatCard ────────────────────────────────────────────────────────────────

export interface StatCardProps extends Omit<ViewProps, 'children'> {
  label: string;
  /** A number or string (rolls with `animate`), or any node. */
  value: React.ReactNode;
  /** The change, already formatted: "+12.5%". */
  delta?: string;
  /** Direction of the change: sets the arrow (and, by default, the colour). @default 'neutral' */
  deltaType?: 'increase' | 'decrease' | 'neutral';
  /**
   * Whether the change is good or bad, independent of its direction: churn going
   * down is `deltaType="decrease"` + `sentiment="positive"`.
   * @default derived from `deltaType`
   */
  sentiment?: 'positive' | 'negative' | 'neutral';
  /** One icon element, e.g. `<Wallet />`. */
  icon?: React.ReactElement<NativeIconProps>;
  /** Puts the icon on a tinted chip of this colour, and colours the trend line to match. */
  category?: CategoryColor;
  /** Recent values, drawn as a small trend line beside the delta. */
  trend?: number[];
  /** Accessible summary of the trend, e.g. "Last 12 weeks, rising". Without it the line is decorative. */
  trendLabel?: string;
  description?: string;
  /** Roll digits when a number/string `value` changes (NumberTicker); announced politely. */
  animate?: boolean;
  /** Skeletons in place of the value and the line under it; the card keeps its size. */
  loading?: boolean;
  /** Makes the whole card one pressable target (opens the detail). */
  onPress?: () => void;
  /** `sm` is the compact tile: less padding and a smaller value. @default 'md' */
  size?: 'md' | 'sm';
  /** An extra line inside the tile, under the change, e.g. "Includes 2 refunds". */
  note?: React.ReactNode;
  /**
   * `bad-when-high` flips the derived colour (an increase shows the danger colour), for
   * costs, churn and errors. `sentiment` still wins. @default 'default'
   */
  tone?: 'default' | 'bad-when-high';
  /**
   * The change as a number. Sets the arrow from its sign and the text from `changeFormat`
   * (ignored when `delta` is set). Percent takes a fraction: 0.125 is "+12.5%".
   */
  change?: number;
  /** How `change` is written. `absolute` adds the sign to the number. @default 'percent' */
  changeFormat?: 'percent' | 'absolute' | ((change: number) => string);
  /** Text after the change, e.g. "vs last month". */
  changeLabel?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const sign = (n: number) => (n > 0 ? '+' : n < 0 ? '−' : '');
function formatChange(n: number, format: StatCardProps['changeFormat'] = 'percent', locale?: string) {
  if (typeof format === 'function') return format(n);
  return format === 'absolute'
    ? `${sign(n)}${Math.abs(n).toLocaleString(locale)}`
    : `${sign(n)}${Math.abs(n * 100).toFixed(1)}%`;
}

const SENTIMENT_ROLE = {
  positive: 'success',
  negative: 'error',
  neutral: 'on-surface-muted',
} as const satisfies Record<string, RoleName>;
const DELTA_ICON = { increase: TrendingUp, decrease: TrendingDown, neutral: Minus } as const;

/** A small trend line. Values map to the box: the latest is at the end edge. */
function Trend({ values, color, label }: { values: number[]; color: string; label?: string }) {
  const { tokens } = useTheme();
  const w = tokens.spacing[20];
  const h = tokens.spacing[6];
  const pad = tokens.spacing.px; // room for the stroke at the extremes
  const min = Math.min(...values);
  const span = Math.max(...values) - min || 1;
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - pad - ((v - min) / span) * (h - 2 * pad);
      return `${+x.toFixed(1)},${+y.toFixed(1)}`;
    })
    .join(' ');
  return (
    <View
      accessible={!!label}
      accessibilityRole={label ? 'image' : undefined}
      accessibilityLabel={label}
      accessibilityElementsHidden={!label}
      importantForAccessibility={label ? 'yes' : 'no-hide-descendants'}
      style={{ marginStart: 'auto' }}
    >
      <Svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <Polyline points={points} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </View>
  );
}

/**
 * One metric: label, value, change and an optional trend. With `onPress` the
 * card is a button; under `expression="vivid"` it lifts a little while pressed.
 * Same props as the web `StatCard` pattern.
 */
export function StatCard({
  label,
  value,
  delta: deltaProp,
  deltaType: deltaTypeProp,
  sentiment,
  size = 'md',
  note,
  tone: toneProp = 'default',
  change,
  changeFormat,
  changeLabel,
  icon,
  category,
  trend,
  trendLabel,
  description,
  animate = false,
  loading = false,
  onPress,
  accessibilityLabel,
  style,
  ...rest
}: StatCardProps) {
  const theme = useTheme();
  const { roles, tokens } = theme;
  const delta = deltaProp ?? (change === undefined ? undefined : formatChange(change, changeFormat, theme.locale));
  const deltaType =
    deltaTypeProp ??
    (change === undefined || deltaProp !== undefined ? 'neutral' : change > 0 ? 'increase' : change < 0 ? 'decrease' : 'neutral');
  const up = toneProp === 'bad-when-high' ? 'negative' : 'positive';
  const down = toneProp === 'bad-when-high' ? 'positive' : 'negative';
  const tone = sentiment ?? (deltaType === 'increase' ? up : deltaType === 'decrease' ? down : 'neutral');
  const deltaRole = SENTIMENT_ROLE[tone];
  const DeltaIcon = DELTA_ICON[deltaType];
  const plain = typeof value === 'number' || typeof value === 'string';
  const compact = size === 'sm';
  const valueVariant = compact ? 'headline-sm' : 'headline-md';
  const valueType = tokens.type[valueVariant];
  const shows = (node: React.ReactNode) => node != null && node !== false;

  // Vivid: a soft lift while pressed (web lifts stat cards on hover).
  const vivid = theme.expression === 'vivid' && !!onPress;
  const lift = useSharedValue(0);
  const lifted = useAnimatedStyle(() => ({
    transform: [{ translateY: -tokens.spacing['0-5'] * lift.value }],
  }));
  const press = (to: number) => () => {
    if (vivid && !theme.reducedMotion) lift.value = withSpring(to, nxSpring('spatial', 'fast'));
  };

  const card = (
    <Surface
      tone="surface-elevated"
      radius="container"
      elevation={vivid ? 1 : 0}
      accessibilityState={loading ? { busy: true } : undefined}
      style={[
        {
          padding: tokens.spacing[compact ? 3 : 4],
          gap: tokens.spacing[compact ? 2 : 3],
          borderWidth: 1,
          borderColor: roles['outline-variant'] + '99', // 60%, as web
        },
        !onPress && style,
      ]}
      {...(onPress ? {} : { accessibilityLabel, ...rest })}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: tokens.spacing[2] }}>
        <Text variant="body-sm" color="on-surface-muted" style={{ flexShrink: 1 }}>
          {label}
        </Text>
        {icon &&
          (category ? (
            <IconChip category={category} size="sm">
              {icon}
            </IconChip>
          ) : (
            React.cloneElement(icon, {
              color: icon.props.color ?? roles['on-surface-muted'],
              size: icon.props.size ?? 'md',
            })
          ))}
      </View>

      {/* Keeps the value's line height while loading, so the card does not jump. */}
      <View style={{ minHeight: valueType.lineHeight, justifyContent: 'center' }}>
        {loading ? (
          <Skeleton width={tokens.spacing[24]} height={tokens.spacing[7]} />
        ) : plain ? (
          <NumberTicker value={value} variant={valueVariant} animate={animate} live={animate} />
        ) : (
          value
        )}
      </View>

      {(delta || description || shows(changeLabel) || trend) && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: tokens.spacing[2],
            opacity: loading ? 0 : 1,
          }}
        >
          {delta && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: tokens.spacing[1] }}>
              <DeltaIcon size="xs" color={roles[deltaRole]} />
              <Text variant="label-sm" color={deltaRole} tabular>
                {delta}
              </Text>
            </View>
          )}
          {shows(changeLabel) &&
            (typeof changeLabel === 'string' || typeof changeLabel === 'number' ? (
              <Text variant="label-sm" color="on-surface-muted" style={{ flexShrink: 1 }}>
                {changeLabel}
              </Text>
            ) : (
              changeLabel
            ))}
          {description && (
            <Text variant="label-sm" color="on-surface-muted" style={{ flexShrink: 1 }}>
              {description}
            </Text>
          )}
          {trend && trend.length > 1 && (
            <Trend values={trend} label={trendLabel} color={categoryPalette(theme, category ?? 'blue').color} />
          )}
        </View>
      )}

      {shows(note) && (
        <View style={{ opacity: loading ? 0 : 1 }}>
          {typeof note === 'string' || typeof note === 'number' ? (
            <Text variant="body-sm" color="on-surface-muted">
              {note}
            </Text>
          ) : (
            note
          )}
        </View>
      )}
    </Surface>
  );

  if (!onPress) return card;
  return (
    <Animated.View style={[lifted, style]} {...rest}>
      <Pressable
        accessibilityLabel={
          accessibilityLabel ??
          [
            label,
            plain ? String(value) : undefined,
            delta,
            typeof changeLabel === 'string' ? changeLabel : undefined,
            description,
            typeof note === 'string' ? note : undefined,
          ]
            .filter(Boolean)
            .join(', ')
        }
        onPress={onPress}
        onPressIn={press(1)}
        onPressOut={press(0)}
        pressScale={vivid ? false : undefined}
        style={{ borderRadius: tokens.shape.container }}
      >
        {card}
      </Pressable>
    </Animated.View>
  );
}
