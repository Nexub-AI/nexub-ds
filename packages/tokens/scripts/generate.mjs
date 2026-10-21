// Generated foundations for the "Calm Depth" refresh (DESIGN_REFRESH_PLAN.md §4):
// tonal palettes + color roles (via HCT, so tone gaps guarantee contrast) and
// spring easings (CSS linear()). Pure functions; build.mjs turns them into
// tokens and dist/css/roles.css.
import { Hct, TonalPalette, argbFromHex, hexFromArgb } from '@material/material-color-utilities';

// ─── Color ───────────────────────────────────────────────────────────────────

// Seeds keep today's hues; chroma is the seed's own (brand fidelity).
// Primary is the brand blue (#4099f1) nudged toward violet (hue 255 → 268):
// at hue 255 sRGB caps chroma at dark tones, so tone 40 came out a dull
// #0061a6. The neutrals keep the brand-mark hue (brand-tinted greys).
const BRAND = '#4099f1';
const SEEDS = {
  primary: '#0059c8',
  error: '#b91c1c',
  success: '#047857',
  warning: '#f59e0b',
  info: '#0059c8',
  leap: '#6366f1',
  bookub: '#10b981',
  payub: '#8b5cf6',
  founderub: '#f59e0b',
};
export const PRODUCTS = ['leap', 'bookub', 'payub', 'founderub'];

// 5/15/25/35/45/65/76/85 exist for data-contrast="medium" (halfway tones).
export const TONES = [0, 4, 5, 6, 10, 12, 15, 17, 20, 22, 24, 25, 30, 35, 40, 45, 50, 60, 65, 70, 72, 76, 80, 85, 87, 90, 92, 94, 95, 96, 98, 99, 100];

export function palettes() {
  const hct = (hex) => Hct.fromInt(argbFromHex(hex));
  const p = Object.fromEntries(
    Object.entries(SEEDS).map(([name, hex]) => [name, TonalPalette.fromHueAndChroma(hct(hex).hue, hct(hex).chroma)]),
  );
  const hue = hct(BRAND).hue;
  p.secondary = TonalPalette.fromHueAndChroma(hct(SEEDS.primary).hue, 16);
  p.neutral = TonalPalette.fromHueAndChroma(hue, 4);
  p['neutral-variant'] = TonalPalette.fromHueAndChroma(hue, 8);
  return Object.fromEntries(
    Object.entries(p).map(([name, pal]) => [name, Object.fromEntries(TONES.map((t) => [t, hexFromArgb(pal.tone(t))]))]),
  );
}

// role → [palette, light tone, dark tone, light tone (high), dark tone (high)]
// High contrast pushes accents/outlines/secondary text further from surfaces.
const accent = (pal) => ({
  [pal]: [pal, 40, 80, 30, 90],
  [`on-${pal}`]: [pal, 100, 20, 100, 10],
  [`${pal}-container`]: [pal, 90, 30, 90, 30],
  [`on-${pal}-container`]: [pal, 10, 90, 0, 100],
});
export const ROLES = {
  ...accent('primary'),
  ...accent('secondary'),
  ...accent('error'),
  ...accent('success'),
  ...accent('warning'),
  ...accent('info'),
  // Product accents, always available (badges, dots, tags), whatever the
  // data-product. Tertiary is the *current* product; these name each one.
  ...accent('leap'),
  ...accent('bookub'),
  ...accent('payub'),
  ...accent('founderub'),
  surface: ['neutral', 98, 6, 98, 6],
  'surface-dim': ['neutral', 87, 6, 87, 6],
  'surface-bright': ['neutral', 98, 24, 98, 24],
  'surface-container-lowest': ['neutral', 100, 4, 100, 4],
  'surface-container-low': ['neutral', 96, 10, 96, 10],
  'surface-container': ['neutral', 94, 12, 94, 12],
  'surface-container-high': ['neutral', 92, 17, 92, 17],
  'surface-container-highest': ['neutral', 90, 22, 90, 22],
  // Not an M3 role: floating layers (menus, popovers, dialogs). White in light,
  // lighter than the page in dark (Apple's elevated background).
  'surface-elevated': ['neutral', 100, 17, 100, 17],
  'on-surface': ['neutral', 10, 90, 0, 100],
  'on-surface-variant': ['neutral-variant', 30, 80, 20, 90],
  // Not an M3 role: tertiary text that still clears 4.5:1 on every container.
  'on-surface-muted': ['neutral-variant', 40, 72, 30, 80],
  outline: ['neutral-variant', 50, 60, 30, 80],
  'outline-variant': ['neutral-variant', 80, 30, 50, 60],
  'inverse-surface': ['neutral', 20, 90, 20, 90],
  'inverse-on-surface': ['neutral', 95, 20, 100, 0],
  'inverse-primary': ['primary', 80, 40, 80, 40],
  // Behind modals and under image captions; black in both themes.
  scrim: ['neutral', 0, 0, 0, 0],
};
// Product brands remap the tertiary family.
export const tertiary = (product) =>
  Object.fromEntries(
    Object.entries(accent('tertiary')).map(([role, [, ...tones]]) => [role, [product, ...tones]]),
  );

// Contrast levels. Medium sits halfway between standard and high, snapped
// to the nearest generated tone.
export const LEVELS = ['standard', 'medium', 'high'];
const snap = (t) => TONES.reduce((a, b) => (Math.abs(b - t) < Math.abs(a - t) ? b : a));
export const tonesAt = ([pal, l, d, hl, hd], level) =>
  level === 'high' ? [pal, hl, hd] : level === 'medium' ? [pal, snap((l + hl) / 2), snap((d + hd) / 2)] : [pal, l, d];

// Wide gamut: accent fills get 18% more OKLCH chroma on P3 screens. Lightness
// is untouched, so contrast pairs move by a hair at most.
export const P3_ROLES = ['primary', 'tertiary', 'error', 'success', 'warning', 'info', ...PRODUCTS];
const P3_BOOST = 1.18;

const tone = (pal, t) => `var(--color-palette-${pal}-${t})`;
const boost = (c) => `oklch(from ${c} l calc(c * ${P3_BOOST}) h)`;
const decls = (roles, level, p3 = false) =>
  Object.entries(roles)
    .filter(([role]) => !p3 || P3_ROLES.includes(role))
    .map(([role, entry]) => {
      const [pal, l, d] = tonesAt(entry, level);
      const [a, b] = [tone(pal, l), tone(pal, d)].map((c) => (p3 ? boost(c) : c));
      return `  --color-${role}: light-dark(${a}, ${b});`;
    })
    .join('\n');

// ─── Data visualisation ──────────────────────────────────────────────────────

// Categorical series: [HCT hue, light tone, dark tone] at chroma 80 (clamped to
// sRGB). Hues: brand blue 268, amber 70 (founderub), emerald 165 (bookub),
// pink 355, violet 300 (payub), cyan 215, red 25, lime 130. Leap's indigo
// (285) sits too close to the brand blue to be its own series.
// Tones vary per series so the first six stay ≥ ΔE2000 12 apart (all pairs)
// under protanopia/deuteranopia/tritanopia simulation in both schemes, and
// every series clears 3:1 on surface and surface-container (WCAG 1.4.11).
// generate.test.mjs checks both.
export const CHART = [
  [268, 40, 74],
  [70, 55, 70],
  [165, 40, 74],
  [355, 45, 82],
  [300, 55, 58],
  [215, 55, 58],
  [25, 45, 70],
  [130, 50, 80],
];
export const chartCategorical = () =>
  CHART.map(([h, l, d]) => [l, d].map((t) => hexFromArgb(Hct.from(h, 80, t).toInt())));
// Sequential: primary, light → strong (light 90→30, dark 20→80).
export const CHART_SEQ = [90, 80, 70, 60, 50, 40, 30].map((l, i) => ['primary', l, 20 + i * 10]);
// Diverging: error → neutral → primary; the midpoint sits near the surface.
export const CHART_DIV = [
  ['error', 40, 80],
  ['error', 60, 60],
  ['error', 80, 40],
  ['neutral', 90, 20],
  ['primary', 80, 40],
  ['primary', 60, 60],
  ['primary', 40, 80],
];
export const CHART_KEYS = [
  ...CHART.map((_, i) => `${i + 1}`),
  ...CHART_SEQ.map((_, i) => `seq-${i + 1}`),
  ...CHART_DIV.map((_, i) => `div-${i + 1}`),
];

function chartCss() {
  return [
    ...chartCategorical().map(([l, d], i) => `  --color-chart-${i + 1}: light-dark(${l}, ${d});`),
    ...CHART_SEQ.map(([p, l, d], i) => `  --color-chart-seq-${i + 1}: light-dark(${tone(p, l)}, ${tone(p, d)});`),
    ...CHART_DIV.map(([p, l, d], i) => `  --color-chart-div-${i + 1}: light-dark(${tone(p, l)}, ${tone(p, d)});`),
  ].join('\n');
}

function contrastBlocks(p3) {
  const all = { ...ROLES, ...tertiary('primary') };
  const at = (lvl, sel) => `[data-contrast='${lvl}']${sel}, [data-contrast='${lvl}'] ${sel}`;
  const auto = (sel) => `:root:not([data-contrast])${sel}, :root:not([data-contrast]) ${sel}`;
  const brands = PRODUCTS.map((p) => {
    const sel = `[data-product='${p}']`;
    const roles = tertiary(p);
    return [
      `${sel} {\n${decls(roles, 'standard', p3)}\n}`,
      `${at('medium', sel)} {\n${decls(roles, 'medium', p3)}\n}`,
      `${at('high', sel)} {\n${decls(roles, 'high', p3)}\n}`,
      `@media (prefers-contrast: more) {\n${auto(sel)} {\n${decls(roles, 'high', p3)}\n}\n}`,
    ].join('\n');
  });
  return [
    `:root, [data-contrast='standard'] {\n${decls(all, 'standard', p3)}\n}`,
    `[data-contrast='medium'] {\n${decls(all, 'medium', p3)}\n}`,
    `[data-contrast='high'] {\n${decls(all, 'high', p3)}\n}`,
    `@media (prefers-contrast: more) {\n:root:not([data-contrast]) {\n${decls(all, 'high', p3)}\n}\n}`,
    ...brands,
  ].join('\n\n');
}

export function rolesCss() {
  return `/* Auto-generated by @nexub/tokens (scripts/generate.mjs). Do not edit.
   Color roles. Each role is light-dark(light tone, dark tone), so it follows
   color-scheme, which data-theme sets below (nested themes work too).
   Contrast: data-contrast="medium" | "high" (prefers-contrast: more → high).
   Chart palettes (--color-chart-*) override the static hex in variables.css,
   which loads first. On P3 screens, accent fills gain OKLCH chroma. */

:root, [data-theme='light'] { color-scheme: light; }
[data-theme='dark'] { color-scheme: dark; }
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) { color-scheme: dark; }
}

${contrastBlocks(false)}

:root {
${chartCss()}
}

@media (color-gamut: p3) {
@supports (color: oklch(from red l c h)) {
${contrastBlocks(true)}
}
}
`;
}

// ─── Motion ──────────────────────────────────────────────────────────────────

// Damped spring from 0 → 1 (mass 1), sampled into a CSS linear() easing.
// Duration = time until it stays within 0.1% of the target.
export function spring(damping, stiffness, points = 40) {
  const w0 = Math.sqrt(stiffness);
  const x = (t) => {
    if (damping < 1) {
      const wd = w0 * Math.sqrt(1 - damping * damping);
      return 1 - Math.exp(-damping * w0 * t) * (Math.cos(wd * t) + ((damping * w0) / wd) * Math.sin(wd * t));
    }
    return 1 - Math.exp(-w0 * t) * (1 + w0 * t); // critically damped
  };
  let settle = 0;
  for (let t = 0; t < 5; t += 0.001) if (Math.abs(1 - x(t)) > 0.001) settle = t;
  settle = Math.ceil(settle * 1000) / 1000;
  const stops = Array.from({ length: points + 1 }, (_, i) => {
    const v = i === points ? 1 : x((settle * i) / points);
    return +v.toFixed(4);
  });
  return { easing: `linear(${stops.join(', ')})`, duration: `${Math.round(settle * 1000)}ms`, stops };
}

// M3 Standard (spatial damping 0.9) for product UI; effects never overshoot;
// expressive is opt-in for toggles / success / drag release.
export const SPRINGS = {
  spatial: { fast: [0.9, 1400], default: [0.9, 700], slow: [0.9, 300] },
  effects: { fast: [1, 3800], default: [1, 1600], slow: [1, 800] },
  expressive: { fast: [0.7, 800], default: [0.8, 380], slow: [0.8, 200] },
};
