// The shared field rules in @nexub/core (number.ts, dateValue.ts). Core has no test runner, so
// they are tested here, where the elements use them; @nexub/react's NumberInput and DatePicker
// tests cover the same rules through the React fields.
import { describe, it, expect } from 'vitest';
import {
  addDays,
  addMonths,
  clampNumber,
  compareDateParts,
  dateRangeStatus,
  dateValueGranularity,
  daysInMonth,
  defaultMessages,
  firstDayOfWeek,
  formatDateValue,
  formatNumberValue,
  isNumberDraft,
  isValidDateValue,
  numberKeyTarget,
  numberStepSize,
  parseDateValue,
  parseNumberDraft,
  stepNumber,
  todayParts,
  weekdayOf,
} from '@nexub/core';
import { labels } from './messages.js';

describe('number rules', () => {
  it('keeps half-typed drafts and rejects letters or a second point', () => {
    for (const ok of ['', '-', '+', '2.', '.5', '1,5', '-0.25', '12']) expect(isNumberDraft(ok)).toBe(true);
    for (const bad of ['a', '1.2.3', '1-', '--1', '1e3', '1 2']) expect(isNumberDraft(bad)).toBe(false);
  });

  it('parses a draft only once it is a number', () => {
    expect(parseNumberDraft('')).toBeUndefined();
    expect(parseNumberDraft('-')).toBeUndefined();
    expect(parseNumberDraft('.')).toBeUndefined();
    expect(parseNumberDraft('2.')).toBe(2);
    expect(parseNumberDraft('1,5')).toBe(1.5);
    expect(parseNumberDraft(' -3 ')).toBe(-3);
    expect(parseNumberDraft('Infinity')).toBeUndefined();
  });

  it('formats with and without precision, empty for null', () => {
    expect(formatNumberValue(null)).toBe('');
    expect(formatNumberValue(2.5)).toBe('2.5');
    expect(formatNumberValue(2.5, 2)).toBe('2.50');
  });

  it('clamps to either bound', () => {
    expect(clampNumber(5, 10)).toBe(10);
    expect(clampNumber(50, undefined, 20)).toBe(20);
    expect(clampNumber(15, 10, 20)).toBe(15);
    expect(clampNumber(-1)).toBe(-1);
  });

  it('steps, with "any" stepping by 1 and an empty field starting at 0 or the bound', () => {
    expect(numberStepSize()).toBe(1);
    expect(numberStepSize('any')).toBe(1);
    expect(numberStepSize(0.5)).toBe(0.5);
    expect(stepNumber(null, 5)).toBe(0);
    expect(stepNumber(null, 5, 10)).toBe(10);
    expect(stepNumber(4, 5, 0, 7)).toBe(7);
  });

  it('maps the spinbutton keys', () => {
    const o = { min: 0, max: 100, step: 2 };
    expect(numberKeyTarget('ArrowUp', 10, o)).toBe(12);
    expect(numberKeyTarget('ArrowDown', 10, o)).toBe(8);
    expect(numberKeyTarget('PageUp', 10, o)).toBe(30);
    expect(numberKeyTarget('PageDown', 10, o)).toBe(0);
    expect(numberKeyTarget('Home', 10, o)).toBe(0);
    expect(numberKeyTarget('End', 10, o)).toBe(100);
    expect(numberKeyTarget('Home', 10, {})).toBeUndefined();
    expect(numberKeyTarget('End', 10)).toBeUndefined();
    expect(numberKeyTarget('a', 10, o)).toBeUndefined();
  });
});

describe('date values', () => {
  it('parses by granularity and rejects dates that do not exist', () => {
    expect(parseDateValue('2026-03-05')).toEqual({ year: 2026, month: 2, day: 5 });
    expect(parseDateValue('2026-03')).toEqual({ year: 2026, month: 2, day: 1 });
    expect(parseDateValue('2026')).toEqual({ year: 2026, month: 0, day: 1 });
    expect(parseDateValue('2026-03', 'day')).toBeUndefined();
    expect(parseDateValue('2026-03', 'month')).toBeDefined();
    expect(parseDateValue('2026-02-29')).toBeUndefined();
    expect(parseDateValue('2024-02-29')).toBeDefined();
    expect(parseDateValue('2026-13')).toBeUndefined();
    expect(parseDateValue('2026-00')).toBeUndefined();
    expect(parseDateValue('26-03-05')).toBeUndefined();
    expect(parseDateValue(undefined)).toBeUndefined();
    expect(isValidDateValue('2026-03-05')).toBe(true);
    expect(isValidDateValue('2026', 'year')).toBe(true);
  });

  it('reads the granularity a value is written at', () => {
    expect(dateValueGranularity('2026-03-05')).toBe('day');
    expect(dateValueGranularity('2026-03')).toBe('month');
    expect(dateValueGranularity('2026')).toBe('year');
    expect(dateValueGranularity('2026-02-31')).toBeUndefined();
    expect(dateValueGranularity('')).toBeUndefined();
  });

  it('formats at each granularity, padding small years', () => {
    const p = { year: 2026, month: 2, day: 5 };
    expect(formatDateValue(p)).toBe('2026-03-05');
    expect(formatDateValue(p, 'month')).toBe('2026-03');
    expect(formatDateValue(p, 'year')).toBe('2026');
    expect(formatDateValue({ year: 99, month: 0, day: 1 })).toBe('0099-01-01');
  });

  it('counts days and weekdays, leap years included', () => {
    expect(daysInMonth(2024, 1)).toBe(29);
    expect(daysInMonth(2026, 1)).toBe(28);
    expect(daysInMonth(1900, 1)).toBe(28);
    expect(daysInMonth(2000, 1)).toBe(29);
    expect(daysInMonth(2026, 11)).toBe(31);
    expect(weekdayOf({ year: 2026, month: 2, day: 1 })).toBe(0); // a Sunday
  });

  it('moves by days and months, keeping the day inside short months', () => {
    expect(addDays({ year: 2026, month: 11, day: 31 }, 1)).toEqual({ year: 2027, month: 0, day: 1 });
    expect(addDays({ year: 2026, month: 2, day: 1 }, -1)).toEqual({ year: 2026, month: 1, day: 28 });
    expect(addMonths({ year: 2026, month: 0, day: 31 }, 1)).toEqual({ year: 2026, month: 1, day: 28 });
    expect(addMonths({ year: 2026, month: 0, day: 15 }, -1)).toEqual({ year: 2025, month: 11, day: 15 });
    expect(addMonths({ year: 2026, month: 5, day: 15 }, 24)).toEqual({ year: 2028, month: 5, day: 15 });
  });

  it('compares at a granularity', () => {
    const a = { year: 2026, month: 2, day: 5 };
    const b = { year: 2026, month: 2, day: 20 };
    expect(compareDateParts(a, b)).toBeLessThan(0);
    expect(compareDateParts(b, a)).toBeGreaterThan(0);
    expect(compareDateParts(a, b, 'month')).toBe(0);
    expect(compareDateParts(a, { year: 2026, month: 5, day: 1 }, 'year')).toBe(0);
    expect(compareDateParts(a, { year: 2027, month: 0, day: 1 }, 'year')).toBeLessThan(0);
  });

  it('places a date against min and max at any granularity', () => {
    const march = { year: 2026, month: 2, day: 1 };
    expect(dateRangeStatus(march, '2026-03-15', undefined)).toBe('under');
    expect(dateRangeStatus(march, '2026-03-15', undefined, 'month')).toBeUndefined();
    expect(dateRangeStatus(march, undefined, '2026-02-28')).toBe('over');
    // A coarse max covers its whole period.
    expect(dateRangeStatus({ year: 2026, month: 11, day: 31 }, undefined, '2026')).toBeUndefined();
    expect(dateRangeStatus({ year: 2026, month: 2, day: 31 }, undefined, '2026-03')).toBeUndefined();
    expect(dateRangeStatus({ year: 2027, month: 0, day: 1 }, undefined, '2026')).toBe('over');
    expect(dateRangeStatus(march, 'nonsense', 'nonsense')).toBeUndefined();
  });

  it('knows the first day of the week, with a region fallback', () => {
    expect(firstDayOfWeek('en-US')).toBe(0);
    expect(firstDayOfWeek('de-DE')).toBe(1);
    expect(firstDayOfWeek('ar-EG')).toBe(6);
    expect(firstDayOfWeek('not a locale')).toBe(1);
    expect([0, 1, 6]).toContain(firstDayOfWeek());
    // Without Intl week info (Firefox): from the region table.
    const desc = Object.getOwnPropertyDescriptor(Intl.Locale.prototype, 'weekInfo');
    const getWeekInfo = (Intl.Locale.prototype as { getWeekInfo?: unknown }).getWeekInfo;
    try {
      Object.defineProperty(Intl.Locale.prototype, 'weekInfo', { configurable: true, get: () => undefined });
      (Intl.Locale.prototype as { getWeekInfo?: unknown }).getWeekInfo = undefined;
      expect(firstDayOfWeek('en-US')).toBe(0);
      expect(firstDayOfWeek('fr-FR')).toBe(1);
      expect(firstDayOfWeek('ar-EG')).toBe(6);
    } finally {
      if (desc) Object.defineProperty(Intl.Locale.prototype, 'weekInfo', desc);
      else delete (Intl.Locale.prototype as { weekInfo?: unknown }).weekInfo;
      (Intl.Locale.prototype as { getWeekInfo?: unknown }).getWeekInfo = getWeekInfo;
      if (getWeekInfo === undefined) delete (Intl.Locale.prototype as { getWeekInfo?: unknown }).getWeekInfo;
    }
  });

  it('reads today in local time', () => {
    expect(todayParts(new Date(2026, 10, 22, 23, 59))).toEqual({ year: 2026, month: 10, day: 22 });
  });
});

describe('labels', () => {
  it('are the strings of @nexub/core defaultMessages', () => {
    for (const key of Object.keys(labels) as (keyof typeof labels)[]) {
      const ours = labels[key];
      const core = defaultMessages[key];
      if (typeof ours === 'function') expect(ours('X')).toBe((core as (s: string) => string)('X'));
      else expect(ours).toBe(core);
    }
  });
});
