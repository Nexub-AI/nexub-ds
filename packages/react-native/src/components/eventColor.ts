// 12.5: an event's `color` (any brand colour) as a container, text and marker that stay readable,
// ported from web EventCalendar's eventColor.ts. Web mixes in CSS against the surface token; here
// the theme's own surface role is known, so the mix is computed against it directly.

type Lab = [number, number, number];
type Rgb = [number, number, number];

/** How much of the colour goes into the surface for the container (as web). */
const MIX = { light: 0.2, dark: 0.3 } as const;
const TEXT_TARGET = 4.5 + 0.3;
/** The start time beside the title is drawn at 80% opacity; the text colour must pass there too. */
const TIME_OPACITY = 0.8;
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

const luminance = (rgb: Rgb) => {
  const [r, g, b] = rgb.map(lin) as Rgb;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: Rgb, b: Rgb) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((p, q) => q - p) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
};

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
  if (text.length > 64) return null;
  const hex = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/.exec(text);
  if (hex) {
    const h = hex[1]!.length <= 4 ? hex[1]!.replace(/./g, '$&$&') : hex[1]!;
    return hexToRgb('#' + h.slice(0, 6));
  }
  const fn = /^(rgba?|hsla?|oklab|oklch)\(/.exec(text);
  if (!fn || !text.endsWith(')')) return null;
  const inner = text.slice(fn[0].length, -1);
  if (inner.includes('(') || inner.includes(')')) return null;
  const parts = inner.split(/[\s,/]+/).filter(Boolean);
  if (parts.length < 3 || parts.slice(0, 3).some((p) => !/^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[-+]?\d+)?(?:%|deg|grad|rad|turn)?$/.test(p))) return null;
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

const composite = (fg: Rgb, bg: Rgb, alpha: number): Rgb => fg.map((c, i) => c * alpha + bg[i]! * (1 - alpha)) as Rgb;
const mixLab = (x: Lab, y: Lab, t: number): Lab => [x[0] * t + y[0] * (1 - t), x[1] * t + y[1] * (1 - t), x[2] * t + y[2] * (1 - t)];
const atLightness = ([, a, b]: Lab, L: number, maxChroma: number): Rgb => {
  const c = Math.hypot(a, b);
  const k = c > maxChroma ? maxChroma / c : 1;
  return labToRgb([L, a * k, b * k]);
};

/** Steps the lightness from `from` towards black (`dir` -1) or white (+1) until `target` contrast on `bg`. */
function reach(lab: Lab, bg: Rgb, target: number, from: number, dir: 1 | -1, maxChroma: number, alpha = 1): Rgb {
  for (let L = from; L >= 0 && L <= 1; L += dir * 0.02) {
    const rgb = atLightness(lab, L, maxChroma);
    if (contrast(composite(rgb, bg, alpha), bg) >= target) return rgb;
  }
  return atLightness(lab, dir < 0 ? 0 : 1, 0);
}

export interface EventColors {
  container: string;
  onContainer: string;
  marker: string;
}

const cache = new Map<string, EventColors | null>();

/**
 * Container, text and marker for an event `color` on the theme's `surface` (a hex role), or `null`
 * (with a development warning) when the colour can't be read: the event then keeps its tone.
 */
export function eventColors(color: string, surface: string, scheme: 'light' | 'dark'): EventColors | null {
  const key = `${color}|${surface}|${scheme}`;
  if (cache.has(key)) return cache.get(key)!;
  const rgb = parseColor(color);
  const bg = parseColor(surface) ?? hexToRgb(scheme === 'dark' ? '#131313' : '#f9f9f9');
  let out: EventColors | null = null;
  if (rgb) {
    const lab = rgbToLab(rgb);
    const dark = scheme === 'dark';
    const container = labToRgb(mixLab(lab, rgbToLab(bg), MIX[scheme]));
    const onContainer = reach(lab, container, TEXT_TARGET, dark ? 0.86 : 0.42, dark ? 1 : -1, 0.1, TIME_OPACITY);
    // The marker keeps the colour when it already stands out from the surface (3:1), else moves just far enough.
    const marker = contrast(rgb, bg) >= MARKER_TARGET ? rgb : reach(lab, bg, MARKER_TARGET, lab[0], dark ? 1 : -1, Infinity);
    out = { container: toHex(container), onContainer: toHex(onContainer), marker: toHex(marker) };
  } else if (__DEV__) {
    console.warn(`EventCalendar: can't read the colour ${JSON.stringify(color)}; use hex, rgb(), hsl(), oklab() or oklch(). The event keeps its tone.`);
  }
  if (cache.size > 200) cache.clear();
  cache.set(key, out);
  return out;
}
