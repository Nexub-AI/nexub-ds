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

  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set('cache-control', 'private, max-age=86400, immutable');
  headers.set('content-type', obj.httpMetadata?.contentType ?? 'application/octet-stream');

  return new Response(obj.body, { headers });
};
