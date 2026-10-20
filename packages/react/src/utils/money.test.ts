import { describe, it, expect } from 'vitest';
import { currencySymbol, formatForDisplay, formatForEditing, fractionDigits, parseMoney } from './money.js';

describe('parseMoney', () => {
  it.each([
    ['1,234.56', 'USD', 'en-US', 1234.56],
    ['1234.5', 'USD', 'en-US', 1234.5],
    ['$ 1,234.56', 'USD', 'en-US', 1234.56],
    ['-12.50', 'USD', 'en-US', -12.5],
    ['−7', 'USD', 'en-US', -7],
    ['1.234,56', 'EUR', 'de-DE', 1234.56],
    ['1 234,5', 'EUR', 'fr-FR', 1234.5],
    ['12.345', 'USD', 'en-US', 12.35], // rounded to the currency's 2 digits
    ['1,999', 'JPY', 'ja-JP', 1999], // JPY has no minor unit
    ['0', 'USD', 'en-US', 0],
  ])('%s (%s, %s) → %s', (text, currency, locale, expected) => {
    expect(parseMoney(text, currency, locale)).toBe(expected);
  });

  it.each(['', '   ', 'abc', '-', '1.2.3'])('rejects %j', (text) => {
    expect(parseMoney(text, 'USD', 'en-US')).toBeNull();
  });
});

describe('formatting', () => {
  it('uses the currency minor unit', () => {
    expect(fractionDigits('USD', 'en-US')).toBe(2);
    expect(fractionDigits('JPY', 'ja-JP')).toBe(0);
    expect(formatForDisplay(1234.5, 'USD', 'en-US')).toBe('1,234.50');
    expect(formatForDisplay(1234.5, 'EUR', 'de-DE')).toBe('1.234,50');
  });

  it('edits without grouping and round-trips through parseMoney', () => {
    expect(formatForEditing(1234.5, 'EUR', 'de-DE')).toBe('1234,5');
    expect(parseMoney(formatForEditing(1234.5, 'EUR', 'de-DE'), 'EUR', 'de-DE')).toBe(1234.5);
    expect(parseMoney(formatForDisplay(-98765.43, 'USD', 'en-US'), 'USD', 'en-US')).toBe(-98765.43);
  });

  it('finds the narrow symbol', () => {
    expect(currencySymbol('USD', 'en-US')).toBe('$');
    expect(currencySymbol('EUR', 'de-DE')).toBe('€');
  });
});
