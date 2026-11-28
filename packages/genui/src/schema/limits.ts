import type { GenUILimits } from './types.js';

/** The ceilings (RFC #823): depth 16, 500 nodes, 256 kB of JSON. */
export const DEFAULT_LIMITS: Readonly<GenUILimits> = Object.freeze({ maxDepth: 16, maxNodes: 500, maxBytes: 256 * 1024 });

/** Keys refused anywhere in a document, at any depth. */
export const FORBIDDEN_KEYS: ReadonlySet<string> = new Set(['__proto__', 'constructor', 'prototype']);

/** The host's limits, each clamped to the default: a host can lower a limit, never raise it. */
export function resolveLimits(limits?: Partial<GenUILimits>): GenUILimits {
  const pick = (key: keyof GenUILimits) => {
    const v = limits?.[key];
    return typeof v === 'number' && Number.isFinite(v) && v >= 0 ? Math.min(Math.floor(v), DEFAULT_LIMITS[key]) : DEFAULT_LIMITS[key];
  };
  return { maxDepth: pick('maxDepth'), maxNodes: pick('maxNodes'), maxBytes: pick('maxBytes') };
}

/** JSON nesting allowed for a node depth: a node level is two JSON levels, plus room for props. */
export const jsonDepthFor = (maxDepth: number) => maxDepth * 2 + 8;

/** UTF-8 byte length without allocating (lone surrogates count as 3, as TextEncoder writes them). */
export function utf8Length(text: string): number {
  let n = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    if (c < 0x80) n += 1;
    else if (c < 0x800) n += 2;
    else if (c >= 0xd800 && c <= 0xdbff && i + 1 < text.length) {
      const d = text.charCodeAt(i + 1);
      if (d >= 0xdc00 && d <= 0xdfff) {
        n += 4;
        i++;
      } else n += 3;
    } else n += 3;
  }
  return n;
}
