// URL guards for consumer- or LLM-supplied values rendered into href / src.
// Browsers ignore tabs, newlines and leading control/space characters when
// parsing a scheme ("java\tscript:" runs), so the scheme is read from a
// stripped probe while the original string is what gets rendered.

const SCHEME = /^([a-z][a-z0-9+.-]*):/i;
const DANGEROUS = new Set(['javascript', 'vbscript', 'data', 'file']);
const STRICT_HREF = new Set(['http', 'https', 'mailto', 'tel', 'sms']);

function scheme(url: string): string | null {
  // eslint-disable-next-line no-control-regex -- stripping control chars is the point
  const probe = url.replace(/[\u0000- \u007f]+/g, '');
  return SCHEME.exec(probe)?.[1]?.toLowerCase() ?? null;
}

export interface SafeHrefOptions {
  /**
   * `false` (7.x default): block script-capable schemes (`javascript:`,
   * `vbscript:`, `data:`, `file:`), allow everything else.
   * `true` (8.0 default): allow only relative URLs, `#…`, http(s), mailto, tel and sms.
   */
  strict?: boolean;
}

/** A link target that can't run script. Returns `undefined` when blocked. */
export function safeHref(url: string | null | undefined, { strict = false }: SafeHrefOptions = {}): string | undefined {
  if (!url) return undefined;
  const s = scheme(url);
  if (s === null) return url; // relative, #hash, ?query
  if (strict) return STRICT_HREF.has(s) ? url : undefined;
  return DANGEROUS.has(s) ? undefined : url;
}

/** An image source: relative, http(s), blob: or a data:image/* URL. */
export function safeSrc(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  const s = scheme(url);
  if (s === null || s === 'http' || s === 'https' || s === 'blob') return url;
  return s === 'data' && /^data:image\//i.test(url.trim()) ? url : undefined;
}
