import { describe, it, expect } from 'vitest';
import { safeHref, safeSrc } from './safeHref.js';

describe('safeHref', () => {
  it.each(['/settings', '#main', '?q=1', 'docs/page', 'https://x.dev/a', 'http://x.dev', 'mailto:a@b.co', 'tel:+1'])(
    'allows %j',
    (url) => expect(safeHref(url)).toBe(url),
  );

  it('is strict by default since 8.0; { strict: false } still allows custom schemes', () => {
    expect(safeHref('slack://open')).toBeUndefined();
    expect(safeHref('slack://open', { strict: false })).toBe('slack://open');
    expect(safeHref('javascript:alert(1)', { strict: false })).toBeUndefined();
  });

  it.each([
    'javascript:alert(1)',
    'JavaScript:alert(1)',
    ' javascript:alert(1)',
    'java\tscript:alert(1)',
    'java\nscript:alert(1)',
    '\u0001javascript:alert(1)',
    'vbscript:msgbox(1)',
    'data:text/html,<script>alert(1)</script>',
    'file:///etc/passwd',
  ])('blocks %j', (url) => expect(safeHref(url)).toBeUndefined());

  it('strict mode allows only the web/contact schemes', () => {
    expect(safeHref('slack://open', { strict: true })).toBeUndefined();
    expect(safeHref('/a', { strict: true })).toBe('/a');
    expect(safeHref('https://x.dev', { strict: true })).toBe('https://x.dev');
    expect(safeHref('mailto:a@b.co', { strict: true })).toBe('mailto:a@b.co');
  });

  it('passes empty values through as undefined', () => {
    expect(safeHref(undefined)).toBeUndefined();
    expect(safeHref('')).toBeUndefined();
  });
});

describe('safeSrc', () => {
  it.each(['/a.png', 'https://x.dev/a.png', 'blob:https://x.dev/1', 'data:image/png;base64,AAAA', 'DATA:image/svg+xml,<svg/>'])(
    'allows %j',
    (url) => expect(safeSrc(url)).toBe(url),
  );
  it.each(['javascript:alert(1)', 'data:text/html,x', 'file:///a.png', 'ftp://x/a.png'])('blocks %j', (url) =>
    expect(safeSrc(url)).toBeUndefined(),
  );
});
