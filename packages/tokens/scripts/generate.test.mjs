import assert from 'node:assert/strict';
import { test } from 'node:test';
import { PRODUCTS, ROLES, SPRINGS, palettes, spring, tertiary } from './generate.mjs';

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

const SURFACES = ['surface', 'surface-dim', 'surface-bright', 'surface-container-lowest', 'surface-container-low', 'surface-container', 'surface-container-high', 'surface-container-highest'];
const ACCENTS = ['primary', 'secondary', 'tertiary', 'error', 'success', 'warning', 'info'];
const PAIRS = [
  ...ACCENTS.flatMap((a) => [
    [`on-${a}`, a, 4.5],
    [`on-${a}-container`, `${a}-container`, 4.5],
    ...SURFACES.map((s) => [a, s, 4.5]), // accents double as link/text color
  ]),
  ...['on-surface', 'on-surface-variant', 'on-surface-muted'].flatMap((t) => SURFACES.map((s) => [t, s, 4.5])),
  ...SURFACES.map((s) => ['outline', s, 3]),
  ['inverse-on-surface', 'inverse-surface', 4.5],
  ['inverse-primary', 'inverse-surface', 3],
];

test('every role pair meets WCAG AA in light/dark × standard/high × every brand', () => {
  const pal = palettes();
  const failures = [];
  for (const brand of ['primary', ...PRODUCTS]) {
    const roles = { ...ROLES, ...tertiary(brand) };
    for (const [scheme, col] of [['light', 1], ['dark', 2], ['light-high', 3], ['dark-high', 4]]) {
      const hex = (role) => pal[roles[role][0]][roles[role][col]];
      for (const [fg, bg, min] of PAIRS) {
        const r = ratio(hex(fg), hex(bg));
        if (r < min) failures.push(`${brand}/${scheme} ${fg} on ${bg}: ${r.toFixed(2)} < ${min}`);
      }
    }
  }
  assert.deepEqual(failures, []);
});

test('every role tone exists in the generated palettes', () => {
  const pal = palettes();
  for (const [role, [p, ...tones]] of Object.entries({ ...ROLES, ...tertiary('leap') }))
    for (const t of tones) assert.ok(pal[p]?.[t], `${role}: palette ${p} tone ${t}`);
});

test('springs run 0 → 1, effects never overshoot, slower tokens take longer', () => {
  for (const [kind, speeds] of Object.entries(SPRINGS)) {
    const s = Object.fromEntries(Object.entries(speeds).map(([k, [d, st]]) => [k, spring(d, st)]));
    for (const { stops } of Object.values(s)) {
      assert.equal(stops[0], 0);
      assert.equal(stops.at(-1), 1);
      if (kind === 'effects') assert.ok(Math.max(...stops) <= 1, 'effects overshoot');
      if (kind === 'spatial') assert.ok(Math.max(...stops) < 1.01, 'spatial overshoot > 1%');
    }
    const ms = (x) => parseInt(x.duration, 10);
    assert.ok(ms(s.fast) < ms(s.default) && ms(s.default) < ms(s.slow), `${kind} durations`);
  }
});
