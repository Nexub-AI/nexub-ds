import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkAge, checkRuntimeDeps, lintLockfile } from './check-supply-chain.mjs';
import { highAlerts, scorecardVerdict } from './security-gates.mjs';

test('lockfile lint accepts registry sha512 resolutions only', () => {
  const lock = [
    'packages:',
    '',
    "  '@scope/ok@1.0.0':",
    '    resolution: {integrity: sha512-abc+/=}',
    '  git-dep@1.0.0:',
    '    resolution: {tarball: https://codeload.github.com/x/y/tar.gz/abc}',
    '  weak@1.0.0:',
    '    resolution: {integrity: sha1-abc}',
    '  local@1.0.0:',
    '    resolution: {directory: ../local, type: directory}',
  ].join('\n');
  assert.deepEqual(lintLockfile(lock).map((l) => l.split(':')[0]), ['git-dep@1.0.0', 'weak@1.0.0', 'local@1.0.0']);
});

test('every runtime dependency needs a reason, and stale reasons fail', () => {
  const policy = { packages: { a: { 'left-pad': 'pads', '@radix-ui/react-*': 'behaviour', gone: 'was here' }, ghost: {} } };
  const manifests = [
    { name: 'a', dependencies: { 'left-pad': '1', '@radix-ui/react-dialog': '1', sneaky: '1' } },
    { name: 'app', private: true, dependencies: { anything: '1' } },
  ];
  assert.deepEqual(checkRuntimeDeps(manifests, policy), [
    'a: runtime dependency "sneaky" has no reason in dependency-policy.json',
    'a: dependency-policy.json lists "gone", which is no longer a dependency',
    'dependency-policy.json lists ghost, which is not a published package',
  ]);
});

test('minimum package age is enforced in pnpm and Dependabot', () => {
  const dependabot = 'updates:\n  - package-ecosystem: npm\n    cooldown:\n      default-days: 7\n';
  assert.deepEqual(checkAge({ workspace: 'minimumReleaseAge: 10080\n', dependabot }, 7), []);
  assert.equal(checkAge({ workspace: 'minimumReleaseAge: 60\n', dependabot }, 7).length, 1);
  assert.equal(checkAge({ workspace: '', dependabot: '' }, 7).length, 2);
});

test('only open CodeQL alerts of high or critical severity count', () => {
  const alert = (level, state = 'open', tool = 'CodeQL') => ({ state, tool: { name: tool }, rule: { id: 'js/x', security_severity_level: level } });
  const alerts = [alert('high'), alert('critical'), alert('medium'), alert('high', 'fixed'), alert('high', 'open', 'Scorecard'), alert(null)];
  assert.equal(highAlerts(alerts).length, 2);
});

test('Scorecard gate compares with the minimum and lists checks below 10', () => {
  const result = { score: 7.4, checks: [{ name: 'Code-Review', score: 0, reason: 'none | approved' }, { name: 'License', score: 10, reason: 'ok' }, { name: 'Fuzzing', score: -1, reason: 'n/a' }] };
  const pass = scorecardVerdict(result, { scorecardMin: 7, scorecardTarget: 8 });
  assert.equal(pass.ok, true);
  assert.match(pass.text, /\| Fuzzing \| n\/a \|/);
  assert.match(pass.text, /\| Code-Review \| 0 \| none \/ approved \|/);
  assert.ok(!pass.text.includes('License'));
  assert.equal(scorecardVerdict(result, { scorecardMin: 8, scorecardTarget: 8 }).ok, false);
  assert.equal(scorecardVerdict({ score: undefined, checks: [] }, { scorecardMin: 0, scorecardTarget: 8 }).ok, false);
});

test('published tarballs must match checksums.txt exactly', async () => {
  const { parseChecksums, verify } = await import('./publish-tarballs.mjs');
  const a = 'a'.repeat(64);
  const b = 'b'.repeat(64);
  const expected = parseChecksums(`${a}  nexub-react-9.7.0.tgz\n${b}  nexub-core-9.7.0.tgz\n`);
  assert.deepEqual(expected, { 'nexub-react-9.7.0.tgz': a, 'nexub-core-9.7.0.tgz': b });
  assert.deepEqual(verify(expected, { 'nexub-react-9.7.0.tgz': a, 'nexub-core-9.7.0.tgz': b }), []);
  assert.deepEqual(verify(expected, { 'nexub-react-9.7.0.tgz': b, 'extra-1.0.0.tgz': a }), [
    `nexub-react-9.7.0.tgz: sha256 ${b} does not match checksums.txt`,
    'extra-1.0.0.tgz: not in checksums.txt',
    'nexub-core-9.7.0.tgz: listed in checksums.txt but missing',
  ]);
  assert.throws(() => parseChecksums('not a checksum line\n'), /unreadable line/);
});
