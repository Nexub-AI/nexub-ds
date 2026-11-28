// size-vs-baseline (12.7): compares size-budgets.json with the budgets of a release, for the
// 12.x target "every size budget at least 10% below 11.6" (ROADMAP_12.x.md, How each version is
// judged). Prints a Markdown table: entry, budget then, budget now, delta, met. Only entries that
// existed then are compared; entries added later have no baseline.
//
//   node scripts/size-vs-baseline.mjs                  against v11.6.0, every entry
//   node scripts/size-vs-baseline.mjs --ref v11.6.0    another release tag or commit
//   node scripts/size-vs-baseline.mjs --unmet          only the entries that miss the target
//
// Budgets, not measurements: a budget is the measured gzip size rounded up to 100 B whenever a
// PR lowers it, and it is what CI holds each entry to. Reporting only; it never fails.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
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

const rows = Object.keys(then)
  .filter((k) => now[k] !== undefined)
  .map((k) => ({ k, then: then[k], now: now[k], delta: (now[k] - then[k]) / then[k], met: now[k] <= then[k] * TARGET }));
const met = rows.filter((r) => r.met).length;
const shown = process.argv.includes('--unmet') ? rows.filter((r) => !r.met) : rows;
const gone = Object.keys(then).filter((k) => now[k] === undefined);

console.log(`**${met} of ${rows.length}** budgets are at least 10% below ${ref}.${gone.length ? ` Removed since: ${gone.join(', ')}.` : ''}\n`);
console.log(`| Entry | ${ref} | Now | Delta | Met |`);
console.log('|---|---:|---:|---:|:---:|');
for (const r of shown)
  console.log(`| \`${r.k}\` | ${r.then.toLocaleString('en')} | ${r.now.toLocaleString('en')} | ${r.delta > 0 ? '+' : ''}${(r.delta * 100).toFixed(1)}% | ${r.met ? 'yes' : 'no'} |`);
