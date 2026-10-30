// Hermes on iOS lacks Intl.NumberFormat#resolvedOptions / #formatToParts; the
// @nexub/core money helpers must give the same answers from format() alone.
import { currencySymbol, fractionDigits, parseMoney } from '@nexub/core';

const proto = Intl.NumberFormat.prototype as unknown as Record<string, unknown>;
const saved = { resolvedOptions: proto.resolvedOptions, formatToParts: proto.formatToParts };

const cases = () => ({
  usd: fractionDigits('USD', 'en-US'),
  jpy: fractionDigits('JPY', 'ja-JP'),
  kwd: fractionDigits('KWD', 'en-US'),
  eur: currencySymbol('EUR', 'de-DE'),
  de: parseMoney('1.234,5', 'EUR', 'de-DE'),
  en: parseMoney('1,234.56', 'USD', 'en-US'),
});

it('fallbacks match the full Intl implementation', () => {
  const full = cases();
  delete proto.resolvedOptions;
  delete proto.formatToParts;
  try {
    expect(cases()).toEqual(full);
    expect(full).toEqual({ usd: 2, jpy: 0, kwd: 3, eur: '€', de: 1234.5, en: 1234.56 });
  } finally {
    Object.assign(proto, saved);
  }
});
