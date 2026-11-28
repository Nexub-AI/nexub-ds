// size-vs-baseline (12.7): compares size-budgets.json with the budgets of a release, for the
// 12.x target "every size budget at least 10% below 11.6" (ROADMAP_12.x.md, How each version is
// judged). Prints a Markdown table: entry, budget then, budget now, delta, met. Only entries that
// existed then are compared; entries added later have no baseline.
// 12.8: an entry that misses the target but is listed in size-exemptions.json (the feature and
// PRs that grew it, owner Decision 7) counts as exempt, not unmet: met / exempt / unmet.
//
//   node scripts/size-vs-baseline.mjs                  against v11.6.0, every entry
//   node scripts/size-vs-baseline.mjs --ref v11.6.0    another release tag or commit
//   node scripts/size-vs-baseline.mjs --unmet          only the entries that miss the target and
//                                                      are not exempt
//
// Budgets, not measurements: a budget is the measured gzip size rounded up to 100 B whenever a
// PR lowers it, and it is what CI holds each entry to. Reporting only; it never fails.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const arg = (name, fallback) => {
  const i = process.argv.indexOf(name);
  return i > 0 ? process.argv[i + 1] : fallback;
};
const ref = arg('--ref', 'v11.6.0');
const TARGET = 0.9;

const then = JSON.parse(execFileSync('git', ['show', `${ref}:size-budgets.json`], { cwd: root, encoding: 'utf8' }));
const now = JSON.parse(readFileSync(new URL('size-budgets.json', `file://${root}`), 'utf8'));
const exemptionsFile = new URL('size-exemptions.json', `file://${root}`);
const exemptions = Object.fromEntries(
  Object.entries(existsSync(exemptionsFile) ? JSON.parse(readFileSync(exemptionsFile, 'utf8')) : {}).filter(([k]) => !k.startsWith('//')),
);

const rows = Object.keys(then)
  .filter((k) => now[k] !== undefined)
  .map((k) => {
    const met = now[k] <= then[k] * TARGET;
    const status = met ? 'yes' : exemptions[k] ? 'exempt' : 'no';
    return { k, then: then[k], now: now[k], delta: (now[k] - then[k]) / then[k], status };
  });
const count = (status) => rows.filter((r) => r.status === status).length;
const shown = process.argv.includes('--unmet') ? rows.filter((r) => r.status === 'no') : rows;
const gone = Object.keys(then).filter((k) => now[k] === undefined);
// Exemptions that are no longer needed (the entry meets the target) or name no budget entry.
const stale = Object.keys(exemptions).filter((k) => rows.some((r) => r.k === k && r.status === 'yes'));
const unknown = Object.keys(exemptions).filter((k) => !rows.some((r) => r.k === k));

console.log(
  `**${count('yes')} of ${rows.length}** budgets are at least 10% below ${ref}; ${count('exempt')} exempt (size-exemptions.json), ${count('no')} unmet.${gone.length ? ` Removed since: ${gone.join(', ')}.` : ''}`,
);
if (stale.length) console.log(`\nExempt but met now (remove from size-exemptions.json): ${stale.join(', ')}.`);
if (unknown.length) console.log(`\nExemptions with no ${ref} budget to compare: ${unknown.join(', ')}.`);
console.log(`\n| Entry | ${ref} | Now | Delta | Met |`);
console.log('|---|---:|---:|---:|:---:|');
for (const r of shown) {
  const why = r.status === 'exempt' ? ` (${exemptions[r.k].release}: ${exemptions[r.k].prs.map((n) => `#${n}`).join(', ')})` : '';
  console.log(`| \`${r.k}\` | ${r.then.toLocaleString('en')} | ${r.now.toLocaleString('en')} | ${r.delta > 0 ? '+' : ''}${(r.delta * 100).toFixed(1)}% | ${r.status}${why} |`);
}
