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

test('signature roles match the Signature palette tones in roles.css', () => {
  const css = readFileSync(new URL('roles.css', dist), 'utf8');
  const block = css.slice(css.indexOf('/* Signature style'));
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
  for (const k of Object.keys(s.light)) assert.ok(k in light, `${k} is a base role`);
  assert.equal(native.signature.shape.control, 10);
  for (const { light: l, dark: d } of Object.values(native.signature.elevation))
    for (const v of [l, d]) assert.doesNotMatch(v, /light-dark|var\(|\//);
});

// ─── 10.9: category colours and the spot accent ──────────────────────────────

const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);

test('every native category pair meets 4.5:1 and matches roles.css', () => {
  const css = readFileSync(new URL('roles.css', dist), 'utf8');
  const failures = [];
  for (const scheme of ['light', 'dark']) {
    const cats = native.color.categories[scheme];
    assert.deepEqual(Object.keys(cats), ['blue', 'amber', 'emerald', 'pink', 'violet', 'cyan', 'red', 'lime']);
    for (const [name, c] of Object.entries(cats)) {
      const inside = ratio(c.onContainer, c.container);
      if (inside < 4.5) failures.push(`${name} ${scheme} on-container: ${inside.toFixed(2)}`);
      for (const s of ['surface', 'surface-container', 'surface-container-high']) {
        const r = ratio(c.color, native.signature.roles.standard[scheme][s] ?? native.color.roles.standard[scheme][s]);
        if (r < 4.5) failures.push(`${name} ${scheme} text on ${s}: ${r.toFixed(2)}`);
      }
      const i = scheme === 'dark' ? 2 : 1;
      assert.equal(c.color, css.match(new RegExp(`--color-category-${name}: light-dark\\((#\\w+), (#\\w+)\\)`))[i]);
      assert.equal(c.container, css.match(new RegExp(`--color-category-${name}-container: light-dark\\((#\\w+), (#\\w+)\\)`))[i]);
    }
  }
  assert.deepEqual(failures, []);
});

test('spot roles: primary by default, the division family for an app, its own scale for a built-in product', () => {
  const { spot, divisions, products } = native.color;
  for (const lvl of ['standard', 'medium', 'high'])
    for (const scheme of ['light', 'dark']) {
      const sig = native.signature.roles[lvl][scheme];
      assert.deepEqual(spot.default[lvl][scheme], {
        spot: sig.primary, onSpot: sig['on-primary'], spotContainer: sig['primary-container'], onSpotContainer: sig['on-primary-container'],
      });
      assert.equal(spot.money[lvl][scheme].spot, divisions.fintech[lvl][scheme].tertiary);
      assert.equal(spot.fintech[lvl][scheme].onSpot, divisions.fintech[lvl][scheme]['on-tertiary']);
      assert.equal(spot.payub[lvl][scheme].spotContainer, products.payub[lvl][scheme]['tertiary-container']);
      assert.deepEqual(spot.payhub[lvl][scheme], spot.payub[lvl][scheme]);
      for (const [key, v] of Object.entries(spot)) {
        const s = v[lvl][scheme];
        assert.ok(ratio(s.onSpot, s.spot) >= 4.5, `${key} ${lvl} ${scheme} on-spot`);
        assert.ok(ratio(s.onSpotContainer, s.spotContainer) >= 4.5, `${key} ${lvl} ${scheme} on-spot-container`);
      }
    }
  // default + 5 divisions + 17 product keys; 'commerce' is both a division and its one app.
  assert.equal(Object.keys(spot).length, 1 + 5 + 17 - 1);
});

test('the vivid gradient end keeps on-primary readable', () => {
  for (const lvl of ['standard', 'medium', 'high'])
    for (const scheme of ['light', 'dark']) {
      const { accent2 } = native.color.vivid[lvl][scheme];
      const sig = native.signature.roles[lvl][scheme];
      assert.notEqual(accent2, sig.primary);
      assert.ok(ratio(sig['on-primary'], accent2) >= 4.5, `${lvl} ${scheme}: ${ratio(sig['on-primary'], accent2).toFixed(2)}`);
    }
});
