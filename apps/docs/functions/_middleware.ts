/**
 * Per-request script nonce for HTML pages — Cloudflare Pages middleware.
 *
 * The static export inlines page-specific `self.__next_f` scripts, so a
 * hash-based CSP would need thousands of hashes. Instead every <script> in an
 * HTML response gets a fresh nonce, and script-src trusts only that nonce
 * ('strict-dynamic' lets those scripts load Next chunks and Turnstile).
 * Since 9.6 script-src is the nonce and 'strict-dynamic' only: no 'self', https:
 * or 'unsafe-inline' fallback for browsers older than the supported floor.
 *
 * Static assets skip this function via public/_routes.json. The CSP in
 * public/_headers stays as the fallback policy if this function never runs.
 *
 * Styles: <style> elements need the nonce too (style-src-elem). Inline style=""
 * attributes (React style={}) are allowed via style-src-attr. Runtime-injected
 * <style> (Radix / react-remove-scroll) reads the nonce from
 * <meta name="csp-nonce">, which this function adds to <head>.
 * Exception: /m (Expo / react-native-web) injects <style> at runtime with no
 * nonce support, so it keeps 'unsafe-inline' for style elements.
 *
 * Trusted Types is enforced since 9.6: a string can't reach innerHTML, script.src
 * or eval. 'nextjs' and 'nextjs#bundler' are the policies Next 16 creates;
 * 'default' (src/lib/trusted.ts, inlined first in <head>) is what a plain string
 * must pass: script URLs only from /_next/static/ and Turnstile, HTML only when it
 * has no markup in it, script text never. packages/react/visual/docs.security.spec.ts applies this
 * exact policy to every page of the static export and fails on any violation.
 * Exception: /m is report-only (Expo's web runtime loads its chunks by script.src).
 *
 * What still says 'unsafe-inline', and why:
 *   style-src-attr: server-rendered style="" attributes (React style={}). They can't
 *     run script; a nonce can't cover an attribute.
 *   style-src-elem on /m only: react-native-web injects <style> with no nonce support.
 *
 * /m/* is the React Native web preview (apps/mobile build:web) and /frame/*
 * the page-template frames. Docs pages frame them, so they alone may be
 * framed, and only by this origin.
 */

const mobilePreview = (path: string) => path === '/m' || path.startsWith('/m/');

const framedPreview = (path: string) => mobilePreview(path) || path.startsWith('/frame/');

export const TRUSTED_TYPES = "require-trusted-types-for 'script'; trusted-types nextjs nextjs#bundler default";

/** The policy for one HTML response. Exported for docs.security.spec.ts. */
export function contentSecurityPolicy(nonce: string, path: string): string {
  const styleElem = mobilePreview(path) ? "'unsafe-inline'" : `'nonce-${nonce}'`;
  const csp = CSP(nonce, framedPreview(path) ? "'self'" : "'none'", styleElem);
  return mobilePreview(path) ? csp : `${csp}; ${TRUSTED_TYPES}`;
}

const CSP = (nonce: string, frameAncestors: string, styleElem: string) =>
  [
    "default-src 'self'",
    `script-src 'nonce-${nonce}' 'strict-dynamic'`,
    "style-src 'self'",
    `style-src-elem 'self' ${styleElem}`,
    "style-src-attr 'unsafe-inline'",
    "img-src 'self' data: blob: https://i.pravatar.cc",
    "font-src 'self' data:",
    "connect-src 'self' https://challenges.cloudflare.com",
    "frame-src 'self' https://challenges.cloudflare.com",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    `frame-ancestors ${frameAncestors}`,
    'upgrade-insecure-requests',
  ].join('; ');

const HSTS = 'max-age=63072000; includeSubDomains';

export const onRequest: PagesFunction = async ({ request, next }) => {
  const res = await next();
  if (!(res.headers.get('content-type') ?? '').includes('text/html')) {
    // _headers only covers static assets, so Function answers (/api/*) get theirs here (9.8).
    if (!new URL(request.url).pathname.startsWith('/api/')) return res;
    const api = new Response(res.body, res);
    api.headers.set('X-Content-Type-Options', 'nosniff');
    api.headers.set('Strict-Transport-Security', HSTS);
    if (!api.headers.has('Cache-Control')) api.headers.set('Cache-Control', 'no-store');
    return api;
  }

  const bytes = crypto.getRandomValues(new Uint8Array(16));
  const nonce = btoa(String.fromCharCode(...bytes));

  const out = new Response(res.body, res);
  const path = new URL(request.url).pathname;
  const preview = framedPreview(path);
  out.headers.set('Content-Security-Policy', contentSecurityPolicy(nonce, path));
  if (mobilePreview(path)) out.headers.set('Content-Security-Policy-Report-Only', TRUSTED_TYPES);
  out.headers.set('X-Frame-Options', preview ? 'SAMEORIGIN' : 'DENY');
  // The nonce is per request, so this HTML must never sit in a shared cache (9.8).
  out.headers.set('Cache-Control', 'private, max-age=60, stale-while-revalidate=600');
  const addNonce = {
    element(el: Element) {
      el.setAttribute('nonce', nonce);
    },
  };
  // Script preloads are checked against script-src too, so they need it.
  return new HTMLRewriter()
    .on('script, style', addNonce)
    .on('link[rel="preload"][as="script"], link[rel="modulepreload"]', addNonce)
    .on('head', {
      element(el: Element) {
        el.prepend(`<meta name="csp-nonce" content="${nonce}">`, { html: true });
      },
    })
    .transform(out);
};
