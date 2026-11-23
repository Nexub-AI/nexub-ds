// 11.7: the median performance score, LCP, TBT (the lab stand-in for INP) and CLS for each page
// of a Lighthouse CI run, as a Markdown table (for $GITHUB_STEP_SUMMARY). 12.1 sets mobile
// budgets from these numbers; until then the mobile run only warns.
// Usage: node scripts/lighthouse-summary.mjs <outputDir> <title>
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const [dir = '.lighthouseci/mobile', title = 'Lighthouse'] = process.argv.slice(2);
const runs = JSON.parse(readFileSync(join(dir, 'manifest.json'), 'utf8'));
const byUrl = new Map();
for (const run of runs) {
  const lhr = JSON.parse(readFileSync(run.jsonPath, 'utf8'));
  const a = lhr.audits;
  const row = {
    perf: lhr.categories.performance.score * 100,
    lcp: a['largest-contentful-paint'].numericValue,
    tbt: a['total-blocking-time'].numericValue,
    cls: a['cumulative-layout-shift'].numericValue,
  };
  byUrl.set(run.url, [...(byUrl.get(run.url) ?? []), row]);
}
const median = (xs) => [...xs].sort((x, y) => x - y)[Math.floor(xs.length / 2)];
const lines = [`### ${title} (median of ${Math.max(...[...byUrl.values()].map((r) => r.length))})`, '', '| Page | Performance | LCP (ms) | TBT (ms) | CLS |', '|---|---|---|---|---|'];
for (const [url, rows] of byUrl) {
  const m = (k) => median(rows.map((r) => r[k]));
  lines.push(`| ${new URL(url).pathname} | ${Math.round(m('perf'))} | ${Math.round(m('lcp'))} | ${Math.round(m('tbt'))} | ${m('cls').toFixed(3)} |`);
}
console.log(lines.join('\n'));
