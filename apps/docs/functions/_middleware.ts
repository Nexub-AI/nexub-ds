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
 *
 * Styles: <style> elements need the nonce too (style-src-elem). Inline style=""
 * attributes (React style={}) are allowed via style-src-attr. Runtime-injected
 * <style> (Radix / react-remove-scroll) reads the nonce from
 * <meta name="csp-nonce">, which this function adds to <head>.
 * Exception: /m (Expo / react-native-web) injects <style> at runtime with no
 * nonce support, so it keeps 'unsafe-inline' for style elements.
 *
 * Trusted Types is report-only for now: violations show in the console.
 * 'nextjs' and 'nextjs#bundler' are the policies Next 16 creates.
 *
 * /m/* is the React Native web preview (apps/mobile build:web) and /frame/*
 * the page-template frames. Docs pages frame them, so they alone may be
 * framed, and only by this origin.
 */

const mobilePreview = (path: string) => path === '/m' || path.startsWith('/m/');

const framedPreview = (path: string) => mobilePreview(path) || path.startsWith('/frame/');

const CSP = (nonce: string, frameAncestors: string, styleElem: string) =>
  [
    "default-src 'self'",
    `script-src 'nonce-${nonce}' 'strict-dynamic' 'self' https: 'unsafe-inline'`,
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

export const onRequest: PagesFunction = async ({ request, next }) => {
  const res = await next();
  if (!(res.headers.get('content-type') ?? '').includes('text/html')) return res;

  const bytes = crypto.getRandomValues(new Uint8Array(16));
  const nonce = btoa(String.fromCharCode(...bytes));

  const out = new Response(res.body, res);
  const path = new URL(request.url).pathname;
  const preview = framedPreview(path);
  const styleElem = mobilePreview(path) ? "'unsafe-inline'" : `'nonce-${nonce}'`;
  out.headers.set('Content-Security-Policy', CSP(nonce, preview ? "'self'" : "'none'", styleElem));
  out.headers.set(
    'Content-Security-Policy-Report-Only',
    "require-trusted-types-for 'script'; trusted-types nextjs nextjs#bundler",
  );
  out.headers.set('X-Frame-Options', preview ? 'SAMEORIGIN' : 'DENY');
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
