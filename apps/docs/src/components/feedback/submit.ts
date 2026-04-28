/**
 * Client-side submit helper. Builds a multipart FormData payload and posts
 * to the same-origin /api/feedback Pages Function. No CORS, no auth header.
 */

export type FeedbackCategory = 'bug' | 'suggestion' | 'question' | 'other';

export interface FeedbackContext {
  url: string;
  ua: string;
  viewport: string;
  theme: string;
  locale: string;
}

export interface FeedbackPayload {
  category: FeedbackCategory;
  message: string;
  email?: string;
  /** Accepts both File (from <input type="file">) and Blob (from in-browser
   *  capture / annotation flatten). Server only cares about MIME + size. */
  screenshot?: Blob | File | null;
  turnstileToken: string;
  /** Hidden honeypot — must be empty. */
  website?: string;
  context: FeedbackContext;
}

export type FeedbackResult =
  | { ok: true }
  | { ok: false; status: number; error: string };

export async function submitFeedback(payload: FeedbackPayload): Promise<FeedbackResult> {
  const fd = new FormData();
  fd.set('category', payload.category);
  fd.set('message', payload.message);
  if (payload.email) fd.set('email', payload.email);
  if (payload.screenshot) {
    // FormData requires a filename for raw Blobs (Files already carry one).
    // Pick from the MIME so the R2 + Chat link extension matches the bytes.
    const mime = payload.screenshot.type || 'image/png';
    const ext = mime === 'image/jpeg' ? 'jpg' : mime === 'image/webp' ? 'webp' : 'png';
    const filename =
      payload.screenshot instanceof File && payload.screenshot.name
        ? payload.screenshot.name
        : `screenshot.${ext}`;
    fd.set('screenshot', payload.screenshot, filename);
  }
  fd.set('cf-turnstile-response', payload.turnstileToken);
  fd.set('website', payload.website ?? '');
  fd.set('context', JSON.stringify(payload.context));

  let res: Response;
  try {
    res = await fetch('/api/feedback', { method: 'POST', body: fd });
  } catch {
    return { ok: false, status: 0, error: 'network_failed' };
  }

  if (res.ok) return { ok: true };

  let error = 'unknown';
  try {
    const body = (await res.json()) as { error?: string };
    if (body?.error) error = body.error;
  } catch {
    // non-JSON response, keep 'unknown'
  }
  return { ok: false, status: res.status, error };
}

export function readBrowserContext(): FeedbackContext {
  const w = typeof window === 'undefined' ? null : window;
  const d = typeof document === 'undefined' ? null : document;
  return {
    url: w ? w.location.href : '',
    ua: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    viewport: w ? `${w.innerWidth}×${w.innerHeight}` : '',
    theme: d ? d.documentElement.getAttribute('data-theme') ?? 'system' : 'system',
    locale: typeof navigator !== 'undefined' ? navigator.language : '',
  };
}
