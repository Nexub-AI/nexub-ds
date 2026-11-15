// 9.5: property-based tests (fast-check) for everything that parses what a person or an
// LLM hands it: money, URLs, seed colours, CSV cells and the typed inputs. Each property
// states what must hold for any input, and fast-check looks for a counterexample.
import * as React from 'react';
import fc from 'fast-check';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { contrastRatio, createSeedRoles } from '@nexub/tokens/seed';
import { formatForDisplay, formatForEditing, fractionDigits, parseMoney } from './utils/money.js';
import { safeHref, safeSrc } from './utils/safeHref.js';
import { toCSV } from './utils/csv.js';
import { NumberInput } from './components/NumberInput/index.js';
import { OTPInput } from './components/OTPInput/index.js';
import { MoneyInput } from './components/MoneyInput/index.js';
import { DatePicker } from './components/DatePicker/index.js';

const LOCALES = ['en-US', 'de-DE', 'fr-FR', 'en-IN', 'de-CH', 'ja-JP', 'ar-EG', 'hi-IN'] as const;
const CURRENCIES = ['USD', 'EUR', 'JPY', 'KWD', 'INR'] as const;
const locale = fc.constantFrom(...LOCALES);
const currency = fc.constantFrom(...CURRENCIES);
// Any text, plus text built from the characters number formats use.
const numberish = fc.string({ unit: fc.constantFrom(...'0123456789.,-−–   \'’e+٠١٢٣٫٬'), maxLength: 24 });
const anyText = fc.oneof(fc.string(), fc.string({ unit: 'binary' }), numberish);

describe('money', () => {
  it('parseMoney returns null or a finite number for any text', () => {
    fc.assert(
      fc.property(anyText, currency, locale, (text, cur, loc) => {
        const n = parseMoney(text, cur, loc);
        expect(n === null || Number.isFinite(n)).toBe(true);
      }),
    );
  });

  it('what MoneyInput shows parses back to the same amount, in every locale', () => {
    fc.assert(
      fc.property(fc.integer({ min: -1e11, max: 1e11 }), currency, locale, (minor, cur, loc) => {
        const value = minor / 10 ** fractionDigits(cur, loc);
        expect(parseMoney(formatForEditing(value, cur, loc), cur, loc)).toBe(value);
        expect(parseMoney(formatForDisplay(value, cur, loc), cur, loc)).toBe(value);
      }),
    );
  });
});

describe('URLs', () => {
  // A dangerous scheme hidden the ways a browser still accepts: mixed case, tabs and
  // newlines inside it, control characters and spaces in front.
  const noise = fc.string({ unit: fc.constantFrom('\t', '\n', '\r'), maxLength: 2 });
  const lead = fc.string({ unit: fc.constantFrom(' ', '\t', '\n', '\u0000', '\u0001', '\u001f', '\u007f', ' ', '﻿'), maxLength: 3 });
  const hidden = fc
    .tuple(lead, fc.constantFrom('javascript', 'vbscript', 'data', 'file', 'blob', 'slack'), fc.array(noise, { minLength: 10, maxLength: 10 }), fc.array(fc.boolean(), { minLength: 10, maxLength: 10 }), fc.string())
    .map(([l, s, gaps, upper, rest]) => l + [...s].map((c, i) => (upper[i] ? c.toUpperCase() : c) + gaps[i]).join('') + ':' + rest);
  const url = fc.oneof(hidden, fc.webUrl(), fc.string(), fc.string({ unit: 'binary' }));
  // The scheme a browser would navigate to (WHATWG URL parsing, same as an <a href>).
  const protocol = (href: string) => {
    try {
      return new URL(href, 'https://base.test/dir/').protocol;
    } catch {
      return null; // not a URL: nothing to navigate to
    }
  };

  it('safeHref (strict) only ever returns a web or contact link', () => {
    fc.assert(
      fc.property(url, (u) => {
        const out = safeHref(u);
        if (out === undefined) return;
        expect(out).toBe(u);
        expect([null, 'http:', 'https:', 'mailto:', 'tel:', 'sms:']).toContain(protocol(out));
      }),
      { numRuns: 2000 },
    );
  });

  it('safeHref ({ strict: false }) never returns a script-capable scheme', () => {
    fc.assert(
      fc.property(url, (u) => {
        const out = safeHref(u, { strict: false });
        if (out !== undefined) expect(['javascript:', 'vbscript:', 'data:', 'file:']).not.toContain(protocol(out));
      }),
      { numRuns: 2000 },
    );
  });

  it('safeSrc only returns relative, http(s), blob: or data:image/ sources', () => {
    fc.assert(
      fc.property(fc.oneof(url, fc.string().map((s) => `data:image/png;base64,${s}`)), (u) => {
        const out = safeSrc(u);
        if (out === undefined) return;
        const p = protocol(out);
        expect([null, 'http:', 'https:', 'blob:', 'data:']).toContain(p);
        if (p === 'data:') expect(new URL(out).pathname.toLowerCase().startsWith('image/')).toBe(true);
      }),
      { numRuns: 2000 },
    );
  });
});

describe('seed colours', () => {
  const hexDigits = (n: number) => fc.string({ unit: fc.constantFrom(...'0123456789abcdefABCDEF'), minLength: n, maxLength: n });
  const hex = fc.oneof(hexDigits(3), hexDigits(6)).map((d) => `#${d}`);

  it('any hex seed gives hex roles whose text pairs meet WCAG AA', () => {
    fc.assert(
      fc.property(hex, fc.constantFrom('standard', 'medium', 'high'), fc.constantFrom('primary', 'tertiary'), (seed, contrast, target) => {
        const schemes = createSeedRoles(seed, { contrast, target } as Parameters<typeof createSeedRoles>[1]);
        for (const roles of [schemes.light, schemes.dark]) {
          for (const v of Object.values(roles)) expect(v).toMatch(/^#[0-9a-f]{6}$/);
          expect(contrastRatio(roles[target]!, roles[`on-${target}`]!)).toBeGreaterThanOrEqual(4.5);
          expect(contrastRatio(roles[`${target}-container`]!, roles[`on-${target}-container`]!)).toBeGreaterThanOrEqual(4.5);
        }
      }),
    );
  });

  it('anything that is not a hex colour is rejected with a TypeError', () => {
    fc.assert(
      fc.property(fc.oneof(fc.string(), fc.string().map((s) => `#${s}`), fc.anything()), (seed) => {
        fc.pre(typeof seed !== 'string' || !/^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(seed));
        expect(() => createSeedRoles(seed as string)).toThrow(TypeError);
      }),
    );
  });
});

describe('CSV', () => {
  // RFC 4180 reader, for the round trip only.
  function parseCSV(text: string): string[][] {
    const rows: string[][] = [[]];
    let cell = '';
    let quoted = false;
    const end = () => {
      rows[rows.length - 1]!.push(cell);
      cell = '';
    };
    for (let i = 0; i < text.length; i++) {
      const c = text[i]!;
      if (quoted) {
        if (c === '"' && text[i + 1] === '"') {
          cell += '"';
          i++;
        } else if (c === '"') quoted = false;
        else cell += c;
      } else if (c === '"') quoted = true;
      else if (c === ',') end();
      else if (c === '\r' && text[i + 1] === '\n') {
        end();
        rows.push([]);
        i++;
      } else cell += c;
    }
    rows.pop(); // the text ends with CRLF
    return rows;
  }
  const cell = fc.oneof(fc.string(), fc.string({ unit: fc.constantFrom(...'=+-@\t\r\n",\' a1') }));

  it('any text survives the round trip, and no cell starts like a formula', () => {
    fc.assert(
      fc.property(fc.array(fc.tuple(cell, cell), { maxLength: 5 }), (data) => {
        const rows = data.map(([a, b]) => ({ a, b }));
        const parsed = parseCSV(toCSV(rows, [{ header: 'a', value: 'a' }, { header: 'b', value: 'b' }]));
        expect(parsed.length).toBe(rows.length + 1);
        parsed.slice(1).forEach((line, i) => {
          [rows[i]!.a, rows[i]!.b].forEach((original, j) => {
            const formula = /^[=+\-@\t\r]/.test(original);
            expect(line[j]).toBe(formula ? `'${original}` : original);
            expect(line[j]).not.toMatch(/^[=+\-@\t\r]/);
          });
        });
      }),
    );
  });
});

describe('typed inputs', () => {
  const runs = { numRuns: 60 };

  it('NumberInput only reports finite numbers inside min and max', () => {
    const text = fc.oneof(anyText, fc.double().map(String), fc.constantFrom('Infinity', '-Infinity', '1e999', '-1e999', 'NaN'));
    fc.assert(
      fc.property(fc.array(text, { maxLength: 6 }), fc.integer({ min: -1000, max: 0 }), fc.integer({ min: 0, max: 1000 }), fc.boolean(), (texts, min, max, bounded) => {
        const seen: number[] = [];
        const { container } = render(<NumberInput aria-label="n" {...(bounded ? { min, max } : {})} onValueChange={(v) => seen.push(v)} />);
        const input = container.querySelector('input')!;
        // jsdom sanitises type="number" values; a text field passes every string through, as an IME or autofill can.
        input.type = 'text';
        for (const t of texts) fireEvent.change(input, { target: { value: t } });
        cleanup();
        for (const v of seen) {
          expect(Number.isFinite(v)).toBe(true);
          if (bounded) expect(v >= min && v <= max).toBe(true);
        }
      }),
      runs,
    );
  });

  it('OTPInput only ever holds its own characters, up to its length', () => {
    fc.assert(
      fc.property(fc.array(fc.tuple(fc.nat(7), anyText, fc.boolean()), { maxLength: 8 }), fc.integer({ min: 1, max: 8 }), fc.constantFrom('numeric', 'alphanumeric'), (steps, length, mode) => {
        const seen: string[] = [];
        const { container } = render(<OTPInput length={length} mode={mode as 'numeric'} onValueChange={(v) => seen.push(v)} />);
        for (const [box, text, paste] of steps) {
          const input = container.querySelectorAll('input')[box % length]!;
          if (paste) fireEvent.paste(input, { clipboardData: { getData: () => text } });
          else fireEvent.change(input, { target: { value: text } });
        }
        const shown = [...container.querySelectorAll('input')].map((i) => i.value).join('');
        cleanup();
        const ok = mode === 'numeric' ? /^\d*$/ : /^[a-z0-9]*$/i;
        for (const v of [...seen, shown]) {
          expect(v).toMatch(ok);
          expect(v.length).toBeLessThanOrEqual(length);
        }
      }),
      runs,
    );
  });

  it('MoneyInput reports null or a finite amount, and shows what it reported', () => {
    fc.assert(
      fc.property(fc.array(anyText, { minLength: 1, maxLength: 5 }), currency, locale, (texts, cur, loc) => {
        const seen: (number | null)[] = [];
        const { container } = render(<MoneyInput aria-label="m" currency={cur} locale={loc} onValueChange={(v) => seen.push(v)} />);
        const input = container.querySelector('input')!;
        fireEvent.focus(input);
        for (const t of texts) fireEvent.change(input, { target: { value: t } });
        fireEvent.blur(input);
        const shown = input.value;
        cleanup();
        for (const v of seen) expect(v === null || Number.isFinite(v)).toBe(true);
        const last = seen.at(-1) ?? null;
        // After blur the field shows the reported amount, and that text parses back to it.
        expect(shown === '' ? null : parseMoney(shown, cur, loc)).toBe(last);
      }),
      runs,
    );
  });

  it('DatePicker only commits a real date inside its bounds', () => {
    const minDate = new Date(2020, 0, 1);
    const maxDate = new Date(2030, 11, 31);
    const dateText = fc.oneof(
      anyText,
      fc.tuple(fc.integer({ min: 0, max: 40 }), fc.integer({ min: 0, max: 40 }), fc.integer({ min: 0, max: 99999 }), fc.constantFrom('/', '.', '-', ' ')).map(([a, b, c, s]) => `${a}${s}${b}${s}${c}`),
    );
    fc.assert(
      fc.property(fc.array(dateText, { minLength: 1, maxLength: 4 }), (texts) => {
        const seen: (Date | undefined)[] = [];
        const { container } = render(<DatePicker typeable minDate={minDate} maxDate={maxDate} onValueChange={(v) => seen.push(v)} />);
        const input = container.querySelector('input')!;
        for (const t of texts) {
          fireEvent.change(input, { target: { value: t } });
          fireEvent.blur(input);
        }
        cleanup();
        for (const d of seen) {
          if (d === undefined) continue;
          expect(Number.isNaN(d.getTime())).toBe(false);
          expect(d >= minDate && d <= maxDate).toBe(true);
        }
      }),
      runs,
    );
  });
});
