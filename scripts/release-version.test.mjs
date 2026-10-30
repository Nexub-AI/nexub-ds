import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nextVersion, renameChangelogSection } from './release-version.mjs';
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

test('rollover renames the newest CHANGELOG section, including dependency lines', () => {
  const text = '# @nexub/react\n\n## 1.10.0\n\n### Patch Changes\n\n- @nexub/icons@1.10.0\n\n## 1.9.0\n\n- @nexub/icons@1.9.0\n';
  assert.equal(
    renameChangelogSection(text, '1.10.0', '2.0.0'),
    '# @nexub/react\n\n## 2.0.0\n\n### Patch Changes\n\n- @nexub/icons@2.0.0\n\n## 1.9.0\n\n- @nexub/icons@1.9.0\n',
  );
  assert.equal(renameChangelogSection('# x\n\n## 1.9.0\n', '1.10.0', '2.0.0'), '# x\n\n## 1.9.0\n');
});
