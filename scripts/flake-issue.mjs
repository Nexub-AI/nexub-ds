// 11.7 flake rule: a check that passed only on a retry or a rerun is a flake, and a flake gets an
// issue. Run by CI's "Flake issue" job with GH_TOKEN (issues: write). Inputs:
//   flake-report*.json files (from the Playwright flake reporter: tests that passed on retry),
//   RUN_ATTEMPT > 1 (the run passed only after "Re-run failed jobs": the jobs that failed before).
// It opens one issue labelled `flake` per test or job, or comments on the open one. An open `flake`
// issue without the `waived` label blocks the production release (scripts/release-gate.mjs).
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

/** Flaky test names from the reporter files, de-duplicated. */
export function flakyTests(files) {
  return [...new Set(files.flatMap((f) => JSON.parse(readFileSync(f, 'utf8')).flaky ?? []))].sort();
}

/** The issue title for a flaky test or a job that failed before a rerun. */
export const titleFor = (kind, name) => (kind === 'test' ? `Flake: ${name}` : `Flake (passed on rerun): ${name}`);

/** The jobs that failed in each earlier attempt of the run, by name. */
export function failedBefore(attempts) {
  return [...new Set(attempts.flatMap((jobs) => jobs.filter((j) => j.conclusion === 'failure').map((j) => j.name)))].sort();
}

function gh(args) {
  return execFileSync('gh', args, { encoding: 'utf8' });
}

function main() {
  const { GITHUB_REPOSITORY: repo, GITHUB_RUN_ID: runId, RUN_ATTEMPT = '1', REF_NAME = '', REPORT_DIR = '.' } = process.env;
  const runUrl = `https://github.com/${repo}/actions/runs/${runId}`;
  const files = existsSync(REPORT_DIR)
    ? readdirSync(REPORT_DIR, { recursive: true }).map(String).filter((f) => f.endsWith('flake-report.json')).map((f) => join(REPORT_DIR, f))
    : [];
  const found = flakyTests(files).map((name) => ({ kind: 'test', name }));
  const attempt = Number(RUN_ATTEMPT);
  if (attempt > 1) {
    const attempts = [];
    for (let a = 1; a < attempt; a++) attempts.push(JSON.parse(gh(['api', `repos/${repo}/actions/runs/${runId}/attempts/${a}/jobs`, '--jq', '.jobs'])));
    for (const name of failedBefore(attempts)) found.push({ kind: 'job', name });
  }
  if (!found.length) return console.log('flake-issue: no flakes in this run');

  gh(['label', 'create', 'flake', '--repo', repo, '--color', 'D93F0B', '--description', 'Passed only on retry or rerun. Blocks the production release until fixed or waived.', '--force']);
  const open = JSON.parse(gh(['issue', 'list', '--repo', repo, '--label', 'flake', '--state', 'open', '--limit', '200', '--json', 'number,title']));
  for (const { kind, name } of found) {
    const title = titleFor(kind, name);
    const how = kind === 'test' ? 'failed, then passed on Playwright’s retry' : `failed in an earlier attempt and passed on attempt ${attempt}`;
    const body = `\`${name}\` ${how} on \`${REF_NAME}\`: ${runUrl}`;
    const existing = open.find((i) => i.title === title);
    if (existing) gh(['issue', 'comment', String(existing.number), '--repo', repo, '--body', `Again: ${body}`]);
    else
      gh(['issue', 'create', '--repo', repo, '--label', 'flake', '--title', title, '--body', `${body}\n\nFind the cause and fix it; a rerun hides it. Until it is closed, or labelled \`waived\` by the owner, the production release is blocked (ROADMAP_12.x.md, release rules).`]);
    console.log(`flake-issue: ${existing ? 'commented on' : 'opened'} "${title}"`);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) main();
