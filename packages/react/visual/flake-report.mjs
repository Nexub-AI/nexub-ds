import { appendFileSync, readFileSync } from 'node:fs';
import { basename } from 'node:path';

// Playwright reporter: per-run flake report + the quarantine.
// - Prints passed / flaky / failed counts, the flake rate and the flaky test names,
//   and appends the same as Markdown to $GITHUB_STEP_SUMMARY in CI.
// - Tests listed in quarantine.json still run and are reported, but their failures
//   don't fail the run. The list may only shrink (scripts/quarantine.test.mjs).

/** @typedef {{ test: string, reason: string }} QuarantineEntry */

/** @returns {QuarantineEntry[]} */
export const readQuarantine = () => JSON.parse(readFileSync(new URL('./quarantine.json', import.meta.url), 'utf8'));

/** "docs.visual.spec.ts › /foundations/motion light": file name + titles, no project. */
export const testId = (t) => [basename(t.location.file), ...t.titlePath().slice(3)].join(' › ');

/**
 * @param {{ id: string, outcome: 'expected' | 'unexpected' | 'flaky' | 'skipped' }[]} tests
 * @param {QuarantineEntry[]} quarantine
 */
export function summarize(tests, quarantine) {
  const q = new Set(quarantine.map((e) => e.test));
  const ids = (outcome, keep = () => true) => tests.filter((t) => t.outcome === outcome && keep(t.id)).map((t) => t.id);
  const ran = tests.filter((t) => t.outcome !== 'skipped');
  const flaky = ids('flaky');
  return {
    passed: ids('expected').length,
    flaky,
    failed: ids('unexpected', (id) => !q.has(id)),
    quarantinedFailed: ids('unexpected', (id) => q.has(id)),
    // Quarantined but green this run: candidates to take off the list.
    quarantinedPassing: [...q].filter((id) => ran.some((t) => t.id === id && t.outcome === 'expected')),
    skipped: tests.length - ran.length,
    flakeRate: ran.length ? flaky.length / ran.length : 0,
  };
}

export function toMarkdown(s) {
  const list = (title, xs) => (xs.length ? `\n**${title}**\n${xs.map((x) => `- ${x}`).join('\n')}\n` : '');
  return [
    '### Visual tests: flake report',
    '',
    '| Passed | Flaky | Failed | Quarantined failures | Skipped | Flake rate |',
    '| --- | --- | --- | --- | --- | --- |',
    `| ${s.passed} | ${s.flaky.length} | ${s.failed.length} | ${s.quarantinedFailed.length} | ${s.skipped} | ${(s.flakeRate * 100).toFixed(2)}% |`,
    list('Flaky (passed on retry; fix at the root, do not re-run)', s.flaky),
    list('Failed', s.failed),
    list('Quarantined, failed (ignored)', s.quarantinedFailed),
    list('Quarantined, passing (remove from visual/quarantine.json)', s.quarantinedPassing),
  ].join('\n');
}

export default class FlakeReport {
  /** @type {import('@playwright/test/reporter').Suite | undefined} */
  suite;
  errors = 0;

  onBegin(_config, suite) {
    this.suite = suite;
  }

  onError() {
    this.errors++;
  }

  printsToStdio() {
    return false;
  }

  async onEnd(result) {
    if (!this.suite) return;
    const tests = this.suite.allTests().map((t) => ({ id: testId(t), outcome: t.outcome() }));
    const s = summarize(tests, readQuarantine());
    const md = toMarkdown(s);
    console.log(`\n${md}\n`);
    if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${md}\n`);
    // Only quarantined tests failed (and no global error): the run passes.
    if (result.status === 'failed' && !this.errors && !s.failed.length && s.quarantinedFailed.length) {
      return { status: 'passed' };
    }
  }
}
