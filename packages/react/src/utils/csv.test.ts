import { describe, it, expect } from 'vitest';
import { toCSV } from './csv.js';

describe('toCSV', () => {
  it('quotes, escapes, uses CRLF, and neutralises formulas', () => {
    const rows = [
      { name: 'Acme, Inc.', note: 'Said "hi"', total: -5, at: new Date('2026-11-07T00:00:00Z') },
      { name: '=HYPERLINK("x")', note: 'line\nbreak', total: 12.5, at: null },
    ];
    expect(
      toCSV(rows, [
        { header: 'Name', value: 'name' },
        { header: 'Note', value: 'note' },
        { header: 'Total', value: 'total' },
        { header: 'At', value: (r) => r.at },
      ]),
    ).toBe(
      'Name,Note,Total,At\r\n' +
        '"Acme, Inc.","Said ""hi""",-5,2026-11-07T00:00:00.000Z\r\n' +
        `"'=HYPERLINK(""x"")","line\nbreak",12.5,\r\n`,
    );
  });
});
