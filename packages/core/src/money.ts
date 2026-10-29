// Locale-aware money formatting and parsing for Amount / MoneyInput.
// Everything goes through Intl.NumberFormat; no hand-rolled separators.
// Hermes on iOS has format() but not every Intl method (resolvedOptions,
// formatToParts), so each read has a fallback that derives the same fact from
// format() output. Browsers and Hermes on Android take the first branch.

/** The part of `n` formatted by `fmt` that has `type`, from formatToParts or format(). */
function part(fmt: Intl.NumberFormat, n: number, type: 'decimal' | 'group'): string | undefined {
  if (typeof fmt.formatToParts === 'function') return fmt.formatToParts(n).find((p) => p.type === type)?.value;
  // The separator is the non-digit run between digits: 1.1 → ".", 10000 → ",".
  return /\p{Nd}([^\p{Nd}]+)\p{Nd}/u.exec(fmt.format(n))?.[1];
}

export function moneyFormatter(currency: string, locale?: string, options: Intl.NumberFormatOptions = {}) {
  return new Intl.NumberFormat(locale, { style: 'currency', currency, currencyDisplay: 'narrowSymbol', ...options });
}

/** The currency's fraction digits for this locale (JPY 0, USD 2, KWD 3). */
export function fractionDigits(currency: string, locale?: string): number {
  const fmt = moneyFormatter(currency, locale);
  if (typeof fmt.resolvedOptions === 'function') return fmt.resolvedOptions().maximumFractionDigits ?? 2;
  // "$0.00" → 2, "¥0" → 0, "KWD 0.000" → 3: the digit run after the first one.
  const runs = fmt.format(0).match(/\p{Nd}+/gu) ?? [];
  return runs.length > 1 ? runs[runs.length - 1]!.length : 0;
}

/** The narrow symbol on its own, e.g. "$", "€", "₹". */
export function currencySymbol(currency: string, locale?: string): string {
  const fmt = moneyFormatter(currency, locale);
  if (typeof fmt.formatToParts === 'function')
    return fmt.formatToParts(0).find((p) => p.type === 'currency')?.value ?? currency;
  const symbol = fmt.format(0).replace(/[\p{Nd}\s.,\u00a0\u202f\u066b\u066c'’-]/gu, '');
  return symbol || currency;
}

/** Plain number text for editing: locale decimal separator, no grouping, no symbol. */
export function formatForEditing(value: number, currency: string, locale?: string): string {
  return new Intl.NumberFormat(locale, {
    useGrouping: false,
    maximumFractionDigits: fractionDigits(currency, locale),
  }).format(value);
}

/** Display text: grouping and the currency's full fraction digits, no symbol. */
export function formatForDisplay(value: number, currency: string, locale?: string): string {
  const digits = fractionDigits(currency, locale);
  return new Intl.NumberFormat(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);
}

/**
 * Parses what a person typed into a number, or null when empty/unparseable.
 * The locale's grouping separators are dropped and its decimal separator marks
 * the fraction (so in de-DE "1.234,5" is 1234.5). Rounds to the currency's
 * fraction digits.
 */
export function parseMoney(text: string, currency: string, locale?: string): number | null {
  const plain = new Intl.NumberFormat(locale);
  const decimal = part(plain, 1.1, 'decimal') ?? '.';
  const group = part(plain, 10000, 'group');
  let s = text.trim().replace(/[\s\u00a0\u202f]/g, '');
  if (group && group !== decimal) s = s.split(group).join('');
  s = s.replace(decimal, '.').replace(/[−–]/g, '-').replace(/[^0-9.-]/g, '');
  const negative = s.startsWith('-');
  s = s.replace(/-/g, '');
  if (!/\d/.test(s) || (s.match(/\./g) ?? []).length > 1) return null;
  const n = Number(s);
  if (!Number.isFinite(n)) return null;
  const f = 10 ** fractionDigits(currency, locale);
  return (negative ? -1 : 1) * (Math.round(n * f) / f);
}
