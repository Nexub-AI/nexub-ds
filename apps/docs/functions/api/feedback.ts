/**
 * POST /api/feedback — Cloudflare Pages Function
 *
 * Receives a multipart form from the client, verifies the Turnstile token
 * server-side, optionally uploads a screenshot to R2, then posts a Google
 * Chat card v2 to the configured webhook URL.
 *
 * Bindings (set in the Cloudflare Pages dashboard, not in source):
 *   - GOOGLE_CHAT_WEBHOOK_URL  (encrypted env var)
 *   - TURNSTILE_SECRET_KEY     (encrypted env var)
 *   - FEEDBACK_SCREENSHOTS     (R2 bucket binding)
 *
 * Public env (committed via next.config.mjs and Pages plain env):
 *   - NEXT_PUBLIC_TURNSTILE_SITE_KEY
 *
 * See apps/docs/FEEDBACK_SETUP.md for the full configuration walkthrough.
 */

interface Env {
  GOOGLE_CHAT_WEBHOOK_URL: string;
  TURNSTILE_SECRET_KEY: string;
  FEEDBACK_SCREENSHOTS: R2Bucket;
}

interface ParsedBody {
  category: string;
  message: string;
  email: string;
  screenshot: File | null;
  turnstileToken: string;
  website: string;
  context: BrowserContext | null;
}

interface BrowserContext {
  url?: string;
  ua?: string;
  viewport?: string;
  theme?: string;
  locale?: string;
}

const ALLOWED_CATEGORIES = new Set(['bug', 'suggestion', 'question', 'other']);
const ALLOWED_IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp']);
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
// Image + text fields + multipart overhead. Checked before parsing the body.
const MAX_BODY_BYTES = MAX_IMAGE_BYTES + 256 * 1024;
const MIN_MESSAGE = 10;
const MAX_MESSAGE = 2000;

// Per-IP rate limit, per Worker isolate only — Cloudflare runs many isolates, so
// this is a speed bump, not a guarantee. The real limit is the WAF rate-limiting
// rule documented in FEEDBACK_SETUP.md.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 3;
const recentByIp = new Map<string, number[]>();
const RATE_LIMIT_MAX_IPS = 1000;

function rateLimit(ip: string): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  // Bound memory: drop the map when it grows past the cap (all entries are at
  // most one window old anyway).
  if (recentByIp.size > RATE_LIMIT_MAX_IPS) recentByIp.clear();
  const bucket = (recentByIp.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (bucket.length >= RATE_LIMIT_MAX) {
    const oldest = bucket[0]!;
    return { ok: false, retryAfter: Math.ceil((RATE_LIMIT_WINDOW_MS - (now - oldest)) / 1000) };
  }
  bucket.push(now);
  recentByIp.set(ip, bucket);
  return { ok: true, retryAfter: 0 };
}

function jsonResponse(status: number, body: unknown, extraHeaders?: HeadersInit): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', ...(extraHeaders ?? {}) },
  });
}

/** Google Chat textParagraph/keyValue render a subset of HTML — escape all user input. */
export function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const EMAIL_RE = /^[^\s@<>"'&]+@[^\s@<>"'&]+\.[^\s@<>"'&]+$/;
export function isValidEmail(s: string): boolean {
  return s.length <= 254 && EMAIL_RE.test(s);
}

function httpUrlOrUndefined(s: string): string | undefined {
  try {
    const u = new URL(s);
    return u.protocol === 'https:' || u.protocol === 'http:' ? u.href : undefined;
  } catch {
    return undefined;
  }
}

/** Returns the real image MIME type from magic bytes, or null if not png/jpeg/webp. */
export function sniffImageType(b: Uint8Array): string | null {
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return 'image/png';
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg';
  if (
    b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
    b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50
  ) return 'image/webp';
  return null;
}

function pickContext(raw: unknown): BrowserContext | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const out: BrowserContext = {};
  if (typeof r.url === 'string') out.url = httpUrlOrUndefined(r.url.slice(0, 500));
  if (typeof r.ua === 'string') out.ua = r.ua.slice(0, 300);
  if (typeof r.viewport === 'string') out.viewport = r.viewport.slice(0, 50);
  if (typeof r.theme === 'string') out.theme = r.theme.slice(0, 30);
  if (typeof r.locale === 'string') out.locale = r.locale.slice(0, 30);
  return out;
}

async function parseBody(request: Request): Promise<ParsedBody | null> {
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.includes('multipart/form-data')) return null;
  const fd = await request.formData();
  const category = String(fd.get('category') ?? '');
  const message = String(fd.get('message') ?? '');
  const email = String(fd.get('email') ?? '');
  const turnstileToken = String(fd.get('cf-turnstile-response') ?? '');
  const website = String(fd.get('website') ?? '');
  const contextRaw = fd.get('context');
  let context: BrowserContext | null = null;
  if (typeof contextRaw === 'string' && contextRaw) {
    try {
      context = pickContext(JSON.parse(contextRaw));
    } catch {
      // ignore — bad JSON, drop context silently
    }
  }
  const screenshotEntry = fd.get('screenshot');
  const screenshot = screenshotEntry instanceof File && screenshotEntry.size > 0 ? screenshotEntry : null;
  return { category, message, email, screenshot, turnstileToken, website, context };
}

async function verifyTurnstile(token: string, secret: string, ip: string): Promise<boolean> {
  if (!token || !secret) return false;
  const body = new FormData();
  body.set('secret', secret);
  body.set('response', token);
  body.set('remoteip', ip);
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

function extFromMime(mime: string): string {
  if (mime === 'image/png') return '.png';
  if (mime === 'image/jpeg') return '.jpg';
  if (mime === 'image/webp') return '.webp';
  return '.bin';
}

interface ChatCardInput {
  category: string;
  message: string;
  email: string;
  context: BrowserContext | null;
  screenshotUrl: string | null;
  timestamp: string;
}

function buildChatCard(input: ChatCardInput): unknown {
  const emoji =
    input.category === 'bug' ? '🐞' :
    input.category === 'suggestion' ? '💡' :
    input.category === 'question' ? '❓' : '📝';
  const titleCategory = input.category.charAt(0).toUpperCase() + input.category.slice(1);

  const chips: { keyValue: { topLabel: string; content: string } }[] = [];
  if (input.context?.url) {
    chips.push({ keyValue: { topLabel: 'Page', content: escapeHtml(input.context.url) } });
  }
  if (input.context?.viewport) {
    chips.push({ keyValue: { topLabel: 'Viewport', content: escapeHtml(input.context.viewport) } });
  }
  if (input.context?.theme) {
    chips.push({ keyValue: { topLabel: 'Theme', content: escapeHtml(input.context.theme) } });
  }
  if (input.context?.locale) {
    chips.push({ keyValue: { topLabel: 'Locale', content: escapeHtml(input.context.locale) } });
  }
  if (input.context?.ua) {
    chips.push({ keyValue: { topLabel: 'User agent', content: escapeHtml(input.context.ua) } });
  }
  if (input.email) {
    chips.push({ keyValue: { topLabel: 'Email', content: escapeHtml(input.email) } });
  }

  const sections: unknown[] = [
    {
      widgets: [{ textParagraph: { text: escapeHtml(input.message) } }],
    },
  ];
  if (chips.length > 0) {
    sections.push({ widgets: chips });
  }
  if (input.screenshotUrl) {
    sections.push({
      widgets: [
        {
          buttons: [
            {
              textButton: {
                text: 'View screenshot',
                onClick: { openLink: { url: input.screenshotUrl } },
              },
            },
          ],
        },
      ],
    });
  }
  sections.push({
    widgets: [{ textParagraph: { text: `<i>Submitted ${input.timestamp}</i>` } }],
  });

  return {
    cards: [
      {
        header: {
          title: `${emoji} New ${titleCategory} feedback`,
          subtitle: 'Nexub DS docs',
        },
        sections,
      },
    ],
  };
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const ip = request.headers.get('cf-connecting-ip') ?? 'unknown';

  const limit = rateLimit(ip);
  if (!limit.ok) {
    return jsonResponse(429, { error: 'rate_limited' }, { 'retry-after': String(limit.retryAfter) });
  }

  // Reject oversized bodies before buffering them in formData().
  const contentLength = Number(request.headers.get('content-length'));
  if (!contentLength) return jsonResponse(411, { error: 'length_required' });
  if (contentLength > MAX_BODY_BYTES) return jsonResponse(413, { error: 'too_large' });

  const parsed = await parseBody(request);
  if (!parsed) return jsonResponse(400, { error: 'invalid' });

  // Honeypot — bots usually fill this hidden field
  if (parsed.website.length > 0) return jsonResponse(400, { error: 'invalid' });

  if (!ALLOWED_CATEGORIES.has(parsed.category)) {
    return jsonResponse(400, { error: 'invalid' });
  }
  const trimmed = parsed.message.trim();
  if (trimmed.length < MIN_MESSAGE) return jsonResponse(400, { error: 'invalid' });
  if (trimmed.length > MAX_MESSAGE) return jsonResponse(400, { error: 'too_long' });
  if (parsed.email && !isValidEmail(parsed.email)) {
    return jsonResponse(400, { error: 'invalid' });
  }

  // Cheap local checks first, then the Turnstile round-trip.
  let imageType: string | null = null;
  if (parsed.screenshot) {
    if (parsed.screenshot.size > MAX_IMAGE_BYTES) {
      return jsonResponse(400, { error: 'bad_image' });
    }
    // Trust the bytes, not the client-declared MIME type.
    imageType = sniffImageType(new Uint8Array(await parsed.screenshot.slice(0, 12).arrayBuffer()));
    if (!imageType || !ALLOWED_IMAGE_TYPES.has(imageType)) {
      return jsonResponse(400, { error: 'bad_image' });
    }
  }

  // Fail closed: a missing secret must not silently disable the CAPTCHA.
  if (!env.TURNSTILE_SECRET_KEY) {
    console.error('[feedback] TURNSTILE_SECRET_KEY not set — rejecting submission');
    return jsonResponse(503, { error: 'not_configured' });
  }
  const ok = await verifyTurnstile(parsed.turnstileToken, env.TURNSTILE_SECRET_KEY, ip);
  if (!ok) return jsonResponse(400, { error: 'turnstile_failed' });

  // Optional screenshot → R2
  let screenshotUrl: string | null = null;
  if (parsed.screenshot && imageType) {
    if (!env.FEEDBACK_SCREENSHOTS) {
      // Bucket not bound yet — drop the screenshot but accept the rest.
      // Reviewer will wire R2 in the dashboard before relying on this.
    } else {
      try {
        const key = `${crypto.randomUUID()}${extFromMime(imageType)}`;
        await env.FEEDBACK_SCREENSHOTS.put(key, parsed.screenshot.stream(), {
          httpMetadata: { contentType: imageType },
        });
        const origin = new URL(request.url).origin;
        screenshotUrl = `${origin}/api/feedback/screenshot/${key}`;
      } catch {
        return jsonResponse(500, { error: 'r2_failed' });
      }
    }
  }

  if (!env.GOOGLE_CHAT_WEBHOOK_URL) {
    // Webhook not configured yet — return ok so the form looks healthy in
    // staging, but log to the Pages tail. Production must always have this.
    console.warn('[feedback] GOOGLE_CHAT_WEBHOOK_URL not set — submission discarded');
    return jsonResponse(200, { ok: true, warning: 'webhook_not_configured' });
  }

  const card = buildChatCard({
    category: parsed.category,
    message: trimmed,
    email: parsed.email,
    context: parsed.context,
    screenshotUrl,
    timestamp: new Date().toISOString(),
  });

  let webhookRes: Response;
  try {
    webhookRes = await fetch(env.GOOGLE_CHAT_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify(card),
    });
  } catch {
    return jsonResponse(500, { error: 'webhook_failed' });
  }
  if (!webhookRes.ok) return jsonResponse(500, { error: 'webhook_failed' });

  return jsonResponse(200, { ok: true });
};

/* IMPORTANT: do NOT export `onRequest` from this module.
 * Cloudflare Pages Functions treat `onRequest` as a catch-all that intercepts
 * EVERY method — including POST — before the method-specific `onRequestPost`
 * gets a chance to run. Earlier we exported a no-op `onRequest` to render a
 * cleaner 405 for the GET smoke test, and it ate live POST traffic in
 * production. Cloudflare's default 405 for unhandled methods is already fine. */
