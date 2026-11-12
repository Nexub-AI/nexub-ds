// 9.7 blocking security gates (security.yml), limits in security-gates.json:
//   CodeQL: no open alert of high or critical severity on this ref.
//   Scorecard: the OpenSSF Scorecard score is at least scorecardMin (a ratchet toward 8).
//
//   node scripts/security-gates.mjs codeql                 GH_TOKEN, GITHUB_REPOSITORY, GITHUB_REF
//   node scripts/security-gates.mjs scorecard results.json
// Node 24, no dependencies.
import { appendFileSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const limits = () => JSON.parse(readFileSync(new URL('../security-gates.json', import.meta.url), 'utf8'));
const summary = (text) => process.env.GITHUB_STEP_SUMMARY && appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${text}\n`);

/** Open CodeQL alerts that count: security severity high or critical. */
export function highAlerts(alerts) {
  return alerts
    .filter((a) => a.state === 'open' && a.tool?.name === 'CodeQL' && ['high', 'critical'].includes(a.rule?.security_severity_level))
    .map((a) => `${a.rule.security_severity_level} ${a.rule.id} ${a.most_recent_instance?.location?.path ?? ''}:${a.most_recent_instance?.location?.start_line ?? ''} ${a.html_url ?? ''}`);
}

/** Scorecard JSON → the verdict and a table of the checks that are not 10. */
export function scorecardVerdict(result, { scorecardMin, scorecardTarget }) {
  const score = Number(result.score);
  const lines = [...result.checks]
    .filter((c) => c.score < 10)
    .sort((a, b) => a.score - b.score)
    .map((c) => `| ${c.name} | ${c.score < 0 ? 'n/a' : c.score} | ${String(c.reason).replace(/\|/g, '/')} |`);
  return {
    ok: Number.isFinite(score) && score >= scorecardMin,
    score,
    text: [`### OpenSSF Scorecard: ${score} (minimum ${scorecardMin}, target ${scorecardTarget})`, '', '| Check | Score | Reason |', '| --- | --- | --- |', ...lines].join('\n'),
  };
}

async function codeql() {
  const { GH_TOKEN, GITHUB_REPOSITORY, GITHUB_REF } = process.env;
  const alerts = [];
  for (let page = 1; ; page++) {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPOSITORY}/code-scanning/alerts?state=open&tool_name=CodeQL&per_page=100&page=${page}&ref=${encodeURIComponent(GITHUB_REF)}`, {
      headers: { authorization: `Bearer ${GH_TOKEN}`, accept: 'application/vnd.github+json' },
    });
    if (!res.ok) throw new Error(`code scanning API answered HTTP ${res.status}`);
    const batch = await res.json();
    alerts.push(...batch);
    if (batch.length < 100) break;
  }
  const high = highAlerts(alerts);
  const max = limits().codeqlMaxHigh;
  summary(`### CodeQL: ${high.length} open high or critical alert(s) (allowed ${max})\n${high.map((h) => `- ${h}`).join('\n')}`);
  console.log(`CodeQL: ${high.length} open high or critical alert(s), allowed ${max}`);
  if (high.length > max) {
    console.error(high.map((h) => `✗ ${h}`).join('\n'));
    process.exit(1);
  }
}

function scorecard(file) {
  const verdict = scorecardVerdict(JSON.parse(readFileSync(file, 'utf8')), limits());
  summary(verdict.text);
  console.log(verdict.text);
  if (!verdict.ok) {
    console.error(`✗ Scorecard ${verdict.score} is below the minimum in security-gates.json`);
    process.exit(1);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [gate, file] = process.argv.slice(2);
  if (gate === 'codeql') await codeql();
  else if (gate === 'scorecard' && file) scorecard(file);
  else {
    console.error('Usage: security-gates.mjs codeql | scorecard <results.json>');
    process.exit(2);
  }
}
