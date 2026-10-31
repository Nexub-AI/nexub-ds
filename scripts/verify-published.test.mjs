import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkPackage, failureMessage, parsePublished, verifyPublished, versionUrl } from './verify-published.mjs';

const attested = (version) => ({
  version,
  dist: { attestations: { url: 'https://registry.npmjs.org/-/npm/v1/attestations/x', provenance: { predicateType: 'https://slsa.dev/provenance/v1' } } },
});
const json = (body, status = 200) => ({ ok: status >= 200 && status < 300, status, json: async () => body });

/** A fake clock + registry: `answers(url, call)` returns the response for each lookup. */
function harness(answers) {
  let t = 0;
  const calls = [];
  const sleeps = [];
  return {
    calls,
    sleeps,
    opts: {
      fetch: async (url) => {
        calls.push(url);
        return answers(url, calls.filter((u) => u === url).length);
      },
      sleep: async (ms) => {
        sleeps.push(ms);
        t += ms;
      },
      now: () => t,
      log: () => {},
    },
  };
}

test('parses changesets publishedPackages and rejects anything else', () => {
  assert.deepEqual(parsePublished('[{"name":"@nexub/react","version":"2.4.0","extra":1}]'), [{ name: '@nexub/react', version: '2.4.0' }]);
  assert.throws(() => parsePublished('not json'), /not JSON/);
  assert.throws(() => parsePublished('{"name":"x"}'), /array of \{name, version\}/);
  assert.throws(() => parsePublished('[{"name":"x"}]'), /array of \{name, version\}/);
});

test('looks up the exact version, scope encoded', () => {
  assert.equal(versionUrl({ name: '@nexub/react', version: '2.4.0' }), 'https://registry.npmjs.org/@nexub%2Freact/2.4.0');
});

test('classifies registry answers', async () => {
  const pkg = { name: '@nexub/react', version: '2.4.0' };
  assert.equal((await checkPackage(pkg, async () => json(attested('2.4.0')))).status, 'ok');
  assert.equal((await checkPackage(pkg, async () => json({ error: 'not found' }, 404))).status, 'missing');
  assert.equal((await checkPackage(pkg, async () => json({ version: '2.4.0', dist: {} }))).status, 'unattested');
  assert.equal((await checkPackage(pkg, async () => json({ version: '2.4.0', dist: { attestations: {} } }))).status, 'unattested');
  assert.equal((await checkPackage(pkg, async () => json({}, 503))).status, 'error');
  assert.equal((await checkPackage(pkg, async () => { throw new Error('ECONNRESET'); })).status, 'error');
});

test('retries a lagging package with backoff until it appears', async () => {
  // react shows up on the 4th lookup (~70 s in), tokens is there at once.
  const h = harness((url, n) =>
    url.includes('react') && n < 4 ? json({}, 404) : json(attested('2.4.0')),
  );
  const { ok, failed } = await verifyPublished(
    [
      { name: '@nexub/react', version: '2.4.0' },
      { name: '@nexub/tokens', version: '2.4.0' },
    ],
    h.opts,
  );
  assert.deepEqual(failed, []);
  assert.deepEqual(ok.map((p) => p.name).sort(), ['@nexub/react', '@nexub/tokens']);
  assert.deepEqual(h.sleeps, [10_000, 20_000, 40_000]);
  // Packages already verified are not fetched again.
  assert.equal(h.calls.filter((u) => u.includes('tokens')).length, 1);
});

test('gives up after ~5 minutes and reports what is missing or unattested', async () => {
  const h = harness((url) => (url.includes('react') ? json({}, 404) : json({ version: '2.4.0', dist: {} })));
  const { failed } = await verifyPublished(
    [
      { name: '@nexub/react', version: '2.4.0' },
      { name: '@nexub/icons', version: '2.4.0' },
    ],
    h.opts,
  );
  assert.deepEqual(failed.map((f) => [f.name, f.status]), [
    ['@nexub/react', 'missing'],
    ['@nexub/icons', 'unattested'],
  ]);
  // Unattested is final: looked up once, not retried.
  assert.equal(h.calls.filter((u) => u.includes('icons')).length, 1);
  const waited = h.sleeps.reduce((a, b) => a + b, 0);
  assert.ok(waited <= 5 * 60_000 && waited >= 4 * 60_000, `waited ${waited} ms`);
  assert.ok(Math.max(...h.sleeps) <= 60_000);
  const msg = failureMessage(failed);
  assert.match(msg, /2 published package\(s\) failed/);
  assert.match(msg, /@nexub\/react@2\.4\.0: missing/);
  assert.match(msg, /@nexub\/icons@2\.4\.0: unattested/);
});

test('fails fast when everything is on the registry but a package is unattested', async () => {
  const h = harness((url) => (url.includes('icons') ? json({ version: '2.4.0', dist: {} }) : json(attested('2.4.0'))));
  const { ok, failed } = await verifyPublished(
    [
      { name: '@nexub/react', version: '2.4.0' },
      { name: '@nexub/icons', version: '2.4.0' },
    ],
    h.opts,
  );
  assert.deepEqual(ok.map((p) => p.name), ['@nexub/react']);
  assert.deepEqual(failed.map((f) => [f.name, f.status]), [['@nexub/icons', 'unattested']]);
  assert.deepEqual(h.sleeps, []);
});
