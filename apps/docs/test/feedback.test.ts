// Runs with `node --test` (type stripping). Lives outside functions/ so Pages
// doesn't route it.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { escapeHtml, isValidEmail, onRequestPost, sniffImageType } from '../functions/api/feedback.ts';
import { onRequestGet } from '../functions/api/feedback/screenshot/[key].ts';

// Minimal Pages context; the handlers only read request/env/params.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ctx = (c: Record<string, unknown>) => c as any;

test('escapeHtml neutralises Chat card markup', () => {
  assert.equal(escapeHtml('<a href="x">hi</a> & <b>'), '&lt;a href=&quot;x&quot;&gt;hi&lt;/a&gt; &amp; &lt;b&gt;');
});

test('isValidEmail rejects markup characters', () => {
  assert.ok(isValidEmail('dev@nexub.ai'));
  assert.ok(!isValidEmail('<a>@x.io'));
  assert.ok(!isValidEmail('a"b@x.io'));
  assert.ok(!isValidEmail(`${'a'.repeat(250)}@x.io`));
});

test('sniffImageType trusts bytes, not names', () => {
  const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0, 0, 0, 0, 0, 0, 0, 0]);
  const jpg = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const webp = new TextEncoder().encode('RIFF\0\0\0\0WEBP');
  const html = new TextEncoder().encode('<html><script>');
  assert.equal(sniffImageType(png), 'image/png');
  assert.equal(sniffImageType(jpg), 'image/jpeg');
  assert.equal(sniffImageType(webp), 'image/webp');
  assert.equal(sniffImageType(html), null);
});

const post = (origin?: string) =>
  onRequestPost(
    ctx({
      request: new Request('https://staging.nexub-ds-docs.pages.dev/api/feedback', {
        method: 'POST',
        headers: origin ? { origin } : {},
      }),
      env: {},
    }),
  );

test('feedback POST rejects foreign or missing Origin', async () => {
  assert.equal((await post('https://evil.example')).status, 403);
  assert.equal((await post('https://nexub-ds-docs.pages.dev.evil.example')).status, 403);
  assert.equal((await post()).status, 403);
});

test('feedback POST lets allowed Origins past the origin gate', async () => {
  for (const o of [
    'https://staging.nexub-ds-docs.pages.dev', // same origin
    'https://nexub-ds-docs.pages.dev',
    'https://abc123.nexub-ds-docs.pages.dev',
  ]) {
    // No content-length, so the next gate answers 411.
    assert.equal((await post(o)).status, 411, o);
  }
});

const DAY = 24 * 60 * 60 * 1000;
const getShot = (uploadedDaysAgo: number) =>
  onRequestGet(
    ctx({
      params: { key: '0123abcd-0000-4000-8000-000000000000.png' },
      env: {
        FEEDBACK_SCREENSHOTS: {
          get: async () => ({
            uploaded: new Date(Date.now() - uploadedDaysAgo * DAY),
            httpMetadata: { contentType: 'image/png' },
            body: 'png',
          }),
        },
      },
    }),
  );

test('screenshot links expire after 30 days', async () => {
  const fresh = await getShot(1);
  assert.equal(fresh.status, 200);
  assert.equal(fresh.headers.get('cache-control'), 'private, max-age=3600');
  assert.equal(fresh.headers.get('x-content-type-options'), 'nosniff');
  assert.match((await getShot(30 - 1 / 24 / 60)).headers.get('cache-control')!, /max-age=\d{1,2}$/);
  assert.equal((await getShot(31)).status, 404);
});

// 9.6: the whole POST with Turnstile and the webhook stubbed: what is sent, what is logged.
const SECRET = 'turnstile-secret-value';
const WEBHOOK = 'https://chat.googleapis.com/v1/spaces/X/messages?key=webhook-key&token=webhook-token';
async function submit(ip: string, fields: Record<string, string>, webhookStatus = 200) {
  const fd = new FormData();
  for (const [k, v] of Object.entries({ category: 'bug', 'cf-turnstile-response': 'tok', ...fields })) fd.set(k, v);
  const body = new Request('https://x.test', { method: 'POST', body: fd });
  const bytes = await body.arrayBuffer();
  const sent: { url: string; body: string }[] = [];
  const logs: string[] = [];
  const realFetch = globalThis.fetch;
  const real = { error: console.error, warn: console.warn, log: console.log };
  globalThis.fetch = (async (url: string, init: RequestInit) => {
    if (String(url).includes('siteverify')) return Response.json({ success: true });
    sent.push({ url: String(url), body: String(init.body) });
    return new Response('', { status: webhookStatus });
  }) as typeof fetch;
  console.error = console.warn = console.log = (...a: unknown[]) => void logs.push(a.map(String).join(' '));
  try {
    const res = await onRequestPost(
      ctx({
        request: new Request('https://staging.nexub-ds-docs.pages.dev/api/feedback', {
          method: 'POST',
          headers: {
            origin: 'https://staging.nexub-ds-docs.pages.dev',
            'content-type': body.headers.get('content-type')!,
            'content-length': String(bytes.byteLength),
            'cf-connecting-ip': ip,
          },
          body: bytes,
        }),
        env: { TURNSTILE_SECRET_KEY: SECRET, GOOGLE_CHAT_WEBHOOK_URL: WEBHOOK },
      }),
    );
    return { res, sent, logs: logs.join('\n') };
  } finally {
    globalThis.fetch = realFetch;
    Object.assign(console, real);
  }
}

test('a submission reaches the webhook escaped, and nothing is logged', async () => {
  const message = '<img src=x onerror=alert(1)> the table header overlaps';
  const { res, sent, logs } = await submit('10.0.0.1', { message, email: 'dev@nexub.ai', context: JSON.stringify({ url: 'javascript:alert(1)', ua: '<b>ua</b>' }) });
  assert.equal(res.status, 200);
  assert.equal(sent.length, 1);
  assert.ok(sent[0]!.body.includes('&lt;img src=x onerror=alert(1)&gt;'));
  assert.ok(!sent[0]!.body.includes('<img'));
  assert.ok(!sent[0]!.body.includes('javascript:'), 'a non-http page URL is dropped');
  assert.ok(sent[0]!.body.includes('&lt;b&gt;ua&lt;/b&gt;'));
  assert.equal(logs, '');
});

test('a failing webhook is logged by status only: no URL, secret, message or email', async () => {
  const { res, logs } = await submit('10.0.0.2', { message: 'private words in the message', email: 'dev@nexub.ai' }, 502);
  assert.equal(res.status, 500);
  assert.match(logs, /webhook answered 502/);
  for (const secret of [SECRET, 'webhook-key', 'webhook-token', 'chat.googleapis.com', 'private words', 'dev@nexub.ai', '10.0.0.2']) {
    assert.ok(!logs.includes(secret), secret);
  }
});

test('input limits: long message, oversized context, bad category, honeypot', async () => {
  assert.equal((await submit('10.0.0.3', { message: 'x'.repeat(2001) })).res.status, 400);
  assert.equal((await submit('10.0.0.4', { message: 'a valid message here', category: 'spam' })).res.status, 400);
  assert.equal((await submit('10.0.0.5', { message: 'a valid message here', website: 'http://bot' })).res.status, 400);
  const big = await submit('10.0.0.6', { message: 'a valid message here', context: JSON.stringify({ ua: 'u'.repeat(5000) }) });
  assert.equal(big.res.status, 200);
  assert.ok(!big.sent[0]!.body.includes('uuuu'), 'an oversized context is dropped, not parsed');
  assert.equal((await submit('10.0.0.7', { message: 'a valid message here', 'cf-turnstile-response': 't'.repeat(2049) })).res.status, 400);
});

test('the fourth submission from one address inside a minute is rate limited', async () => {
  const statuses = [];
  for (let i = 0; i < 4; i++) statuses.push((await submit('10.0.0.9', { message: 'a valid message here' })).res.status);
  assert.deepEqual(statuses, [200, 200, 200, 429]);
});
