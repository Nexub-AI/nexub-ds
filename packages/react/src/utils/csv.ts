export interface CSVColumn<T> {
  header: string;
  /** A key of the row, or a function returning the cell's value. */
  value: keyof T | ((row: T) => unknown);
}

// Cells a spreadsheet would run as a formula (OWASP CSV injection).
const FORMULA = /^[=+\-@\t\r]/;

function cell(value: unknown): string {
  if (value == null) return '';
  let text = value instanceof Date ? value.toISOString() : String(value);
  if (typeof value !== 'number' && FORMULA.test(text)) text = `'${text}`;
  return /[",\r\n]/.test(text) || text !== text.trim() ? `"${text.replace(/"/g, '""')}"` : text;
}

/**
 * Rows to CSV text (RFC 4180, CRLF line ends). Text that starts like a formula
 * gets a leading `'` so spreadsheets show it instead of running it. Pass the
 * rows and columns the person sees, e.g. after sorting and hiding columns.
 */
export function toCSV<T>(rows: T[], columns: CSVColumn<T>[]): string {
  const lines = [columns.map((c) => cell(c.header)).join(',')];
  for (const row of rows) {
    lines.push(columns.map((c) => cell(typeof c.value === 'function' ? c.value(row) : row[c.value])).join(','));
  }
  return lines.join('\r\n') + '\r\n';
}
