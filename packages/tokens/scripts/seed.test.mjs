import assert from 'node:assert/strict';
import { test } from 'node:test';
import { LEVELS, ROLES, palettes, tonesAt } from './generate.mjs';
import { createSeedTheme, createSeedThemeCss } from '../src/seed.js';

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
const split = (v) => v.match(/^light-dark\((#[0-9a-f]{6}), (#[0-9a-f]{6})\)$/).slice(1);

const SEEDS = {
  red: '#ff0000',
  yellow: '#ffeb3b',
  cyan: '#00e5ff',
  grey: '#808080',
  'near-black': '#0a0a0a',
  'near-white': '#fafafa',
  'brand blue': '#4099f1',
  purple: '#7b1fa2',
};
const SURFACES = ['surface', 'surface-dim', 'surface-bright', 'surface-container-lowest', 'surface-container-low', 'surface-container', 'surface-container-high', 'surface-container-highest', 'surface-elevated'];

test('seeded accents meet the same WCAG pairs as generate.test.mjs, every seed × target × level × scheme', () => {
  const pal = palettes();
  const failures = [];
  for (const [name, seed] of Object.entries(SEEDS))
    for (const target of ['primary', 'tertiary'])
      for (const level of LEVELS) {
        const theme = createSeedTheme(seed, { contrast: level, target });
        for (const [scheme, col] of [['light', 0], ['dark', 1]]) {
          const fixed = (role) => {
            const t = tonesAt(ROLES[role], level);
            return pal[t[0]][t[col + 1]];
          };
          const hex = (role) => (theme[`--color-${role}`] ? split(theme[`--color-${role}`])[col] : fixed(role));
          const a = target;
          const pairs = [
            [`on-${a}`, a, 4.5],
            [`on-${a}-container`, `${a}-container`, 4.5],
            ...SURFACES.map((s) => [a, s, 4.5]),
            ...(a === 'primary' ? [['inverse-primary', 'inverse-surface', 3]] : []),
          ];
          for (const [fg, bg, min] of pairs) {
            const r = ratio(hex(fg), hex(bg));
            if (r < min) failures.push(`${name}/${target}/${level}/${scheme} ${fg} on ${bg}: ${r.toFixed(2)} < ${min}`);
          }
        }
      }
  assert.deepEqual(failures, []);
});

test('the built-in primary seed reproduces roles.css primary tones', () => {
  const pal = palettes().primary;
  const theme = createSeedTheme('#0059c8');
  assert.equal(theme['--color-primary'], `light-dark(${pal[40]}, ${pal[80]})`);
  assert.equal(theme['--color-on-primary-container'], `light-dark(${pal[10]}, ${pal[90]})`);
  assert.equal(theme['--color-inverse-primary'], `light-dark(${pal[80]}, ${pal[40]})`);
  assert.equal(createSeedTheme('#0059c8', { contrast: 'high' })['--color-primary'], `light-dark(${pal[30]}, ${pal[90]})`);
});

test('roles per target', () => {
  assert.deepEqual(Object.keys(createSeedTheme('#4099f1')), [
    '--color-primary', '--color-on-primary', '--color-primary-container', '--color-on-primary-container', '--color-inverse-primary',
  ]);
  assert.deepEqual(Object.keys(createSeedTheme('#4099f1', { target: 'tertiary' })), [
    '--color-tertiary', '--color-on-tertiary', '--color-tertiary-container', '--color-on-tertiary-container',
  ]);
});

test('#rgb equals #rrggbb; invalid input throws a clear error', () => {
  assert.deepEqual(createSeedTheme('#f80'), createSeedTheme('#FF8800'));
  for (const bad of ['red', '#ff00', 'ff0000', '#gggggg', '', '#ff0000ff', undefined])
    assert.throws(() => createSeedTheme(bad), /seed must be a hex colour/);
  assert.throws(() => createSeedTheme('#fff', { contrast: 'max' }), /contrast must be one of/);
  assert.throws(() => createSeedTheme('#fff', { target: 'secondary' }), /target must be/);
});

test('createSeedThemeCss', () => {
  const css = createSeedThemeCss('#7b1fa2', { selector: '.brand', target: 'tertiary', contrast: 'medium' });
  const theme = createSeedTheme('#7b1fa2', { target: 'tertiary', contrast: 'medium' });
  assert.equal(css, `.brand {\n${Object.entries(theme).map(([k, v]) => `  ${k}: ${v};`).join('\n')}\n}\n`);
  assert.ok(createSeedThemeCss('#7b1fa2').startsWith(':root {\n  --color-primary: light-dark(#'));
});
