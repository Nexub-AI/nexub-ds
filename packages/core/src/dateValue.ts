/**
 * Date values as strings, shared by `@nexub/react`'s DatePicker (`granularity="month" | "year"`)
 * and `@nexub/elements`' `<nx-date-picker>`. A value is `YYYY-MM-DD` (day), `YYYY-MM` (month) or
 * `YYYY` (year): no time and no time zone, so a date never shifts by a day across zones. These
 * are calendar-independent helpers (Gregorian calendar, plain arithmetic); the calendar grid
 * itself is not shared (the React day picker uses react-day-picker).
 */

/** How fine a date value is. */
export type DateGranularity = 'day' | 'month' | 'year';

/** A date value split up. `month` is 0–11 (as `Date`); `day` is 1-based. A month or year value has `month` 0 / `day` 1 where missing. */
export interface DateParts {
  year: number;
  month: number;
  day: number;
}

const DATE_VALUE = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/;
const RANK: Record<DateGranularity, number> = { year: 0, month: 1, day: 2 };
const pad = (n: number, width = 2) => String(n).padStart(width, '0');

/** Days in a month (`month` 0–11), leap years included. */
export function daysInMonth(year: number, month: number): number {
  // Day 0 of the next month is the last day of this one. setUTCFullYear keeps years 0–99 as they are.
  const d = new Date(0);
  d.setUTCFullYear(year, month + 1, 0);
  return d.getUTCDate();
}

/** The granularity a value is written at (`'2026'` → year), or `undefined` if it isn't a valid date value. */
export function dateValueGranularity(value: string | null | undefined): DateGranularity | undefined {
  const m = value ? DATE_VALUE.exec(value) : null;
  if (!m) return undefined;
  const g: DateGranularity = m[3] ? 'day' : m[2] ? 'month' : 'year';
  return parseDateValue(value, g) ? g : undefined;
}

/**
 * Parses a date value. With a `granularity`, the value must be written at exactly that
 * granularity (`'2026-03'` for month); without one, any of the three forms is read.
 * `undefined` when malformed or not a real date (`'2026-02-30'`, `'2026-13'`).
 */
export function parseDateValue(value: string | null | undefined, granularity?: DateGranularity): DateParts | undefined {
  const m = value ? DATE_VALUE.exec(value) : null;
  if (!m) return undefined;
  const written: DateGranularity = m[3] ? 'day' : m[2] ? 'month' : 'year';
  if (granularity && written !== granularity) return undefined;
  const year = Number(m[1]);
  const month = m[2] ? Number(m[2]) - 1 : 0;
  const day = m[3] ? Number(m[3]) : 1;
  if (month < 0 || month > 11 || day < 1 || day > daysInMonth(year, month)) return undefined;
  return { year, month, day };
}

/** `true` when `value` is a valid date value at `granularity`. */
export function isValidDateValue(value: string | null | undefined, granularity: DateGranularity = 'day'): boolean {
  return parseDateValue(value, granularity) !== undefined;
}

/** Writes parts as a value at `granularity`: `'2026-03-05'`, `'2026-03'` or `'2026'`. */
export function formatDateValue(parts: DateParts, granularity: DateGranularity = 'day'): string {
  const year = pad(parts.year, 4);
  if (granularity === 'year') return year;
  if (granularity === 'month') return `${year}-${pad(parts.month + 1)}`;
  return `${year}-${pad(parts.month + 1)}-${pad(parts.day)}`;
}

/**
 * Compares two dates at `granularity` (finer parts are ignored): negative when `a` is earlier,
 * 0 when they fall in the same day, month or year, positive when later.
 */
export function compareDateParts(a: DateParts, b: DateParts, granularity: DateGranularity = 'day'): number {
  const rank = RANK[granularity];
  if (a.year !== b.year) return a.year - b.year;
  if (rank >= 1 && a.month !== b.month) return a.month - b.month;
  if (rank >= 2 && a.day !== b.day) return a.day - b.day;
  return 0;
}

/**
 * Where `parts` sits against `min` and `max` (date values at any granularity), compared at
 * `granularity`: `min="2026-03-15"` allows the month `2026-03`. `'under'`, `'over'`, or
 * `undefined` when inside (a malformed bound is ignored).
 */
export function dateRangeStatus(
  parts: DateParts,
  min: string | null | undefined,
  max: string | null | undefined,
  granularity: DateGranularity = 'day',
): 'under' | 'over' | undefined {
  const lo = parseDateValue(min);
  const hi = parseDateValue(max);
  // A bound written coarser than the comparison (min="2026" for a day picker) starts or ends its period.
  const end = (p: DateParts, written: DateGranularity | undefined): DateParts =>
    written === 'year' ? { year: p.year, month: 11, day: 31 } : written === 'month' ? { ...p, day: daysInMonth(p.year, p.month) } : p;
  if (lo && compareDateParts(parts, lo, granularity) < 0) return 'under';
  if (hi && compareDateParts(parts, end(hi, dateValueGranularity(max)), granularity) > 0) return 'over';
  return undefined;
}

/** Day of the week, 0 (Sunday) – 6 (Saturday). */
export function weekdayOf({ year, month, day }: DateParts): number {
  const d = new Date(0);
  d.setUTCFullYear(year, month, day);
  return d.getUTCDay();
}

/** `parts` moved by `days` (negative to go back), across months and years. */
export function addDays({ year, month, day }: DateParts, days: number): DateParts {
  const d = new Date(0);
  d.setUTCFullYear(year, month, day + days);
  return { year: d.getUTCFullYear(), month: d.getUTCMonth(), day: d.getUTCDate() };
}

/** `parts` moved by `months`; the day is kept, or the month's last day when it has fewer (Jan 31 + 1 → Feb 28). */
export function addMonths({ year, month, day }: DateParts, months: number): DateParts {
  const total = year * 12 + month + months;
  const y = Math.floor(total / 12);
  const m = total - y * 12;
  return { year: y, month: m, day: Math.min(day, daysInMonth(y, m)) };
}

/** Today in the local time zone. */
export function todayParts(now: Date = new Date()): DateParts {
  return { year: now.getFullYear(), month: now.getMonth(), day: now.getDate() };
}

// Regions whose week starts on Sunday or Saturday, for engines without Intl.Locale week info
// (CLDR weekData). Everything else starts on Monday.
const SUNDAY_FIRST = new Set('AG AS BD BR BS BT BW BZ CA CN CO DM DO ET GT GU HK HN ID IL IN JM JP KE KH KR LA MH MM MO MT MX MZ NI NP PA PE PH PK PR PT PY SA SG SV TH TT TW UM US VE VI WS YE ZA ZW'.split(' '));
const SATURDAY_FIRST = new Set('AE AF BH DJ DZ EG IQ IR JO KW LY OM QA SD SY'.split(' '));

interface WeekInfo {
  firstDay: number;
}
type LocaleWithWeekInfo = Intl.Locale & { getWeekInfo?: () => WeekInfo; weekInfo?: WeekInfo };

/**
 * The first day of the week for a locale, 0 (Sunday) – 6 (Saturday): from `Intl.Locale`'s week
 * info where the engine has it (`getWeekInfo()` or the older `weekInfo`), else from the region
 * (`en-US` → Sunday, `de` → Monday, `ar-EG` → Saturday). An unknown locale starts on Monday.
 */
export function firstDayOfWeek(locale?: string): number {
  let loc: LocaleWithWeekInfo;
  try {
    loc = new Intl.Locale(locale ?? new Intl.DateTimeFormat().resolvedOptions().locale) as LocaleWithWeekInfo;
  } catch {
    return 1;
  }
  try {
    const info = typeof loc.getWeekInfo === 'function' ? loc.getWeekInfo() : loc.weekInfo;
    if (info && typeof info.firstDay === 'number') return info.firstDay % 7;
  } catch {
    // Fall through to the region table.
  }
  const region = loc.maximize().region ?? '';
  return SUNDAY_FIRST.has(region) ? 0 : SATURDAY_FIRST.has(region) ? 6 : 1;
}
