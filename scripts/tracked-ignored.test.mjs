import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

// 11.7: a file that .gitignore covers but git still tracks is a stale copy of something a build
// writes (111 docs Markdown twins in public/components and public/patterns were). Untrack it
// with `git rm --cached`, or stop ignoring it.
test('no tracked file is also ignored', () => {
  const out = execFileSync('git', ['ls-files', '--cached', '--ignored', '--exclude-standard'], { encoding: 'utf8' });
  const files = out.split('\n').filter(Boolean);
  assert.deepEqual(files, [], `tracked but ignored:\n${files.slice(0, 20).join('\n')}`);
});
