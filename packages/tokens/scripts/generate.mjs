// Generated foundations for the "Calm Depth" refresh (DESIGN_REFRESH_PLAN.md §4):
// tonal palettes + color roles (via HCT, so tone gaps guarantee contrast) and
// spring easings (CSS linear()). Pure functions; build.mjs turns them into
// tokens and dist/css/roles.css.
import { readFileSync } from 'node:fs';
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

// { name: TonalPalette } → { name: { tone: hex } } over every generated tone.
const toneMap = (p) =>
  Object.fromEntries(
    Object.entries(p).map(([name, pal]) => [name, Object.fromEntries(TONES.map((t) => [t, toneHex(pal, t)]))]),
  );

export function palettes() {
  const p = Object.fromEntries(Object.entries(SEEDS).map(([name, hex]) => [name, tonalPalette(hex)]));
  const hue = tonalPalette(BRAND).hue;
  p.secondary = TonalPalette.fromHueAndChroma(tonalPalette(SEEDS.primary).hue, 16);
  p.neutral = TonalPalette.fromHueAndChroma(hue, 4);
  p['neutral-variant'] = TonalPalette.fromHueAndChroma(hue, 8);
  return toneMap(p);
}

// ─── Signature style (7.9 opt-in, the default in 8.0) ────────────────────────
// ROADMAP_7.x.md "The Material question": keep the engine (HCT roles, tone
// gaps, state layers, springs), change the face. Signature swaps only the four
// palettes behind the roles and keeps the role → tone table, so every WCAG
// pair still holds by construction (generate.test.mjs checks it again).
//
// Primary leads with the Nexub mark's indigo (--color-brand-mark-1) instead of
// the M3-adjacent #0059c8. It shares Leap's hue family (#6366f1, hue 285).
export const SIGNATURE_SEED = '#242cdd';
// Neutrals instead of the brand-tinted lavender (chroma 4/8 at hue 255):
// surfaces at zero chroma (true grey), and a faint warm cast (hue 70) only on
// neutral-variant (secondary text, outlines). HCT tints near-white tones hard,
// so even chroma 1 reads pink on a surface: keep surfaces at 0.
const SIGNATURE_NEUTRAL = { hue: 70, chroma: 0, variantChroma: 1.5 };
// Secondary drives `tonal` buttons and nav indicators: chroma 6 on the brand
// hue reads as a neutral-tinted container, not M3's pastel (chroma 16).
const SIGNATURE_SECONDARY_CHROMA = 6;

/** Signature replacements for primary, secondary, neutral and neutral-variant (same shape as palettes()). */
export function signaturePalettes() {
  const brand = tonalPalette(SIGNATURE_SEED);
  const { hue, chroma, variantChroma } = SIGNATURE_NEUTRAL;
  return toneMap({
    primary: brand,
    secondary: TonalPalette.fromHueAndChroma(brand.hue, SIGNATURE_SECONDARY_CHROMA),
    neutral: TonalPalette.fromHueAndChroma(hue, chroma),
    'neutral-variant': TonalPalette.fromHueAndChroma(hue, variantChroma),
  });
}

// Non-colour signature values, shared by roles.css and @nexub/tokens/native.
export const SIGNATURE = {
  // px. Controls and fields at ~10px, cards 16px (overlay/tooltip/min unchanged).
  // Chips, tags, segmented and toggles should stay pills: see --shape-pill in
  // @nexub/themes/signature.css.
  shape: { control: 10, field: 10, container: 16 },
  // em. Display roles one notch tighter than classic.
  tracking: { 'display-xl': -0.05, 'display-lg': -0.035, 'display-md': -0.03, 'display-sm': -0.025 },
  // Crisper, lower elevation: a hairline ring does the separating, so blur is
  // smaller and tighter (negative spread) than classic.
  elevation: {
    1: '0 0 0 1px light-dark(rgb(0 0 0 / 0.08), rgb(255 255 255 / 0.08)), 0 1px 2px light-dark(rgb(0 0 0 / 0.05), rgb(0 0 0 / 0.4))',
    2: '0 0 0 1px light-dark(rgb(0 0 0 / 0.08), rgb(255 255 255 / 0.1)), 0 1px 2px light-dark(rgb(0 0 0 / 0.05), rgb(0 0 0 / 0.4)), 0 6px 16px -4px light-dark(rgb(0 0 0 / 0.1), rgb(0 0 0 / 0.5))',
    3: '0 0 0 1px light-dark(rgb(0 0 0 / 0.08), rgb(255 255 255 / 0.1)), 0 2px 4px light-dark(rgb(0 0 0 / 0.06), rgb(0 0 0 / 0.45)), 0 16px 36px -8px light-dark(rgb(0 0 0 / 0.16), rgb(0 0 0 / 0.6))',
  },
};

// Roles that read a signature palette. Restated on a signature *subtree*
// (on <html> the palette swap alone is enough, see signatureCss()).
export const signatureRoles = () => {
  const sig = signaturePalettes();
  return Object.fromEntries(Object.entries(ROLES).filter(([, [pal]]) => pal in sig));
};

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

// Category colours (10.3): eight named hues for icon chips, tags and avatars,
// one per chart series so a category keeps its colour between a chip and a
// chart. Each has a text colour for surfaces and a container pair; all three
// clear 4.5:1 in both schemes (generate.test.mjs).
export const CATEGORIES = ['blue', 'amber', 'emerald', 'pink', 'violet', 'cyan', 'red', 'lime'];
const hct = (h, c, t) => hexFromArgb(Hct.from(h, c, t).toInt());
export const categoryColors = () =>
  CATEGORIES.map((name, i) => {
    const h = CHART[i][0];
    return {
      name,
      text: [hct(h, 60, 38), hct(h, 50, 82)],
      container: [hct(h, 32, 92), hct(h, 30, 26)],
      onContainer: [hct(h, 48, 22), hct(h, 40, 90)],
    };
  });
function categoryCss() {
  return categoryColors()
    .flatMap((c) => [
      `  --color-category-${c.name}: light-dark(${c.text.join(', ')});`,
      `  --color-category-${c.name}-container: light-dark(${c.container.join(', ')});`,
      `  --color-on-category-${c.name}-container: light-dark(${c.onContainer.join(', ')});`,
    ])
    .join('\n');
}

function chartCss() {
  return [
    ...chartCategorical().map(([l, d], i) => `  --color-chart-${i + 1}: light-dark(${l}, ${d});`),
    ...CHART_SEQ.map(([p, l, d], i) => `  --color-chart-seq-${i + 1}: light-dark(${tone(p, l)}, ${tone(p, d)});`),
    ...CHART_DIV.map(([p, l, d], i) => `  --color-chart-div-${i + 1}: light-dark(${tone(p, l)}, ${tone(p, d)});`),
  ].join('\n');
}

const at = (lvl, sel) => `[data-contrast='${lvl}']${sel}, [data-contrast='${lvl}'] ${sel}`;
const auto = (sel) => `:root:not([data-contrast])${sel}, :root:not([data-contrast]) ${sel}`;
// A scoped role set at every contrast level (products, signature subtrees).
const levelBlocks = (sel, roles, p3) =>
  [
    `${sel} {\n${decls(roles, 'standard', p3)}\n}`,
    `${at('medium', sel)} {\n${decls(roles, 'medium', p3)}\n}`,
    `${at('high', sel)} {\n${decls(roles, 'high', p3)}\n}`,
    `@media (prefers-contrast: more) {\n${auto(sel)} {\n${decls(roles, 'high', p3)}\n}\n}`,
  ].join('\n');

function contrastBlocks(p3) {
  const all = { ...ROLES, ...tertiary('primary') };
  const brands = PRODUCTS.map((p) => levelBlocks(`[data-product='${p}']`, tertiary(p), p3));
  return [
    `:root, [data-contrast='standard'] {\n${decls(all, 'standard', p3)}\n}`,
    `[data-contrast='medium'] {\n${decls(all, 'medium', p3)}\n}`,
    `[data-contrast='high'] {\n${decls(all, 'high', p3)}\n}`,
    `@media (prefers-contrast: more) {\n:root:not([data-contrast]) {\n${decls(all, 'high', p3)}\n}\n}`,
    ...brands,
  ].join('\n\n');
}

// Signature is the only style (default since 8.0; classic removed in 9.0). It
// re-points the palette tones the roles read, so every role, contrast level,
// product, P3 boost and dark scheme follows with no restated role table.
// Order: after variables.css (the token-source values on :root, same
// specificity), so this block wins.
function styleCss() {
  // Only the tones the generated roles and charts read (about half), to keep
  // roles.css small. Direct --color-palette-* use outside the roles keeps variables.css.
  const used = new Set(contrastBlocks(false).concat(chartCss()).match(/--color-palette-[\w-]+?-\d+\b/g));
  const lines = [
    ...Object.entries(signaturePalettes()).flatMap(([name, tones]) =>
      Object.entries(tones)
        .filter(([t]) => used.has(`--color-palette-${name}-${t}`))
        .map(([t, hex]) => `  --color-palette-${name}-${t}: ${hex};`),
    ),
    ...Object.entries(SIGNATURE.shape).map(([k, px]) => `  --shape-${k}: ${px >= 9999 ? `${px}px` : rem(px)};`),
    ...Object.entries(SIGNATURE.tracking).map(([role, em]) => `  --type-${role}-letterSpacing: ${em}em;`),
    ...Object.entries(SIGNATURE.elevation).map(([lvl, s]) => `  --elevation-${lvl}: ${s};`),
  ];
  return `/* Signature style: neutral palettes, brand-indigo primary, ~10px controls, crisp elevation. */\n:root {\n${lines.join('\n')}\n}`;
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
${categoryCss()}
}

${styleCss()}

@media (color-gamut: p3) {
@supports (color: oklch(from red l c h)) {
${contrastBlocks(true)}
}
}
`;
}

// ─── Divisions and apps (10.1) ───────────────────────────────────────────────
// The five Nexub divisions and their apps (tokens/product/divisions.json). A
// division's accent scale is hand-picked in tokens/color.json; its tertiary
// roles come from an HCT palette seeded with the scale's 500, so they hold the
// same WCAG pairs as the built-in brands. These palettes are not on :root:
// the theme CSS below (shipped by @nexub/themes) carries the hex, so an app
// that never loads a division theme pays nothing for them.
const source = (f) => JSON.parse(readFileSync(new URL(`../tokens/${f}`, import.meta.url), 'utf8'));
const MAP = source('product/divisions.json');
const SCALES = source('color.json').color.accent;
export const DIVISIONS = Object.keys(MAP.divisions);
export const DIVISION_APPS = MAP.divisions;
export const APP_ALIASES = MAP.aliases;
/** Every data-product key: apps, then aliases. */
export const PRODUCT_KEYS = [...Object.values(MAP.divisions).flat(), ...Object.keys(MAP.aliases)];
export const divisionPalettes = () =>
  toneMap(Object.fromEntries(DIVISIONS.map((d) => [d, tonalPalette(SCALES[d]['500'].$value)])));

const STEPS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
// Tertiary roles for `scale`: hex for a division, palette vars for a built-in product.
function tertiaryDecls(scale, level) {
  const hex = divisionPalettes()[scale];
  return Object.entries(tertiary(scale))
    .map(([role, entry]) => {
      const [pal, l, d] = tonesAt(entry, level);
      const [a, b] = hex ? [hex[l], hex[d]] : [tone(pal, l), tone(pal, d)];
      return `  --color-${role}: light-dark(${a}, ${b});`;
    })
    .join('\n');
}
const accentDecls = (scale) =>
  [
    ...STEPS.map((s) => `  --color-accent-${s}: var(--color-accent-${scale}-${s});`),
    '  --color-ring-default: var(--color-tertiary); /* >= 3:1 on every surface */',
    ...(DIVISIONS.includes(scale)
      ? [`  --color-fill-accent: var(--color-accent-${scale}-fill);`, `  --color-fill-accent-hover: var(--color-accent-${scale}-fill-hover);`]
      : [`  --color-fill-accent: var(--color-fill-${scale});`, `  --color-fill-accent-hover: var(--color-fill-${scale}-hover);`]),
  ].join('\n');
const group = (sels) => (sels.length > 1 ? `:is(${sels.join(', ')})` : sels[0]);
// Tertiary at the medium / high contrast levels (standard is in the main block).
const contrastOnly = (sel, scale) =>
  [
    `${at('medium', sel)} {\n${tertiaryDecls(scale, 'medium')}\n}`,
    `${at('high', sel)} {\n${tertiaryDecls(scale, 'high')}\n}`,
    `@media (prefers-contrast: more) {\n${auto(sel)} {\n${tertiaryDecls(scale, 'high')}\n}\n}`,
  ].join('\n');
const themeBlock = (sels, scale) =>
  `${group(sels)} {\n${accentDecls(scale)}\n${tertiaryDecls(scale, 'standard')}\n}\n${contrastOnly(group(sels), scale)}`;
const header = (name, what) =>
  `/* @nexub/themes — ${name}\n   Auto-generated from @nexub/tokens (tokens/product/divisions.json + color.json)\n   by scripts/build-products.mjs. Do not edit.\n   ${what} */\n\n`;

/** One division: [data-division='os'] remaps --color-accent-*, the tertiary roles, the ring and the accent fill. */
export const divisionCss = (d) =>
  header(`divisions/${d}.css`, `Overrides the accent to the ${d} division scale under [data-division='${d}'].`) +
  themeBlock([`[data-division='${d}']`], d) + '\n';

/** All five divisions in one file. */
export const divisionsCss = () =>
  header('divisions.css', 'Overrides the accent under [data-division]: ' + DIVISIONS.join(', ') + '.') +
  DIVISIONS.map((d) => themeBlock([`[data-division='${d}']`], d)).join('\n\n') + '\n';

/** Every app key under [data-product]. An app with its own scale keeps it (and
 * its tertiary roles from roles.css); the rest inherit their division's. */
export function productsCss() {
  const sel = (p) => `[data-product='${p}']`;
  const blocks = [];
  for (const [d, apps] of Object.entries(DIVISION_APPS)) {
    const inherit = apps.filter((a) => !SCALES[a]);
    if (inherit.length) blocks.push(themeBlock(inherit.map(sel), d));
    for (const app of apps.filter((a) => SCALES[a])) {
      const aliases = Object.keys(APP_ALIASES).filter((a) => APP_ALIASES[a] === app).map(sel);
      blocks.push(`${[sel(app), ...aliases].join(', ')} {\n${accentDecls(app)}\n}`);
      // roles.css only knows the canonical key: restate the tertiary roles for an alias.
      if (aliases.length)
        blocks.push(`${group(aliases)} {\n${tertiaryDecls(app, 'standard')}\n}\n${contrastOnly(group(aliases), app)}`);
    }
  }
  return header('products.css', 'Overrides the accent under [data-product] for every app: ' + PRODUCT_KEYS.join(', ') + '.') + blocks.join('\n\n') + '\n';
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

// 12.3 motion language: named presets by intent, each an alias of one spring
// above (web: --motion-preset-<intent>-easing/-duration, ease-<intent> /
// duration-<intent>; native: native.motion.preset.<intent>). They choose a
// spring, never a new curve, so a theme that retunes a spring moves its presets.
//   enter     something arrives (overlays, rows, toasts): spatial, a hair of settle
//   exit      something leaves: effects fast, quicker than enter, no overshoot
//   emphasis  a state lands (switch thumb, selected dot): expressive fast
//   success   a task completed (success check): expressive default
//   attention look here / that didn't work (shake, count tick): spatial fast
export const MOTION_PRESETS = {
  enter: ['spatial', 'default'],
  exit: ['effects', 'fast'],
  emphasis: ['expressive', 'fast'],
  success: ['expressive', 'default'],
  attention: ['spatial', 'fast'],
};

// rem by default (opt-in layer in 2.6, the default since 3.0): spacing, radius,
// shape, type sizes, line heights and control heights in rem at a 16px root, so
// they follow the user's browser font size together. Hairlines (1px) and capsules
// (9999px) stay px: they must not scale. `groups` maps a CSS variable prefix to a
// token object; nested groups (type.body-md.size) flatten with '-'. The JS and
// native outputs keep px / points.
const rem = (px) => `${px / 16}rem`;
export function remValues(groups) {
  const out = new Map();
  const walk = (prefix, node) => {
    for (const [key, t] of Object.entries(node)) {
      if (t.$value === undefined) walk(`${prefix}-${key}`, t);
      else if (/^[\d.]+px$/.test(t.$value)) {
        const px = parseFloat(t.$value);
        if (px > 1 && px < 9999) out.set(`--${prefix}-${key}`, rem(px));
      }
    }
  };
  for (const [prefix, node] of Object.entries(groups)) walk(prefix, node);
  return out;
}

/** Rewrite those declarations in generated CSS (variables.css) to their rem values. */
export function applyRem(css, groups) {
  const values = remValues(groups);
  return css.replace(/^(\s*)(--[\w-]+): [^;]+;/gm, (m, indent, name) => (values.has(name) ? `${indent}${name}: ${values.get(name)};` : m));
}

// @nexub/tokens/css/rem stays importable so 2.x setups keep working; it is a no-op now. One short
// comment (12.8), so the file stays within a 100 B budget.
export const REM_COMPAT_CSS = '/* Empty: @nexub/tokens/css is in rem since 3.0. Kept for old imports. */\n';
