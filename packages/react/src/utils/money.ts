// Locale-aware money formatting and parsing for Amount / MoneyInput.
// Everything goes through Intl.NumberFormat; no hand-rolled separators.

export function moneyFormatter(currency: string, locale?: string, options: Intl.NumberFormatOptions = {}) {
  return new Intl.NumberFormat(locale, { style: 'currency', currency, currencyDisplay: 'narrowSymbol', ...options });
}

/** The currency's fraction digits for this locale (JPY 0, USD 2, KWD 3). */
export function fractionDigits(currency: string, locale?: string): number {
  return moneyFormatter(currency, locale).resolvedOptions().maximumFractionDigits ?? 2;
}

/** The narrow symbol on its own, e.g. "$", "€", "₹". */
export function currencySymbol(currency: string, locale?: string): string {
  return moneyFormatter(currency, locale).formatToParts(0).find((p) => p.type === 'currency')?.value ?? currency;
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
  const decimal = new Intl.NumberFormat(locale).formatToParts(1.1).find((p) => p.type === 'decimal')?.value ?? '.';
  const group = new Intl.NumberFormat(locale).formatToParts(10000).find((p) => p.type === 'group')?.value;
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
