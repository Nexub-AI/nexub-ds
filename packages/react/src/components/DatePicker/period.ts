import { dateValueGranularity, parseDateValue } from '@nexub/core';

/** 11.1: helpers for DatePicker `granularity="month" | "year"`, shared by the trigger placeholder and the grid. */

/** `'2026-03'` → { year: 2026, month: 2 }; `'2026'` → { year: 2026, month: 0 }. `undefined` if malformed. */
export function parsePeriod(value: string | undefined): { year: number; month: number } | undefined {
  // The value rules are @nexub/core's (shared with <nx-date-picker>); a day value isn't a period.
  const granularity = dateValueGranularity(value);
  const parts = granularity === 'month' || granularity === 'year' ? parseDateValue(value, granularity) : undefined;
  return parts ? { year: parts.year, month: parts.month } : undefined;
}

/** "March 2026" (month) or "2026" (year), in the locale. */
export function formatPeriod(granularity: 'month' | 'year', year: number, month: number, locale: string | undefined): string {
  if (granularity === 'year') return String(year);
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(year, month, 1)));
}
