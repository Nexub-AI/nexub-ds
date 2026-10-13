// Every font fonts.css references must exist and be big enough that bundlers
// emit it as a file (a data: URL breaks `font-src 'self'`).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';

const MIN_BYTES = 8 * 1024;

test('fonts.css only references font files above the inline limits', () => {
  const css = readFileSync(new URL('../src/fonts.css', import.meta.url), 'utf8');
  const urls = [...css.matchAll(/url\(([^)]+)\)/g)].map((m) => m[1]);
  assert.ok(urls.length > 0);
  for (const url of urls) {
    assert.ok(statSync(new URL(`../src/${url}`, import.meta.url)).size >= MIN_BYTES, url);
  }
});

test('base.css loads fonts.css, not Fontsource directly', () => {
  const base = readFileSync(new URL('../src/base.css', import.meta.url), 'utf8');
  assert.match(base, /@import '\.\/fonts\.css';/);
  assert.doesNotMatch(base, /@fontsource/);
});
