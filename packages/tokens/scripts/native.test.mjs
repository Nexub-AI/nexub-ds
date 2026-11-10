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

test('signature roles match the [data-style=signature] palette tones in roles.css', () => {
  const css = readFileSync(new URL('roles.css', dist), 'utf8');
  const block = css.slice(css.indexOf(":root, [data-style='signature'] {"));
  const sig = Object.fromEntries([...block.split('\n}')[0].matchAll(/--color-palette-([\w-]+?-\d+): (#[0-9a-f]{6});/g)].map((m) => [m[1], m[2]]));
  const { light, dark } = native.color.roles.standard;
  const s = native.signature.roles.standard;
  // surface = neutral 98 / 6, primary = primary 40 / 80 (ROLES in src/roles.js).
  assert.equal(s.light.surface, sig['neutral-98']);
  assert.equal(s.dark.surface, sig['neutral-6']);
  assert.equal(s.light.primary, sig['primary-40']);
  assert.equal(s.dark.primary, sig['primary-80']);
  assert.equal(s.light.tertiary, s.light.primary, 'tertiary follows primary without a product');
  assert.notEqual(s.light.surface, light.surface);
  assert.notEqual(s.dark.primary, dark.primary);
  for (const k of Object.keys(s.light)) assert.ok(k in light, `${k} is a classic role`);
  assert.equal(native.signature.shape.control, 10);
  for (const { light: l, dark: d } of Object.values(native.signature.elevation))
    for (const v of [l, d]) assert.doesNotMatch(v, /light-dark|var\(|\//);
});
