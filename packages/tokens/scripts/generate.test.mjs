import assert from 'node:assert/strict';
import { test } from 'node:test';
import { LEVELS, P3_ROLES, PRODUCTS, ROLES, SPRINGS, chartCategorical, palettes, rolesCss, spring, tertiary, tonesAt } from './generate.mjs';

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

const SURFACES = ['surface', 'surface-dim', 'surface-bright', 'surface-container-lowest', 'surface-container-low', 'surface-container', 'surface-container-high', 'surface-container-highest', 'surface-elevated'];
const ACCENTS = ['primary', 'secondary', 'tertiary', 'error', 'success', 'warning', 'info', ...PRODUCTS];
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

test('every role pair meets WCAG AA in light/dark × standard/medium/high × every brand', () => {
  const pal = palettes();
  const failures = [];
  for (const brand of ['primary', ...PRODUCTS]) {
    const roles = { ...ROLES, ...tertiary(brand) };
    for (const level of LEVELS) {
      for (const [scheme, col] of [['light', 1], ['dark', 2]]) {
        const hex = (role) => {
          const t = tonesAt(roles[role], level);
          return pal[t[0]][t[col]];
        };
        for (const [fg, bg, min] of PAIRS) {
          const r = ratio(hex(fg), hex(bg));
          if (r < min) failures.push(`${brand}/${level}/${scheme} ${fg} on ${bg}: ${r.toFixed(2)} < ${min}`);
        }
      }
    }
  }
  assert.deepEqual(failures, []);
});

test('every role tone exists in the generated palettes', () => {
  const pal = palettes();
  for (const [role, entry] of Object.entries({ ...ROLES, ...tertiary('leap') }))
    for (const level of LEVELS) {
      const [p, ...tones] = tonesAt(entry, level);
      for (const t of tones) assert.ok(pal[p]?.[t], `${role}/${level}: palette ${p} tone ${t}`);
    }
});

test('medium contrast sits between standard and high', () => {
  for (const [role, entry] of Object.entries(ROLES)) {
    const [, l, d] = tonesAt(entry, 'medium');
    const [, sl, sd, hl, hd] = entry;
    assert.ok(l >= Math.min(sl, hl) && l <= Math.max(sl, hl), `${role} light`);
    assert.ok(d >= Math.min(sd, hd) && d <= Math.max(sd, hd), `${role} dark`);
  }
});

test('P3 block boosts chroma of accent fills only, at every level and brand', () => {
  const css = rolesCss();
  const p3 = css.slice(css.indexOf('@media (color-gamut: p3)'));
  assert.ok(p3.includes('@supports (color: oklch(from red l c h))'));
  const decls = [...p3.matchAll(/--color-([\w-]+): (.*);/g)];
  assert.deepEqual([...new Set(decls.map((m) => m[1]))].sort(), [...P3_ROLES].sort());
  for (const [, role, value] of decls)
    assert.match(value, /^light-dark\(oklch\(from var\(--color-palette-[\w-]+\) l calc\(c \* 1\.18\) h\), oklch\(from .* h\)\)$/, role);
  for (const sel of ["[data-contrast='medium']", "[data-contrast='high']", "[data-product='leap']"]) assert.ok(p3.includes(sel), sel);
});

// ─── Chart palettes ──────────────────────────────────────────────────────────

test('categorical chart colours clear 3:1 on surface and surface-container (light & dark)', () => {
  const pal = palettes();
  const failures = [];
  chartCategorical().forEach((pair, i) =>
    pair.forEach((hex, col) => {
      for (const s of ['surface', 'surface-container']) {
        const [p, ...t] = ROLES[s];
        const r = ratio(hex, pal[p][t[col]]);
        if (r < 3) failures.push(`chart-${i + 1} ${col ? 'dark' : 'light'} on ${s}: ${r.toFixed(2)}`);
      }
    }),
  );
  assert.deepEqual(failures, []);
});

// Colour-vision deficiency: Machado et al. (2009) severity-1 matrices applied to
// linear sRGB, distances in CIEDE2000.
const MACHADO = {
  protanopia: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
  deuteranopia: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.01182, 0.04294, 0.968881]],
  tritanopia: [[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691367, 0.3039]],
};
const linRgb = (hex) =>
  [1, 3, 5].map((i) => {
    const s = parseInt(hex.slice(i, i + 2), 16) / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
const simulate = (rgb, m) => m.map((row) => Math.min(1, Math.max(0, row[0] * rgb[0] + row[1] * rgb[1] + row[2] * rgb[2])));
function lab([r, g, b]) {
  const f = (t) => (t > 216 / 24389 ? Math.cbrt(t) : ((24389 / 27) * t + 16) / 116);
  const x = f((0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / 0.95047);
  const y = f(0.2126729 * r + 0.7151522 * g + 0.072175 * b);
  const z = f((0.0193339 * r + 0.119192 * g + 0.9503041 * b) / 1.08883);
  return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
}
function de2000([L1, a1, b1], [L2, a2, b2]) {
  const rad = Math.PI / 180;
  const Cb = (Math.hypot(a1, b1) + Math.hypot(a2, b2)) / 2;
  const G = 0.5 * (1 - Math.sqrt(Cb ** 7 / (Cb ** 7 + 25 ** 7)));
  const [ap1, ap2] = [(1 + G) * a1, (1 + G) * a2];
  const [C1, C2] = [Math.hypot(ap1, b1), Math.hypot(ap2, b2)];
  const hue = (b, a) => (a === 0 && b === 0 ? 0 : ((Math.atan2(b, a) / rad) + 360) % 360);
  const [h1, h2] = [hue(b1, ap1), hue(b2, ap2)];
  let dh = 0;
  if (C1 * C2) dh = Math.abs(h2 - h1) <= 180 ? h2 - h1 : h2 - h1 > 180 ? h2 - h1 - 360 : h2 - h1 + 360;
  const dH = 2 * Math.sqrt(C1 * C2) * Math.sin((dh / 2) * rad);
  const [Lb, Cpb] = [(L1 + L2) / 2, (C1 + C2) / 2];
  let hb = h1 + h2;
  if (C1 * C2) hb = Math.abs(h1 - h2) <= 180 ? hb / 2 : hb < 360 ? (hb + 360) / 2 : (hb - 360) / 2;
  const T = 1 - 0.17 * Math.cos((hb - 30) * rad) + 0.24 * Math.cos(2 * hb * rad) + 0.32 * Math.cos((3 * hb + 6) * rad) - 0.2 * Math.cos((4 * hb - 63) * rad);
  const Rc = 2 * Math.sqrt(Cpb ** 7 / (Cpb ** 7 + 25 ** 7));
  const Rt = -Math.sin(2 * 30 * Math.exp(-(((hb - 275) / 25) ** 2)) * rad) * Rc;
  const Sl = 1 + (0.015 * (Lb - 50) ** 2) / Math.sqrt(20 + (Lb - 50) ** 2);
  const [Sc, Sh] = [1 + 0.045 * Cpb, 1 + 0.015 * Cpb * T];
  const [dl, dc, dhh] = [(L2 - L1) / Sl, (C2 - C1) / Sc, dH / Sh];
  return Math.sqrt(dl ** 2 + dc ** 2 + dhh ** 2 + Rt * dc * dhh);
}

test('CIEDE2000 matches Sharma et al. reference pair', () => {
  assert.equal(de2000([50, 2.6772, -79.7751], [50, 0, -82.7485]).toFixed(4), '2.0425');
});

const cvd = (() => {
  const failures = [];
  let min = Infinity;
  for (const [scheme, col] of [['light', 0], ['dark', 1]])
    for (const [name, m] of Object.entries(MACHADO)) {
      const L = chartCategorical().slice(0, 6).map((pair) => lab(simulate(linRgb(pair[col]), m)));
      for (let i = 0; i < 6; i++)
        for (let j = i + 1; j < 6; j++) {
          const d = de2000(L[i], L[j]);
          min = Math.min(min, d);
          if (j === i + 1 && d < 10) failures.push(`${scheme}/${name} chart-${i + 1}↔${j + 1}: ΔE00 ${d.toFixed(1)}`);
        }
    }
  return { failures, min };
})();

test(`first six chart colours stay apart under protan/deutan/tritan (adjacent ΔE00 ≥ 10; min all-pairs ΔE00 ${cvd.min.toFixed(1)})`, () => {
  assert.deepEqual(cvd.failures, []);
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
