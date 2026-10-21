// @ts-check
// Role → tone table and HCT palette generation, shared by the build
// (scripts/generate.mjs → dist/css/roles.css) and the runtime seed theming
// entry (@nexub/tokens/seed). Plain JS so the build script can import it
// before tsc runs; tsc (allowJs) emits it and its .d.ts into dist/js.
//
// @material/material-color-utilities is pinned to 0.3.0: 0.4.0 ships broken ESM.
import { Hct, TonalPalette, argbFromHex, hexFromArgb } from '@material/material-color-utilities';

/** @typedef {[palette: string, light: number, dark: number, highLight: number, highDark: number]} RoleTones */
/** @typedef {'standard' | 'medium' | 'high'} ContrastLevel */

// 5/15/25/35/45/65/76/85 exist for data-contrast="medium" (halfway tones).
export const TONES = [0, 4, 5, 6, 10, 12, 15, 17, 20, 22, 24, 25, 30, 35, 40, 45, 50, 60, 65, 70, 72, 76, 80, 85, 87, 90, 92, 94, 95, 96, 98, 99, 100];

/** Tonal palette from a hex colour: its own hue and chroma (brand fidelity).
 * @param {string} hex */
export function tonalPalette(hex) {
  const hct = Hct.fromInt(argbFromHex(hex));
  return TonalPalette.fromHueAndChroma(hct.hue, hct.chroma);
}

/** @param {TonalPalette} pal @param {number} tone */
export const toneHex = (pal, tone) => hexFromArgb(pal.tone(tone));

// role → [palette, light tone, dark tone, light tone (high), dark tone (high)]
// High contrast pushes accents/outlines/secondary text further from surfaces.
/** @param {string} pal @returns {Record<string, RoleTones>} */
export const accent = (pal) => ({
  [pal]: [pal, 40, 80, 30, 90],
  [`on-${pal}`]: [pal, 100, 20, 100, 10],
  [`${pal}-container`]: [pal, 90, 30, 90, 30],
  [`on-${pal}-container`]: [pal, 10, 90, 0, 100],
});
/** @type {Record<string, RoleTones>} */
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
/** @param {string} product @returns {Record<string, RoleTones>} */
export const tertiary = (product) =>
  Object.fromEntries(
    Object.entries(accent('tertiary')).map(([role, [, ...tones]]) => [role, [product, ...tones]]),
  );

// Contrast levels. Medium sits halfway between standard and high, snapped
// to the nearest generated tone.
/** @type {ContrastLevel[]} */
export const LEVELS = ['standard', 'medium', 'high'];
/** @param {number} t */
const snap = (t) => TONES.reduce((a, b) => (Math.abs(b - t) < Math.abs(a - t) ? b : a));
/** @param {RoleTones} entry @param {ContrastLevel} level @returns {[string, number, number]} */
export const tonesAt = ([pal, l, d, hl, hd], level) =>
  level === 'high' ? [pal, hl, hd] : level === 'medium' ? [pal, snap((l + hl) / 2), snap((d + hd) / 2)] : [pal, l, d];
