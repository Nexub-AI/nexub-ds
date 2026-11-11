import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readQuarantine, summarize } from '../packages/react/visual/flake-report.mjs';

// Ratchet: the visual quarantine may only shrink. Taking a test off? Lower this.
// Adding one needs this raised in the same PR, with a reason and an owner.
const QUARANTINE_MAX = 0;

test('visual quarantine never grows', () => {
  const q = readQuarantine();
  assert.ok(q.length <= QUARANTINE_MAX, `quarantine.json has ${q.length} entries; the ceiling is ${QUARANTINE_MAX}. Fix the test instead.`);
  assert.equal(q.length, QUARANTINE_MAX, `quarantine shrank to ${q.length}: lower QUARANTINE_MAX to lock it in`);
  for (const e of q) assert.ok(e.test && e.reason, `entry needs "test" and "reason": ${JSON.stringify(e)}`);
});

test('quarantined failures are reported, not fatal; flakes are counted', () => {
  const s = summarize(
    [
      { id: 'a', outcome: 'expected' },
      { id: 'b', outcome: 'flaky' },
      { id: 'c', outcome: 'unexpected' },
      { id: 'd', outcome: 'unexpected' },
      { id: 'e', outcome: 'skipped' },
    ],
    [{ test: 'c', reason: 'x' }, { test: 'a', reason: 'y' }],
  );
  assert.deepEqual(s.failed, ['d']);
  assert.deepEqual(s.quarantinedFailed, ['c']);
  assert.deepEqual(s.quarantinedPassing, ['a']);
  assert.deepEqual(s.flaky, ['b']);
  assert.equal(s.flakeRate, 0.25);
  assert.equal(s.skipped, 1);
});
