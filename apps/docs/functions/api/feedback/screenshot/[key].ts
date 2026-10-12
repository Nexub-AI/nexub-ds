/**
 * GET /api/feedback/screenshot/[key] — Cloudflare Pages Function
 *
 * Streams an uploaded screenshot back from R2 by its UUID key. The key is the
 * only auth: keys are crypto.randomUUID() so brute-forcing is infeasible, and
 * the link is only ever shared inside the private Google Chat space.
 *
 * Bindings (set in the Cloudflare Pages dashboard):
 *   - FEEDBACK_SCREENSHOTS  (R2 bucket binding)
 */

interface Env {
  FEEDBACK_SCREENSHOTS: R2Bucket;
}

const SAFE_IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp']);

export const onRequestGet: PagesFunction<Env> = async ({ params, env }) => {
  const rawKey = params.key;
  const key = Array.isArray(rawKey) ? rawKey[0] : rawKey;
  if (!key || typeof key !== 'string') {
    return new Response('Not found', { status: 404 });
  }

  // Defensive: only accept the keys we generate (`<uuid>.<ext>`). Anything
  // weirder than that and we 404 without even hitting R2.
  if (!/^[a-f0-9-]{36}\.(png|jpg|jpeg|webp|bin)$/i.test(key)) {
    return new Response('Not found', { status: 404 });
  }

  if (!env.FEEDBACK_SCREENSHOTS) {
    return new Response('Bucket not configured', { status: 503 });
  }

  const obj = await env.FEEDBACK_SCREENSHOTS.get(key);
  if (!obj) return new Response('Not found', { status: 404 });

  // Only ever serve images inline; anything else downloads. nosniff + a
  // locked-down CSP stop a stored object from being rendered as HTML/script.
  const stored = obj.httpMetadata?.contentType ?? '';
  const isImage = SAFE_IMAGE_TYPES.has(stored);
  const headers = new Headers();
  headers.set('cache-control', 'private, max-age=86400, immutable');
  headers.set('content-type', isImage ? stored : 'application/octet-stream');
  headers.set('content-disposition', isImage ? 'inline' : 'attachment');
  headers.set('x-content-type-options', 'nosniff');
  headers.set('content-security-policy', "default-src 'none'; sandbox");

  return new Response(obj.body, { headers });
};
