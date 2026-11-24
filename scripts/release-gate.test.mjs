import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { blockingFlakes, soak } from './release-gate.mjs';
import { failedBefore, flakyTests, titleFor } from './flake-issue.mjs';

test('a waived flake issue does not block; any other open one does', () => {
  const issues = [
    { number: 1, title: 'Flake: a', labels: [{ name: 'flake' }] },
    { number: 2, title: 'Flake: b', labels: [{ name: 'flake' }, { name: 'waived' }] },
  ];
  assert.deepEqual(blockingFlakes(issues).map((i) => i.number), [1]);
});

test('the soak needs 48 hours on staging unless waived', () => {
  const h = 3_600_000;
  assert.equal(soak(0, 47 * h, 48, false).ok, false);
  assert.equal(soak(0, 48 * h, 48, false).ok, true);
  assert.equal(soak(0, 1 * h, 48, true).ok, true);
  // SOAK_HOURS 0 (since 2026-11-24): a fresh staging head passes.
  assert.equal(soak(0, 0, 0, false).ok, true);
});

test('flaky tests come from every shard file, once each', () => {
  const dir = mkdtempSync(join(tmpdir(), 'flake-'));
  writeFileSync(join(dir, '1.json'), JSON.stringify({ flaky: ['b', 'a'] }));
  writeFileSync(join(dir, '2.json'), JSON.stringify({ flaky: ['a'] }));
  assert.deepEqual(flakyTests([join(dir, '1.json'), join(dir, '2.json')]), ['a', 'b']);
});

test('a rerun reports the jobs that failed before it, by name', () => {
  const attempts = [[{ name: 'Visual (1/3)', conclusion: 'failure' }, { name: 'Build', conclusion: 'success' }]];
  assert.deepEqual(failedBefore(attempts), ['Visual (1/3)']);
  assert.equal(titleFor('job', 'Visual (1/3)'), 'Flake (passed on rerun): Visual (1/3)');
  assert.equal(titleFor('test', 'x.spec.ts › y'), 'Flake: x.spec.ts › y');
});
