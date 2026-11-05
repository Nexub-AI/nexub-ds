import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { palettes } from './generate.mjs';

const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const s = parseInt(hex.slice(i, i + 2), 16) / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const { marketing } = JSON.parse(readFileSync(new URL('../tokens/marketing.json', import.meta.url), 'utf8'));
const pal = palettes();
const tone = (ref) => {
  const [, family, t] = ref.match(/--color-palette-(\w+)-(\d+)/);
  return pal[family][Number(t)];
};
const stops = (v) => [...v.matchAll(/var\((--color-palette-\w+-\d+)\)/g)].map((m) => tone(m[1]));

test('hero button text meets AA on every gradient stop, at rest and on hover', () => {
  const fg = tone(marketing['button-fg'].$value);
  for (const key of ['button-gradient', 'button-gradient-hover']) {
    for (const bg of stops(marketing[key].$value)) {
      assert.ok(ratio(fg, bg) >= 4.5, `${key}: ${fg} on ${bg} is ${ratio(fg, bg).toFixed(2)}:1`);
    }
  }
});
