// @ts-check
// @nexub/tokens/seed — runtime brand theming from one seed colour (white-label).
// Uses the same HCT palette generation and role → tone table as the build
// (src/roles.js), so a seeded accent family meets the same WCAG pairs as the
// built-in ones: roles are HCT tones, and tone gaps fix contrast for any hue.
import { LEVELS, ROLES, accent, tonalPalette, toneHex, tonesAt } from './roles.js';

/**
 * @typedef {object} SeedThemeOptions
 * @property {'standard' | 'medium' | 'high'} [contrast] Contrast level (matches `data-contrast`). Default 'standard'.
 * @property {'primary' | 'tertiary'} [target] Accent family to seed. 'tertiary' is the product brand. Default 'primary'.
 */

const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

/**
 * CSS custom properties for the accent family derived from `seed`, as
 * `light-dark(<light>, <dark>)` values (same shape as dist/css/roles.css).
 * target 'primary': primary, on-primary, primary-container, on-primary-container, inverse-primary.
 * target 'tertiary': tertiary, on-tertiary, tertiary-container, on-tertiary-container.
 * @param {string} seed Hex colour, `#rgb` or `#rrggbb`.
 * @param {SeedThemeOptions} [options]
 * @returns {Record<string, string>} e.g. `createSeedTheme('#4099f1')['--color-primary'] === 'light-dark(#0061a6, #a0c9ff)'`
 */
export function createSeedTheme(seed, { contrast = 'standard', target = 'primary' } = {}) {
  const { light, dark } = createSeedRoles(seed, { contrast, target });
  /** @type {Record<string, string>} */
  const vars = {};
  for (const role of Object.keys(light)) vars[`--color-${role}`] = `light-dark(${light[role]}, ${dark[role]})`;
  return vars;
}

/**
 * The same accent family as plain hex per scheme, for React Native
 * (`@nexub/react-native` merges it over the built-in roles).
 * @param {string} seed Hex colour, `#rgb` or `#rrggbb`.
 * @param {SeedThemeOptions} [options]
 * @returns {{ light: Record<string, string>, dark: Record<string, string> }}
 */
export function createSeedRoles(seed, { contrast = 'standard', target = 'primary' } = {}) {
  if (typeof seed !== 'string' || !HEX.test(seed))
    throw new TypeError(`@nexub/tokens/seed: seed must be a hex colour (#rgb or #rrggbb), got ${JSON.stringify(seed)}`);
  if (!LEVELS.includes(contrast))
    throw new TypeError(`@nexub/tokens/seed: contrast must be one of ${LEVELS.join(', ')}, got ${JSON.stringify(contrast)}`);
  if (target !== 'primary' && target !== 'tertiary')
    throw new TypeError(`@nexub/tokens/seed: target must be 'primary' or 'tertiary', got ${JSON.stringify(target)}`);
  const pal = tonalPalette(seed);
  const roles = { ...accent(target) };
  if (target === 'primary' && ROLES['inverse-primary']) roles['inverse-primary'] = ROLES['inverse-primary'];
  /** @type {{ light: Record<string, string>, dark: Record<string, string> }} */
  const out = { light: {}, dark: {} };
  for (const [role, entry] of Object.entries(roles)) {
    const [, l, d] = tonesAt(entry, contrast);
    out.light[role] = toneHex(pal, l);
    out.dark[role] = toneHex(pal, d);
  }
  return out;
}

/**
 * The same theme as a CSS rule, for SSR / static stylesheets (no flash, no JS):
 * `:root {\n  --color-primary: light-dark(…);\n  …\n}\n`.
 * @param {string} seed
 * @param {SeedThemeOptions & { selector?: string }} [options] `selector` defaults to ':root'.
 * @returns {string}
 */
export function createSeedThemeCss(seed, { selector = ':root', ...options } = {}) {
  const decls = Object.entries(createSeedTheme(seed, options)).map(([k, v]) => `  ${k}: ${v};`);
  return `${selector} {\n${decls.join('\n')}\n}\n`;
}

/**
 * WCAG 2.x contrast ratio between two hex colours, 1–21.
 * @param {string} a `#rrggbb`
 * @param {string} b `#rrggbb`
 * @returns {number}
 */
export function contrastRatio(a, b) {
  /** @param {string} hex */
  const lum = (hex) => {
    const c = (/** @type {number} */ i) => {
      const s = parseInt(hex.slice(i, i + 2), 16) / 255;
      return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * c(1) + 0.7152 * c(3) + 0.0722 * c(5);
  };
  const [x, y] = [lum(a), lum(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

/**
 * The full seeded theme as a stylesheet: standard contrast on `selector`, then
 * `data-contrast="medium"` and `"high"`, and high for `prefers-contrast: more`
 * when no `data-contrast` is set. Same layering as the built-in roles.css, so a
 * seeded brand follows the contrast switch like a built-in one.
 * @param {string} seed
 * @param {{ target?: 'primary' | 'tertiary', selector?: string }} [options] `selector` defaults to ':root'.
 * @returns {string}
 */
export function createSeedStylesheet(seed, { target = 'primary', selector = ':root' } = {}) {
  /** @param {'standard' | 'medium' | 'high'} contrast */
  const decls = (contrast) =>
    Object.entries(createSeedTheme(seed, { contrast, target })).map(([k, v]) => `  ${k}: ${v};`).join('\n');
  /** @param {string} lvl */
  const at = (lvl) => `${selector}[data-contrast='${lvl}'], [data-contrast='${lvl}'] ${selector}`;
  const auto = `${selector}:root:not([data-contrast]), :root:not([data-contrast]) ${selector}`;
  return [
    `${selector} {\n${decls('standard')}\n}`,
    `${at('medium')} {\n${decls('medium')}\n}`,
    `${at('high')} {\n${decls('high')}\n}`,
    `@media (prefers-contrast: more) {\n${auto} {\n${decls('high')}\n}\n}`,
  ].join('\n\n') + '\n';
}

/**
 * The seeded roles as W3C Design Tokens (DTCG) JSON, one document per scheme,
 * for Figma Variables / Tokens Studio / Style Dictionary.
 * @param {string} seed
 * @param {SeedThemeOptions} [options]
 * @returns {{ light: Record<string, unknown>, dark: Record<string, unknown> }}
 */
export function createSeedTokens(seed, options = {}) {
  const { light, dark } = createSeedRoles(seed, options);
  /** @param {Record<string, string>} roles */
  const doc = (roles) => ({
    color: Object.fromEntries(Object.entries(roles).map(([role, hex]) => [role, { $type: 'color', $value: hex }])),
  });
  return { light: doc(light), dark: doc(dark) };
}
