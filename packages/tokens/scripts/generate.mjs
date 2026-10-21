// Generated foundations for the "Calm Depth" refresh (DESIGN_REFRESH_PLAN.md §4):
// tonal palettes + color roles (via HCT, so tone gaps guarantee contrast) and
// spring easings (CSS linear()). Pure functions; build.mjs turns them into
// tokens and dist/css/roles.css.
import { Hct, TonalPalette, hexFromArgb } from '@material/material-color-utilities';
import { LEVELS, ROLES, TONES, tertiary, tonalPalette, toneHex, tonesAt } from '../src/roles.js';

// The role → tone table and palette generation live in src/roles.js, shared
// with the runtime seed theming entry (@nexub/tokens/seed).
export { LEVELS, ROLES, TONES, tertiary, tonesAt };

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

export function palettes() {
  const p = Object.fromEntries(Object.entries(SEEDS).map(([name, hex]) => [name, tonalPalette(hex)]));
  const hue = tonalPalette(BRAND).hue;
  p.secondary = TonalPalette.fromHueAndChroma(tonalPalette(SEEDS.primary).hue, 16);
  p.neutral = TonalPalette.fromHueAndChroma(hue, 4);
  p['neutral-variant'] = TonalPalette.fromHueAndChroma(hue, 8);
  return Object.fromEntries(
    Object.entries(p).map(([name, pal]) => [name, Object.fromEntries(TONES.map((t) => [t, toneHex(pal, t)]))]),
  );
}

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
