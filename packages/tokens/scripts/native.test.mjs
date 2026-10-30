// @nexub/tokens/native must match the CSS it mirrors (run after `pnpm build`).
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { native } from '../dist/js/native.js';

const dist = new URL('../dist/css/', import.meta.url);
const palette = Object.fromEntries(
  [...readFileSync(new URL('variables.css', dist), 'utf8').matchAll(/--color-palette-([\w-]+?-\d+): (#[0-9a-f]{6});/g)].map(
    (m) => [m[1], m[2]],
  ),
);
// First block of roles.css = standard contrast, no product.
const standard = readFileSync(new URL('roles.css', dist), 'utf8').split('\n}')[1];

test('every standard role matches the CSS light-dark() pair', () => {
  const decls = [...standard.matchAll(/--color-([\w-]+): light-dark\(var\(--color-palette-([\w-]+)\), var\(--color-palette-([\w-]+)\)\);/g)];
  assert.ok(decls.length > 50);
  for (const [, role, light, dark] of decls) {
    assert.equal(native.color.roles.standard.light[role], palette[light], `${role} light`);
    assert.equal(native.color.roles.standard.dark[role], palette[dark], `${role} dark`);
  }
});

test('every contrast level and product has the same role set', () => {
  const keys = Object.keys(native.color.roles.standard.light).sort();
  for (const lvl of ['standard', 'medium', 'high'])
    for (const scheme of ['light', 'dark']) {
      assert.deepEqual(Object.keys(native.color.roles[lvl][scheme]).sort(), keys);
      for (const p of Object.values(native.color.products))
        assert.deepEqual(Object.keys(p[lvl][scheme]).sort(), ['on-tertiary', 'on-tertiary-container', 'tertiary', 'tertiary-container']);
    }
});

test('springs convert the damping ratio to Reanimated’s absolute damping', () => {
  // M3 spatial default: ratio 0.9, stiffness 700 → c = 2·0.9·√700
  assert.deepEqual(native.motion.spring.spatial.default, { stiffness: 700, damping: 47.62, mass: 1 });
});

test('dimensions are numbers and shadows have no CSS-only syntax', () => {
  assert.equal(native.spacing['4'], 16);
  assert.equal(native.shape.control, 9999);
  for (const { light, dark } of Object.values(native.elevation))
    for (const s of [light, dark]) assert.doesNotMatch(s, /light-dark|var\(|\//);
});
