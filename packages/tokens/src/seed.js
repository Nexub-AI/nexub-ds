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
  if (typeof seed !== 'string' || !HEX.test(seed))
    throw new TypeError(`@nexub/tokens/seed: seed must be a hex colour (#rgb or #rrggbb), got ${JSON.stringify(seed)}`);
  if (!LEVELS.includes(contrast))
    throw new TypeError(`@nexub/tokens/seed: contrast must be one of ${LEVELS.join(', ')}, got ${JSON.stringify(contrast)}`);
  if (target !== 'primary' && target !== 'tertiary')
    throw new TypeError(`@nexub/tokens/seed: target must be 'primary' or 'tertiary', got ${JSON.stringify(target)}`);
  const pal = tonalPalette(seed);
  const roles = { ...accent(target) };
  if (target === 'primary' && ROLES['inverse-primary']) roles['inverse-primary'] = ROLES['inverse-primary'];
  /** @type {Record<string, string>} */
  const vars = {};
  for (const [role, entry] of Object.entries(roles)) {
    const [, l, d] = tonesAt(entry, contrast);
    vars[`--color-${role}`] = `light-dark(${toneHex(pal, l)}, ${toneHex(pal, d)})`;
  }
  return vars;
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
