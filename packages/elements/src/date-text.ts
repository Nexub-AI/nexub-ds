import { dateValueGranularity, formatDateValue, parseDateValue, type DateGranularity, type DateParts } from '@nexub/core';

const RANK: Record<DateGranularity, number> = { year: 0, month: 1, day: 2 };

/** A `Date` at UTC midnight for parts (years 0–99 kept as written), to format with `timeZone: 'UTC'`. */
export function utcDate({ year, month, day }: DateParts): Date {
  const d = new Date(0);
  d.setUTCFullYear(year, month, day);
  return d;
}

const fmt = (locale: string | undefined, options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(locale, { timeZone: 'UTC', ...options });
const NUMERIC_DAY: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };

/** What the field shows: the locale's short numeric date (day), "March 2026" (month), "2026" (year). */
export function formatDisplay(parts: DateParts, granularity: DateGranularity, locale?: string): string {
  if (granularity === 'year') return String(parts.year);
  return fmt(locale, granularity === 'month' ? { year: 'numeric', month: 'long' } : NUMERIC_DAY).format(utcDate(parts));
}

/** The order of day, month and year in the locale's numeric date (`['month', 'day', 'year']` in en-US). */
function fieldOrder(locale?: string): ('year' | 'month' | 'day')[] {
  return fmt(locale, NUMERIC_DAY)
    .formatToParts(utcDate({ year: 2026, month: 0, day: 31 }))
    .map((p) => p.type)
    .filter((t): t is 'year' | 'month' | 'day' => t === 'year' || t === 'month' || t === 'day');
}

/** A format hint for the empty field: `mm/dd/yyyy`, `dd.mm.yyyy`, `mm/yyyy`, `yyyy`. */
export function formatHint(granularity: DateGranularity, locale?: string): string {
  if (granularity === 'year') return 'yyyy';
  const words = { year: 'yyyy', month: 'mm', day: 'dd' } as const;
  const options: Intl.DateTimeFormatOptions = granularity === 'month' ? { year: 'numeric', month: '2-digit' } : NUMERIC_DAY;
  return fmt(locale, options)
    .formatToParts(utcDate({ year: 2026, month: 0, day: 31 }))
    .map((p) => (p.type === 'year' || p.type === 'month' || p.type === 'day' ? words[p.type] : p.type === 'literal' ? p.value : ''))
    .join('')
    .trim();
}

/** Locale digits (Arabic-Indic, Devanagari …) as ASCII. */
function asciiDigits(text: string, locale?: string): string {
  const nf = new Intl.NumberFormat(locale, { useGrouping: false });
  let out = text;
  for (let i = 0; i <= 9; i++) {
    const d = nf.format(i);
    if (d !== String(i)) out = out.split(d).join(String(i));
  }
  return out;
}

/** The month (0–11) a word names in the locale (long or short, any case, a prefix of 3+ letters), or `undefined`. */
function monthOf(word: string, locale?: string): number | undefined {
  const clean = (s: string) => s.toLowerCase().replace(/\.$/, '');
  for (let m = 0; m < 12; m++) {
    const d = utcDate({ year: 2026, month: m, day: 1 });
    const names = [
      fmt(locale, { month: 'long' }).format(d),
      fmt(locale, { month: 'short' }).format(d),
      // The month as it appears in a date (genitive in some languages).
      fmt(locale, { day: 'numeric', month: 'long' }).formatToParts(d).find((p) => p.type === 'month')?.value ?? '',
    ].map(clean);
    if (names.some((n) => n === word || (word.length >= 3 && n.startsWith(word)))) return m;
  }
  return undefined;
}

/**
 * Reads what was typed into the field, at `granularity`: an ISO value (`2026-03-05`), the
 * locale's numeric order (`3/5/2026` in en-US, `5.3.2026` in de), a month name (`5 March 2026`,
 * `Mar 2026`), or a two-digit year (`26` → 2026). `undefined` when it isn't a real date.
 */
export function parseTypedDate(text: string, granularity: DateGranularity, locale?: string): DateParts | undefined {
  const t = asciiDigits(text.trim(), locale);
  if (!t) return undefined;
  const iso = parseDateValue(t);
  if (iso) return RANK[dateValueGranularity(t)!] >= RANK[granularity] ? iso : undefined;
  let month: number | undefined;
  const numbers: string[] = [];
  for (const token of t.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean)) {
    if (/^\d+$/.test(token)) numbers.push(token);
    else {
      const m = monthOf(token, locale);
      if (m === undefined || month !== undefined) return undefined;
      month = m;
    }
  }
  const wanted = fieldOrder(locale).filter((f) => f === 'year' || (f === 'month' && granularity !== 'year' && month === undefined) || (f === 'day' && granularity === 'day'));
  if (numbers.length !== wanted.length) return undefined;
  const at = (f: 'year' | 'month' | 'day') => numbers[wanted.indexOf(f)] ?? '';
  const y = at('year');
  const parts: DateParts = {
    year: y.length <= 2 ? 2000 + Number(y) : Number(y),
    month: month ?? (granularity === 'year' ? 0 : Number(at('month')) - 1),
    day: granularity === 'day' ? Number(at('day')) : 1,
  };
  // Through the value format, so Feb 30 or month 13 is rejected.
  return parseDateValue(formatDateValue(parts, granularity), granularity);
}
