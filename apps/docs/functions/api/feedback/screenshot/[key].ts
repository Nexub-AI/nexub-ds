/**
 * GET /api/feedback/screenshot/[key] — Cloudflare Pages Function
 *
 * Streams an uploaded screenshot back from R2 by its UUID key. The key is the
 * only auth: keys are crypto.randomUUID() so brute-forcing is infeasible, and
 * the link is only ever shared inside the private Google Chat space. Links
 * stop working 30 days after upload.
 *
 * Bindings (set in the Cloudflare Pages dashboard):
 *   - FEEDBACK_SCREENSHOTS  (R2 bucket binding)
 */

interface Env {
  FEEDBACK_SCREENSHOTS: R2Bucket;
}

// Links expire with the bucket's 30-day lifecycle rule; this enforces it even
// before R2's (asynchronous) lifecycle deletion runs.
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

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
  const remaining = obj ? MAX_AGE_MS - (Date.now() - obj.uploaded.getTime()) : 0;
  if (!obj || remaining <= 0) return new Response('Not found', { status: 404 });

  // Only ever serve images inline; anything else downloads. nosniff + a
  // locked-down CSP stop a stored object from being rendered as HTML/script.
  const stored = obj.httpMetadata?.contentType ?? '';
  const isImage = SAFE_IMAGE_TYPES.has(stored);
  const headers = new Headers();
  // Never cache past the expiry.
  headers.set('cache-control', `private, max-age=${Math.min(3600, Math.floor(remaining / 1000))}`);
  headers.set('content-type', isImage ? stored : 'application/octet-stream');
  headers.set('content-disposition', isImage ? 'inline' : 'attachment');
  headers.set('x-content-type-options', 'nosniff');
  headers.set('content-security-policy', "default-src 'none'; sandbox");

  return new Response(obj.body, { headers });
};
