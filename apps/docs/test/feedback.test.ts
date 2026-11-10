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
