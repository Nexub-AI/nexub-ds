import { contrastRatio } from '../ColorPicker/contrast.js';

// A brand colour (hex, rgb(), hsl(), oklab(), oklch()) turned into an event's container, text and marker colours
// that stay readable in light and dark. The container is a CSS color-mix() of the colour into the surface token;
// the text and marker are picked here, against the same mix over the default light and dark surfaces
// (neutral tones 98 and 6), with a little headroom for themed surfaces.

type Lab = [number, number, number];
type Rgb = [number, number, number];

/** Default `--color-surface` in light and dark (neutral tone 98 / 6), for the maths only; CSS uses the token. */
const grey = (v: number) => '#' + v.toString(16).repeat(3);
export const SURFACE = { light: grey(0xf9), dark: grey(0x13) } as const;
/** How much of the colour goes into the surface for the container. */
export const MIX = { light: 0.2, dark: 0.3 } as const;
const TEXT_TARGET = 4.5 + 0.3;
/** The start time beside the title is drawn at 80% opacity; the text colour must pass there too. */
export const TIME_OPACITY = 0.8;
const MARKER_TARGET = 3;

const lin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const gam = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

function rgbToLab([r, g, b]: Rgb): Lab {
  const [R, G, B] = [lin(r), lin(g), lin(b)];
  const l = Math.cbrt(0.4122214708 * R + 0.5363015719 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function labToRgb([L, a, b]: Lab): Rgb {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((c) => clamp01(gam(c))) as Rgb;
}

const toHex = (rgb: Rgb) => '#' + rgb.map((c) => Math.round(c * 255).toString(16).padStart(2, '0')).join('');
const hexToRgb = (hex: string): Rgb => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255) as Rgb;

/** A number, a percentage of `full`, or an angle in degrees (deg / turn / rad / grad). */
function num(token: string, full = 1): number {
  const v = parseFloat(token);
  if (token.endsWith('%')) return (v / 100) * full;
  if (token.endsWith('turn')) return v * 360;
  if (token.endsWith('grad')) return v * 0.9;
  if (token.endsWith('rad')) return (v * 180) / Math.PI;
  return v;
}

/** sRGB (0–1 per channel) for hex, rgb(), hsl(), oklab() or oklch(); `null` for anything else. Alpha is ignored. */
export function parseColor(input: string): Rgb | null {
  const text = input.trim().toLowerCase();
  const hex = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/.exec(text);
  if (hex) {
    const h = hex[1]!.length <= 4 ? hex[1]!.replace(/./g, '$&$&') : hex[1]!;
    return hexToRgb('#' + h.slice(0, 6));
  }
  const fn = /^(rgba?|hsla?|oklab|oklch)\(\s*([^)]*)\)$/.exec(text);
  if (!fn) return null;
  const parts = fn[2]!.split(/[\s,/]+/).filter(Boolean);
  if (parts.length < 3 || parts.slice(0, 3).some((p) => !/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?(%|deg|grad|rad|turn)?$/.test(p))) return null;
  const [a, b, c] = parts as [string, string, string];
  switch (fn[1]) {
    case 'rgb':
    case 'rgba':
      return [a, b, c].map((p) => clamp01(num(p, 255) / 255)) as Rgb;
    case 'hsl':
    case 'hsla': {
      const h = (((num(a) % 360) + 360) % 360) / 360;
      const s = clamp01(num(b, 1));
      const l = clamp01(num(c, 1));
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      const hue = (t: number) => {
        t = (t + 1) % 1;
        return t < 1 / 6 ? p + (q - p) * 6 * t : t < 1 / 2 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p;
      };
      return [hue(h + 1 / 3), hue(h), hue(h - 1 / 3)];
    }
    case 'oklab':
      return labToRgb([num(a, 1), num(b, 0.4), num(c, 0.4)]);
    default: {
      const h = (num(c) * Math.PI) / 180;
      const ch = num(b, 0.4);
      return labToRgb([num(a, 1), ch * Math.cos(h), ch * Math.sin(h)]);
    }
  }
}

/** `fg` at `alpha` over `bg`, as the browser composites opacity (in sRGB). */
export const composite = (fg: string, bg: string, alpha: number): string => {
  const [f, b] = [hexToRgb(fg), hexToRgb(bg)];
  return toHex(f.map((c, i) => c * alpha + b[i]! * (1 - alpha)) as Rgb);
};

const mixLab = (x: Lab, y: Lab, t: number): Lab => [x[0] * t + y[0] * (1 - t), x[1] * t + y[1] * (1 - t), x[2] * t + y[2] * (1 - t)];

/** The colour's hue at lightness `L` (chroma capped so it stays a tint, not a neon). */
const atLightness = ([, a, b]: Lab, L: number, maxChroma: number): string => {
  const c = Math.hypot(a, b);
  const k = c > maxChroma ? maxChroma / c : 1;
  return toHex(labToRgb([L, a * k, b * k]));
};

/** Steps the lightness from `from` towards black (`dir` -1) or white (+1) until `target` contrast on `bg`. */
function reach(lab: Lab, bg: string, target: number, from: number, dir: 1 | -1, maxChroma: number, alpha = 1): string {
  for (let L = from; L >= 0 && L <= 1; L += dir * 0.02) {
    const hex = atLightness(lab, L, maxChroma);
    if ((contrastRatio(composite(hex, bg, alpha), bg) ?? 0) >= target) return hex;
  }
  return atLightness(lab, dir < 0 ? 0 : 1, 0);
}

export interface EventColorScheme {
  /** The parsed colour, normalised. */
  base: string;
  /** The container as computed here over the default surface (CSS mixes into the live surface token). */
  container: string;
  onContainer: string;
  marker: string;
}

/** Container, text and marker for one theme; `null` when the colour can't be parsed. */
export function eventColorScheme(color: string, theme: 'light' | 'dark'): EventColorScheme | null {
  const rgb = parseColor(color);
  if (!rgb) return null;
  const lab = rgbToLab(rgb);
  const surface = SURFACE[theme];
  const container = toHex(labToRgb(mixLab(lab, rgbToLab(hexToRgb(surface)), MIX[theme])));
  const dark = theme === 'dark';
  const onContainer = reach(lab, container, TEXT_TARGET, dark ? 0.86 : 0.42, dark ? 1 : -1, 0.1, TIME_OPACITY);
  // The marker keeps the colour when it already stands out from the surface (3:1), else moves just far enough.
  const base = toHex(rgb);
  const marker =
    (contrastRatio(base, surface) ?? 0) >= MARKER_TARGET ? base : reach(lab, surface, MARKER_TARGET, lab[0], dark ? 1 : -1, Infinity);
  return { base, container, onContainer, marker };
}

const cache = new Map<string, Record<string, string> | null>();

/**
 * CSS custom properties for an event in `color` (light-dark() pairs, so they follow the theme), or `null`
 * with a dev warning when the colour can't be parsed (the event then keeps its tone).
 */
export function eventColorVars(color: string): Record<string, string> | null {
  if (cache.has(color)) return cache.get(color)!;
  const light = eventColorScheme(color, 'light');
  const dark = eventColorScheme(color, 'dark');
  let vars: Record<string, string> | null = null;
  if (light && dark) {
    const mix = (pct: number) => `color-mix(in oklab, ${light.base} ${pct * 100}%, var(--color-surface))`;
    vars = {
      '--nx-event-bg': `light-dark(${mix(MIX.light)}, ${mix(MIX.dark)})`,
      '--nx-event-fg': `light-dark(${light.onContainer}, ${dark.onContainer})`,
      '--nx-event-dot': `light-dark(${light.marker}, ${dark.marker})`,
    };
  } else if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
    console.warn(`EventCalendar: can't read the colour ${JSON.stringify(color)}; use hex, rgb(), hsl(), oklab() or oklch(). The event keeps its tone.`);
  }
  if (cache.size > 200) cache.clear();
  cache.set(color, vars);
  return vars;
}
