import * as React from 'react';
import { AccessibilityInfo, ActivityIndicator, Platform, View, type StyleProp, type ViewStyle } from 'react-native';
import {
  dateRangeStatus,
  formatDateValue,
  parseDateValue,
  todayParts,
  type ControlSize,
  type DateParts,
} from '@nexub/core';
import { Calendar, ChevronLeft, ChevronRight, Clock, X, type NativeIconProps } from '@nexub/icons/native';
import { useControllableState } from '../hooks/useControllableState';
import { Pressable } from '../primitives/Pressable';
import { Surface } from '../primitives/Surface';
import { Text } from '../primitives/Text';
import { useTheme } from '../theme/ThemeProvider';
import { Button, IconButton } from './actions';
import { Chip } from './inputs';
import { BottomSheet } from './overlays';
import { controlHeight, disabledOpacity } from './shared';

// ─── DateTimeField ───────────────────────────────────────────────────────────

let Picker: typeof import('@react-native-community/datetimepicker') | undefined;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- optional peer, must not fail when absent
  Picker = require('@react-native-community/datetimepicker');
} catch {
  Picker = undefined;
}

/**
 * One rule for days that can't be picked: a day, a test, weekdays (`{ dayOfWeek: [0, 6] }`,
 * 0 is Sunday), or every day before or after a day. As web DatePicker `disabledDates`.
 */
export type DateMatcher = Date | ((date: Date) => boolean) | { dayOfWeek: number[] } | { before: Date } | { after: Date };

/**
 * DateTimeField `onValueChange` in the date, time and datetime modes: a `Date`, or `null` when
 * cleared. Written so a handler that only takes a `Date` (`(d: Date) => void`), or a
 * `useState<Date | null>` setter, still fits.
 */
export type DateTimeFieldChangeHandler = {
  bivarianceHack(value: Date | null): void;
}['bivarianceHack'];

interface DateTimeFieldBaseProps {
  /** Visible label above the field; also its accessible name and the picker sheet's title. */
  label: string;
  /** What the platform picker edits. 11.8: `'datetime'` picks a date and then a time in one field. @default 'date' */
  mode?: 'date' | 'time' | 'datetime';
  /** Earliest date the picker allows. With month or year granularity, earlier months or years are disabled. */
  minDate?: Date;
  /** Latest date the picker allows. With month or year granularity, later months or years are disabled. */
  maxDate?: Date;
  /** Text shown while empty. @default messages.pickDate (pickMonth / pickYear for those granularities) */
  placeholder?: string;
  /** 11.8: dimmed, can't be opened or cleared, and read as disabled. */
  disabled?: boolean;
  /** 11.8: shows the value, but the picker can't open and the value can't be cleared. Still focusable. */
  readOnly?: boolean;
  /** 11.8: red outline, and the field is marked invalid for screen readers. Give `error` for a message too. */
  invalid?: boolean;
  /** 11.8: error message under the field: red outline, announced, read as the field's hint. */
  error?: string;
  /** 11.8: field height (the TextField sizes). @default 'lg' */
  size?: Extract<ControlSize, 'md' | 'lg' | 'xl'>;
  /** 11.8: BCP 47 locale for the field's text and the iOS picker. @default the provider's locale */
  locale?: string;
  /**
   * 11.8: days that can't be picked: one rule or a list (see `DateMatcher`), as web. The platform
   * picker can't grey days out, so picking one keeps the old value and says the day is unavailable.
   * Presets on such days are disabled.
   */
  disabledDates?: DateMatcher | DateMatcher[];
  /**
   * 11.8: quick picks shown as chips under the field (Today, Tomorrow…); a tap sets the value.
   * In datetime mode the time of the current value (or `defaultTime`) is kept. Not for time mode
   * or month and year granularity.
   */
  presets?: { label: string; date: Date }[];
  /** 11.8: minutes between choices in time and datetime modes. iOS uses it as the wheel's interval; elsewhere the picked time is rounded to it. @default 1 */
  minuteStep?: number;
  /** 11.8: a clear button inside the field while it has a value; clearing calls `onValueChange(null)`. */
  clearable?: boolean;
  /** 11.8: spinner at the end of the field, and busy for screen readers. */
  loading?: boolean;
  /** 11.8: 24-hour `"HH:mm"` time a date gets when it is picked before any time (date and datetime modes). @default '09:00' */
  defaultTime?: string;
  /**
   * 11.8: IANA time zone (`'Europe/Paris'`) the value is shown and picked in, with its name under
   * the field. The value is still an instant (`Date`).
   */
  timeZone?: string;
  /** 11.8: icon at the start of the field. @default Calendar (Clock in time mode) */
  leadingIcon?: React.ComponentType<NativeIconProps>;
  /** 11.8: icon at the end of the field. */
  trailingIcon?: React.ComponentType<NativeIconProps>;
  /** 11.8: text or a node at the start of the field, e.g. "From". A string is read with the value. */
  leadingAddon?: React.ReactNode;
  /** 11.8: text or a node at the end of the field, e.g. "local time". A string is read with the value. */
  trailingAddon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const MINUTE_INTERVALS = [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30] as const;
type MinuteInterval = (typeof MINUTE_INTERVALS)[number];
const isMinuteInterval = (n: number): n is MinuteInterval => (MINUTE_INTERVALS as readonly number[]).includes(n);

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

const withTime = (d: Date, time: string) => {
  const [h = 0, m = 0] = time.split(':').map(Number);
  const next = new Date(d);
  next.setHours(h, m, 0, 0);
  return next;
};
const pad = (n: number) => String(n).padStart(2, '0');
const timeOf = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

/** The time rounded to the nearest `step` minutes (59 with a step of 15 is the next hour). */
function roundToMinuteStep(d: Date, step: number): Date {
  if (!(step > 1)) return d;
  const next = new Date(d);
  next.setMinutes(Math.round(next.getMinutes() / step) * step, 0, 0);
  return next;
}

/** `true` when `date` matches one of the rules. */
function matchesDate(date: Date, rules: DateMatcher | DateMatcher[] | undefined): boolean {
  if (!rules) return false;
  return (Array.isArray(rules) ? rules : [rules]).some((rule) => {
    if (rule instanceof Date) return startOfDay(rule) === startOfDay(date);
    if (typeof rule === 'function') return rule(date);
    if ('dayOfWeek' in rule) return rule.dayOfWeek.includes(date.getDay());
    if ('before' in rule) return startOfDay(date) < startOfDay(rule.before);
    return startOfDay(date) > startOfDay(rule.after);
  });
}

/** A day value as a `Date`: a `Date` as is, `'YYYY-MM-DD'` at `time`, anything else `null`. */
function toDate(value: Date | string | null | undefined, time: string): Date | null {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  const p = typeof value === 'string' ? parseDateValue(value) : undefined;
  return p ? withTime(new Date(p.year, p.month, p.day), time) : null;
}

/** A month or year value as parts: `'2026-03'`, `'2026'`, or a `Date`. */
function toPeriod(value: Date | string | null | undefined, granularity: 'month' | 'year'): DateParts | undefined {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? undefined : todayParts(value);
  return typeof value === 'string' ? parseDateValue(value, granularity) : undefined;
}

/** "March 2026" (month) or "2026" (year), in the locale. As web PeriodPicker. */
function formatPeriod(granularity: 'month' | 'year', { year, month }: DateParts, locale: string): string {
  if (granularity === 'year') return String(year);
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(year, month, 1)),
  );
}

/** Intl with `timeZone`, or without it when the engine doesn't know the zone. */
function dateFormat(locale: string, options: Intl.DateTimeFormatOptions, timeZone?: string) {
  try {
    return new Intl.DateTimeFormat(locale, timeZone ? { ...options, timeZone } : options);
  } catch {
    return new Intl.DateTimeFormat(locale, options);
  }
}

/** The zone's short name at `at` ("GMT+1", "PST"), or the IANA name. */
function zoneName(zone: string, locale: string, at: Date): string {
  try {
    const parts = new Intl.DateTimeFormat(locale, { timeZone: zone, timeZoneName: 'short' }).formatToParts(at);
    return parts.find((p) => p.type === 'timeZoneName')?.value ?? zone;
  } catch {
    return zone;
  }
}

/** The date, time and datetime modes: the value is a `Date`. */
export interface DateTimeFieldProps extends DateTimeFieldBaseProps {
  /** The value; `null` is empty. A `'YYYY-MM-DD'` string is read too. Leave it out for an uncontrolled field. */
  value?: Date | string | null;
  /** 11.8: the starting value of an uncontrolled field, in the same shape as `value`. */
  defaultValue?: Date | string | null;
  /** Called with the new `Date`, or `null` when cleared. */
  onValueChange?: DateTimeFieldChangeHandler;
  /** 11.8: `'month'` or `'year'` picks a whole month or year instead: see DateTimeFieldPeriodProps. @default 'day' */
  granularity?: 'day';
}

/** 11.8: a whole month or year, picked from a grid in a sheet (the platform picker has no such mode). */
export interface DateTimeFieldPeriodProps extends DateTimeFieldBaseProps {
  /** `'2026-03'` for a month, `'2026'` for a year, so it never carries a day or a time zone. `mode` is ignored. */
  granularity: 'month' | 'year';
  /** The value as a `'YYYY-MM'` or `'YYYY'` string (a `Date` is read too); `null` is empty. */
  value?: string | Date | null;
  /** The starting value of an uncontrolled field, in the same shape as `value`. */
  defaultValue?: string | Date | null;
  /** Called with the new `'YYYY-MM'` / `'YYYY'` string, or `null` when cleared. */
  onValueChange?: (value: string | null) => void;
}

/**
 * A field that opens the platform picker (Android dialog, iOS inline calendar in a sheet), or a
 * month / year grid in a sheet with `granularity`. The twin of web DatePicker, TimePicker and
 * DateTimePicker. The date, time and datetime modes need @react-native-community/datetimepicker.
 */
export function DateTimeField({
  label,
  value: valueProp,
  defaultValue,
  onValueChange,
  mode = 'date',
  granularity = 'day',
  minDate,
  maxDate,
  placeholder,
  disabled = false,
  readOnly = false,
  invalid = false,
  error,
  size = 'lg',
  locale: localeProp,
  disabledDates,
  presets,
  minuteStep = 1,
  clearable = false,
  loading = false,
  defaultTime = '09:00',
  timeZone,
  leadingIcon,
  trailingIcon: Trail,
  leadingAddon,
  trailingAddon,
  style,
}: DateTimeFieldProps | DateTimeFieldPeriodProps) {
  const theme = useTheme();
  const { roles, tokens, messages } = theme;
  const locale = localeProp ?? theme.locale;
  const [open, setOpen] = React.useState(false);
  // The message after a pick on a disabled day.
  const [rejected, setRejected] = React.useState<string | null>(null);
  const [value, setValue] = useControllableState<Date | string | null>({
    value: valueProp,
    defaultValue: defaultValue ?? null,
    // Each variant's handler takes what that variant produces (a Date, or a period string).
    onChange: onValueChange as ((v: Date | string | null) => void) | undefined,
  });
  const period = granularity === 'month' || granularity === 'year' ? granularity : undefined;
  if (!period && !Picker)
    throw new Error(
      '@nexub/react-native: DateTimeField needs @react-native-community/datetimepicker (npx expo install @react-native-community/datetimepicker).',
    );

  const bad = invalid || !!error;
  const interactive = !disabled && !readOnly;
  const selected = period ? toPeriod(value, period) : undefined;
  const date = period ? null : toDate(value, defaultTime);
  const hasValue = period ? !!selected : !!date;

  const options: Intl.DateTimeFormatOptions =
    mode === 'time' ? { timeStyle: 'short' } : mode === 'datetime' ? { dateStyle: 'medium', timeStyle: 'short' } : { dateStyle: 'medium' };
  const format = (d: Date) => dateFormat(locale, options, timeZone).format(d);
  const formatDay = (d: Date) => dateFormat(locale, { dateStyle: 'medium' }, timeZone).format(d);
  const text = selected
    ? formatPeriod(period!, selected, locale)
    : date
      ? format(date)
      : (placeholder ?? (period === 'month' ? messages.pickMonth : period === 'year' ? messages.pickYear : messages.pickDate));
  const zone = timeZone && !period ? messages.timeZoneLabel(zoneName(timeZone, locale, date ?? new Date())) : undefined;

  const outOfRange = (d: Date) =>
    (minDate !== undefined && startOfDay(d) < startOfDay(minDate)) ||
    (maxDate !== undefined && startOfDay(d) > startOfDay(maxDate));
  const unavailable = (d: Date) => outOfRange(d) || matchesDate(d, disabledDates);

  // The picker's starting point when empty: today at `defaultTime` (time mode: now, on the step).
  const seed = date ?? (mode === 'time' ? roundToMinuteStep(new Date(), minuteStep) : withTime(new Date(), defaultTime));

  /** A disabled day keeps the old value; says why. */
  const reject = (d: Date) => {
    const message = messages.slotUnavailable(formatDay(d));
    setRejected(message);
    AccessibilityInfo.announceForAccessibility(message);
  };
  const commit = (d: Date) => {
    const next = mode === 'date' ? d : roundToMinuteStep(d, minuteStep);
    if (mode !== 'time' && matchesDate(next, disabledDates)) return reject(next);
    setRejected(null);
    setValue(next);
  };

  const show = () => {
    if (!interactive) return;
    if (period || Platform.OS !== 'android') return setOpen(true);
    const { DateTimePickerAndroid } = Picker!;
    const bounds = { minimumDate: minDate, maximumDate: maxDate, timeZoneName: timeZone };
    if (mode === 'datetime') {
      // Android has no datetime dialog: the date, then the time.
      DateTimePickerAndroid.open({
        ...bounds,
        value: seed,
        mode: 'date',
        onChange: (e, d) => {
          if (e.type !== 'set' || !d) return;
          if (matchesDate(d, disabledDates)) return reject(d);
          DateTimePickerAndroid.open({
            value: d,
            mode: 'time',
            timeZoneName: timeZone,
            onChange: (e2, t) => e2.type === 'set' && t && commit(t),
          });
        },
      });
    } else
      DateTimePickerAndroid.open({
        ...bounds,
        value: seed,
        mode,
        onChange: (e, d) => e.type === 'set' && d && commit(d),
      });
  };

  const clear = () => {
    setRejected(null);
    setValue(null);
  };
  const pickPreset = (d: Date) => {
    setRejected(null);
    setValue(mode === 'datetime' ? withTime(d, date ? timeOf(date) : defaultTime) : d);
  };

  const Lead = leadingIcon ?? (mode === 'time' && !period ? Clock : Calendar);
  const showClear = clearable && hasValue && interactive;
  const addonText = (n: React.ReactNode) => (typeof n === 'string' || typeof n === 'number' ? String(n) : undefined);
  const spoken = [addonText(leadingAddon), text, addonText(trailingAddon)].filter(Boolean).join(' ');
  const addon = (n: React.ReactNode) =>
    typeof n === 'string' || typeof n === 'number' ? (
      <Text variant="body-md" color="on-surface-variant">
        {n}
      </Text>
    ) : (
      n
    );
  const hint = error ?? rejected ?? undefined;
  const RNDateTimePicker = Picker?.default;

  return (
    <View style={[{ gap: tokens.spacing['1-5'], opacity: disabled ? disabledOpacity(theme) : 1 }, style]}>
      <Text variant="label-lg" color={bad ? 'error' : 'on-surface-variant'} importantForAccessibility="no">
        {label}
      </Text>
      <View
        style={{
          minHeight: controlHeight(theme, size),
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: tokens.shape.field,
          borderWidth: bad ? 2 : 1,
          borderColor: bad ? roles.error : roles.outline,
          backgroundColor: readOnly ? roles['surface-container-low'] : roles['surface-container-lowest'],
          overflow: 'hidden',
        }}
      >
        <Pressable
          accessibilityRole={readOnly ? 'text' : 'button'}
          accessibilityLabel={`${label}, ${spoken}`}
          accessibilityHint={hint}
          accessibilityState={{ disabled, busy: loading, expanded: interactive ? open : undefined }}
          aria-invalid={bad}
          disabled={disabled}
          onPress={show}
          pressScale={false}
          stateLayer={interactive ? 'on-surface' : false}
          style={{
            flex: 1,
            alignSelf: 'stretch',
            paddingHorizontal: tokens.spacing['3-5'],
            flexDirection: 'row',
            alignItems: 'center',
            gap: tokens.spacing[2],
          }}
        >
          {addon(leadingAddon)}
          <Lead size="sm" color={roles['on-surface-variant']} />
          <Text
            variant={size === 'md' ? 'body-md' : 'body-lg'}
            color={hasValue ? 'on-surface' : 'on-surface-muted'}
            numberOfLines={1}
            style={{ flexShrink: 1 }}
          >
            {text}
          </Text>
          <View style={{ flex: 1 }} />
          {loading && <ActivityIndicator size="small" color={roles['on-surface-variant']} />}
          {Trail && <Trail size="sm" color={roles['on-surface-variant']} />}
          {addon(trailingAddon)}
        </Pressable>
        {showClear && (
          <IconButton
            icon={X}
            label={messages.clear}
            size="xs"
            variant="text"
            onPress={clear}
            style={{ marginEnd: tokens.spacing[1] }}
          />
        )}
      </View>
      {!!presets?.length && !period && mode !== 'time' && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing[2] }}>
          {presets.map((p) => (
            <Chip
              key={p.label}
              label={p.label}
              disabled={!interactive || unavailable(p.date)}
              onPress={() => pickPreset(p.date)}
            />
          ))}
        </View>
      )}
      {(error || (rejected && !open)) && (
        <Text variant="body-sm" color="error" accessibilityLiveRegion="polite">
          {error ?? rejected}
        </Text>
      )}
      {zone && (
        <Text variant="body-sm" color="on-surface-variant">
          {zone}
        </Text>
      )}
      {period ? (
        <BottomSheet open={open} onOpenChange={setOpen} title={label}>
          <PeriodGrid
            granularity={period}
            selected={selected}
            locale={locale}
            minDate={minDate}
            maxDate={maxDate}
            onPick={(v) => {
              setValue(v);
              setOpen(false);
            }}
          />
        </BottomSheet>
      ) : (
        Platform.OS !== 'android' && RNDateTimePicker && (
          <BottomSheet open={open} onOpenChange={setOpen} title={label}>
            <Surface tone="surface-elevated">
              <RNDateTimePicker
                value={seed}
                mode={mode}
                display={mode === 'time' ? 'spinner' : 'inline'}
                minimumDate={minDate}
                maximumDate={maxDate}
                minuteInterval={isMinuteInterval(minuteStep) ? minuteStep : undefined}
                timeZoneName={timeZone}
                accentColor={roles.primary}
                themeVariant={theme.scheme}
                locale={locale}
                onChange={(_, d) => d && commit(d)}
              />
            </Surface>
            {rejected && (
              <Text variant="body-sm" color="error" accessibilityLiveRegion="polite">
                {rejected}
              </Text>
            )}
            <Button size="lg" fullWidth onPress={() => setOpen(false)}>
              {messages.close}
            </Button>
          </BottomSheet>
        )
      )}
    </View>
  );
}

// ─── Month / year grid ───────────────────────────────────────────────────────

const PER_PAGE = 12;

/**
 * Twelve months of a year, or a block of twelve years, as a 3 × 4 grid (as web PeriodPicker).
 * Month cells show the full month name; their accessible name adds the year ("March 2026"),
 * so it starts with the visible text.
 */
function PeriodGrid({
  granularity,
  selected,
  locale,
  minDate,
  maxDate,
  onPick,
}: {
  granularity: 'month' | 'year';
  selected: DateParts | undefined;
  locale: string;
  minDate: Date | undefined;
  maxDate: Date | undefined;
  onPick: (value: string) => void;
}) {
  const theme = useTheme();
  const { roles, tokens, messages, dir } = theme;
  const isMonth = granularity === 'month';
  const pageOf = (year: number) => (isMonth ? year : year - (((year % PER_PAGE) + PER_PAGE) % PER_PAGE));
  const [page, setPage] = React.useState(() => pageOf(selected?.year ?? new Date().getFullYear()));
  const step = isMonth ? 1 : PER_PAGE;
  const min = minDate ? formatDateValue(todayParts(minDate)) : undefined;
  const max = maxDate ? formatDateValue(todayParts(maxDate)) : undefined;
  const monthName = (month: number) =>
    new Intl.DateTimeFormat(locale, { month: 'long', timeZone: 'UTC' }).format(new Date(Date.UTC(2000, month, 1)));
  const cells: DateParts[] = Array.from({ length: PER_PAGE }, (_, i) =>
    isMonth ? { year: page, month: i, day: 1 } : { year: page + i, month: 0, day: 1 },
  );
  const rtl = dir === 'rtl';
  return (
    <View style={{ gap: tokens.spacing[3] }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <IconButton
          icon={rtl ? ChevronRight : ChevronLeft}
          label={isMonth ? messages.previousYear : messages.previousYears}
          onPress={() => setPage(page - step)}
        />
        <Text variant="title-md" accessibilityLiveRegion="polite" tabular>
          {isMonth ? String(page) : `${page} – ${page + PER_PAGE - 1}`}
        </Text>
        <IconButton
          icon={rtl ? ChevronLeft : ChevronRight}
          label={isMonth ? messages.nextYear : messages.nextYears}
          onPress={() => setPage(page + step)}
        />
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', rowGap: tokens.spacing[2] }}>
        {cells.map((p) => {
          const on = !!selected && selected.year === p.year && (!isMonth || selected.month === p.month);
          const off = dateRangeStatus(p, min, max, granularity) !== undefined;
          return (
            <View key={`${p.year}-${p.month}`} style={{ width: '33.333%', paddingHorizontal: tokens.spacing[1] }}>
              <Pressable
                accessibilityLabel={isMonth ? formatPeriod('month', p, locale) : String(p.year)}
                accessibilityState={{ selected: on, disabled: off }}
                disabled={off}
                haptic="selection"
                onPress={() => onPick(formatDateValue(p, granularity))}
                stateLayer={on ? 'on-primary' : 'on-surface'}
                style={{
                  height: controlHeight(theme, 'lg'),
                  borderRadius: tokens.shape.control,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: on ? roles.primary : 'transparent',
                  opacity: off ? disabledOpacity(theme) : 1,
                }}
              >
                <Text variant="label-lg" color={on ? 'on-primary' : 'on-surface'} numberOfLines={1} tabular={!isMonth}>
                  {isMonth ? monthName(p.month) : String(p.year)}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}
