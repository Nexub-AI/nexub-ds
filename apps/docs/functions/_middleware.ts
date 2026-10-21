/**
 * Per-request script nonce for HTML pages — Cloudflare Pages middleware.
 *
 * The static export inlines page-specific `self.__next_f` scripts, so a
 * hash-based CSP would need thousands of hashes. Instead every <script> in an
 * HTML response gets a fresh nonce, and script-src trusts only that nonce
 * ('strict-dynamic' lets those scripts load Next chunks and Turnstile).
 * 'self', https: and 'unsafe-inline' are ignored by CSP3 browsers once a nonce
 * is present; they only keep very old browsers working.
 *
 * Static assets skip this function via public/_routes.json. The CSP in
 * public/_headers stays as the fallback policy if this function never runs.
 */

const CSP = (nonce: string) =>
  [
    "default-src 'self'",
    `script-src 'nonce-${nonce}' 'strict-dynamic' 'self' https: 'unsafe-inline'`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://i.pravatar.cc",
    "font-src 'self' data:",
    "connect-src 'self' https://challenges.cloudflare.com",
    'frame-src https://challenges.cloudflare.com',
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    'upgrade-insecure-requests',
  ].join('; ');

export const onRequest: PagesFunction = async ({ next }) => {
  const res = await next();
  if (!(res.headers.get('content-type') ?? '').includes('text/html')) return res;

  const bytes = crypto.getRandomValues(new Uint8Array(16));
  const nonce = btoa(String.fromCharCode(...bytes));

  const out = new Response(res.body, res);
  out.headers.set('Content-Security-Policy', CSP(nonce));
  const addNonce = {
    element(el: Element) {
      el.setAttribute('nonce', nonce);
    },
  };
  // Script preloads are checked against script-src too, so they need it.
  return new HTMLRewriter()
    .on('script', addNonce)
    .on('link[rel="preload"][as="script"], link[rel="modulepreload"]', addNonce)
    .transform(out);
};
