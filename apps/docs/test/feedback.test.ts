// Runs with `node --test` (type stripping). Lives outside functions/ so Pages
// doesn't route it.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { escapeHtml, isValidEmail, sniffImageType } from '../functions/api/feedback.ts';

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
