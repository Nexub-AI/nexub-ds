import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nextVersion } from './release-version.mjs';
import { invalidBumps } from './check-changesets.mjs';

test('each release bumps the minor', () => {
  assert.equal(nextVersion('1.0.0', '1.1.0'), '1.1.0');
  assert.equal(nextVersion('1.8.0', '1.9.0'), '1.9.0');
});

test('minor rolls over into the major after 9', () => {
  assert.equal(nextVersion('1.9.0', '1.10.0'), '2.0.0');
  assert.equal(nextVersion('1.9.1', '1.10.0'), '2.0.0');
  assert.equal(nextVersion('2.9.3', '2.10.0'), '3.0.0');
});

test('patches stay patches', () => {
  assert.equal(nextVersion('1.4.0', '1.4.1'), '1.4.1');
  assert.equal(nextVersion('1.9.1', '1.9.2'), '1.9.2');
});

test('a requested major bump is rejected', () => {
  assert.throws(() => nextVersion('1.3.0', '2.0.0'), /major bump/);
});

test('changeset guard flags anything but minor/patch', () => {
  const md = (b) => `---\n"@nexub/react": ${b}\n'@nexub/tokens': minor\n---\n\nText.\n`;
  assert.deepEqual(invalidBumps(md('minor')), []);
  assert.deepEqual(invalidBumps(md('patch')), []);
  assert.deepEqual(invalidBumps(md('major')), ['@nexub/react: major']);
});
