// 11.7 release rules, checked on every PR into production (CI job "Release gate"):
//   1. No open `flake` issue unless it carries the `waived` label (scripts/flake-issue.mjs).
//   2. The soak: the staging head (the PR's head commit) is at least SOAK_HOURS old. CI sets 0
//      (no soak) since 2026-11-24. The owner can waive a soak for one PR with `soak-waived`.
// Env: GH_TOKEN, GITHUB_REPOSITORY, HEAD_SHA, PR_LABELS (JSON array of names), SOAK_HOURS (0).
import { execFileSync } from 'node:child_process';

/** Open flake issues that still block: those without the `waived` label. */
export function blockingFlakes(issues) {
  return issues.filter((i) => !i.labels.some((l) => l.name === 'waived'));
}

/** Hours the head commit has been on staging, and whether that is enough. */
export function soak(committedAt, now, hours, waived) {
  const age = (now - committedAt) / 3_600_000;
  return { age, ok: waived || age >= hours };
}

function main() {
  const { GITHUB_REPOSITORY: repo, HEAD_SHA: sha, PR_LABELS = '[]', SOAK_HOURS = '0' } = process.env;
  const labels = JSON.parse(PR_LABELS);
  const gh = (args) => JSON.parse(execFileSync('gh', args, { encoding: 'utf8' }));
  const problems = [];

  const flakes = blockingFlakes(gh(['issue', 'list', '--repo', repo, '--label', 'flake', '--state', 'open', '--limit', '200', '--json', 'number,title,labels']));
  for (const f of flakes) problems.push(`open flake #${f.number}: ${f.title} (fix it, or the owner labels it \`waived\`)`);

  const commit = gh(['api', `repos/${repo}/commits/${sha}`]);
  const s = soak(Date.parse(commit.commit.committer.date), Date.now(), Number(SOAK_HOURS), labels.includes('soak-waived'));
  const line = `staging head ${sha.slice(0, 8)} has soaked ${s.age.toFixed(1)} h of ${SOAK_HOURS} h${labels.includes('soak-waived') ? ' (waived by label)' : ''}`;
  if (!s.ok) problems.push(`${line}: merge after the soak, or the owner adds the \`soak-waived\` label`);
  else console.log(`release-gate: ${line}`);

  if (problems.length) {
    console.error(`release-gate: blocked\n- ${problems.join('\n- ')}`);
    process.exit(1);
  }
  console.log('release-gate: no open flakes; soak done');
}

if (import.meta.url === `file://${process.argv[1]}`) main();
