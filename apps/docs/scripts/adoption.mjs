// 12.7: generates src/registry/adoption.generated.json, the data behind /components/adoption.
// Runs `nexub-usage --apps` (packages/tokens/bin/nexub-usage-apps.mjs) over local clones of the
// apps that use Nexub, and keeps AGGREGATE numbers only: versions, component and prop names with
// counts, override / copy / deprecated / stopgap counts. No source, file paths or app content: the
// scanned repos are private and this repo is public.
//
//   node apps/docs/scripts/adoption.mjs --platform <nexub-platform clone> --website <nexub-website-v2 clone>
//
// Not run in CI: it needs the clones. Shallow-clone both default branches outside the repo first.
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { scanApp, summarize, wrapperMap, cssVarNames } from '../../../packages/tokens/bin/nexub-usage-apps.mjs';

const here = fileURLToPath(new URL('.', import.meta.url));
const repo = join(here, '../../..');
const out = join(here, '../src/registry/adoption.generated.json');
const read = (f) => JSON.parse(readFileSync(f, 'utf8'));

/** Apps that are not production yet, or that use no Nexub component, are listed but not scored. */
const SKIP = { matchub: 'Pre-production.' };
const NO_COMPONENTS = 'Uses @nexub/brand only (icons and assets), no components.';

/** The grade rule. The page prints it from these numbers, so keep the two together. */
export const GRADE = {
  perMinorBehind: 5,
  minorCap: 20,
  perMajorBehind: 25,
  majorCap: 40,
  perDeprecated: 5,
  deprecatedCap: 20,
  perCopy: 2,
  copyCap: 20,
  perRestylePer100: 1,
  restyleCap: 20,
  perStopgap: 2,
  stopgapCap: 20,
  bands: [
    ['A', 85],
    ['B', 70],
    ['C', 55],
    ['D', 0],
  ],
};

function score(s, latest) {
  const [maj, min] = (s.version ?? '0.0.0').split('.').map(Number);
  const [lmaj, lmin] = latest.split('.').map(Number);
  const version =
    maj < lmaj
      ? Math.min(GRADE.majorCap, (lmaj - maj) * GRADE.perMajorBehind)
      : Math.min(GRADE.minorCap, Math.max(0, lmin - min) * GRADE.perMinorBehind);
  const rate = s.componentUses ? (s.overrides / s.componentUses) * 100 : 0;
  const minus = {
    version,
    deprecated: Math.min(GRADE.deprecatedCap, s.deprecated * GRADE.perDeprecated),
    copies: Math.min(GRADE.copyCap, s.copies * GRADE.perCopy),
    restyles: Math.min(GRADE.restyleCap, Math.round(rate * GRADE.perRestylePer100)),
    stopgaps: Math.min(GRADE.stopgapCap, s.stopgaps * GRADE.perStopgap),
  };
  const points = 100 - Object.values(minus).reduce((a, b) => a + b, 0);
  return { points, grade: GRADE.bands.find(([, min]) => points >= min)[0], minus, restylesPer100: Math.round(rate * 10) / 10 };
}

/** HEAD commit of a clone, read from .git without running git. */
function headOf(dir) {
  const git = join(dir, '.git');
  const head = readFileSync(join(git, 'HEAD'), 'utf8').trim();
  if (!head.startsWith('ref: ')) return { sha: head, branch: null };
  const ref = head.slice(5);
  const loose = join(git, ref);
  const sha = existsSync(loose)
    ? readFileSync(loose, 'utf8').trim()
    : readFileSync(join(git, 'packed-refs'), 'utf8').split('\n').find((l) => l.endsWith(` ${ref}`))?.split(' ')[0];
  return { sha, branch: ref.replace('refs/heads/', '') };
}

/**
 * Codemod candidates: a className utility that an existing prop already covers, counted from the
 * static classes passed to that component. Only Tailwind utility names are matched, never app text.
 */
const CLASS_TO_PROP = [
  { id: 'text-weight', component: 'Text', test: /^font-(normal|medium|semibold|bold)$/, fix: 'Text weight="…" in place of font-* classes' },
  { id: 'text-truncate', component: 'Text', test: /^truncate$/, fix: 'Text truncate in place of the truncate class' },
  { id: 'text-line-clamp', component: 'Text', test: /^line-clamp-\d$/, fix: 'Text lineClamp={n} in place of line-clamp-n' },
  { id: 'button-full-width', component: 'Button', test: /^w-full$/, fix: 'Button fullWidth in place of w-full' },
];
/** Repeated workarounds with no prop yet: inputs for the 13.x plan, not codemods. */
const CLASS_GAPS = [
  { id: 'card-padding', component: 'Card', test: /^p[xytbse]?-/, gap: 'Card padding set by class (no padding prop)' },
  { id: 'appshell-offset', component: 'AppShell.Root', test: /^pt-\[var\(--size-nav-header\)\]$/, gap: 'AppShell.Root top offset for the app header, set by class' },
  { id: 'sheet-title-hidden', component: 'Sheet.Title', test: /^sr-only$/, gap: 'Sheet.Title hidden with sr-only (no visually hidden option)' },
  { id: 'table-cell-align', component: 'Table.Cell', test: /^text-(end|right)$/, gap: 'Table.Cell end-aligned by class (no align prop)' },
  { id: 'empty-state-padding', component: 'EmptyState.Root', test: /^p[xytbse]?-/, gap: 'EmptyState.Root padding set by class' },
];

function classCount(apps, component, test) {
  let count = 0;
  let inApps = 0;
  for (const app of apps) {
    let n = 0;
    for (const [t, v] of Object.entries(app.classTokens[component] ?? {}))
      if (test.test(t.replace(/^!?([\w-]+:)+/, '').replace(/^!/, ''))) n += v;
    count += n;
    if (n) inApps++;
  }
  return { count, apps: inApps };
}

function main(args) {
  const arg = (flag) => {
    const i = args.indexOf(flag);
    return i >= 0 ? args[i + 1] : undefined;
  };
  const platform = arg('--platform');
  const website = arg('--website');
  if (!platform || !website) {
    console.error('usage: node apps/docs/scripts/adoption.mjs --platform <clone> --website <clone>');
    process.exit(1);
  }
  const latest = read(join(repo, 'packages/react/package.json')).version;
  const parts = new Set();
  for (const pkg of ['react', 'patterns', 'marketing']) {
    const manifest = join(repo, `packages/${pkg}/dist/css-manifest.json`);
    if (!existsSync(manifest)) {
      console.error(`adoption: build @nexub/${pkg} first (no dist/css-manifest.json)`);
      process.exit(1);
    }
    for (const n of Object.keys(read(manifest).exports)) if (/^[A-Z]/.test(n)) parts.add(n);
  }
  const dsVars = cssVarNames([join(repo, 'packages/tokens/dist/css'), join(repo, 'packages/themes/src')]);
  const stopgapList = read(join(here, '../src/registry/admin-ui-stopgaps.json')).stopgaps;
  const adminUi = join(platform, 'packages/admin-ui');
  const wrappers = existsSync(adminUi) ? [wrapperMap(adminUi)] : [];

  const targets = readdirSync(join(platform, 'apps'))
    .sort()
    .map((name) => ({ name, repo: 'nexub-platform', dir: join(platform, 'apps', name) }));
  targets.push({ name: 'website', repo: 'nexub-website-v2', dir: website });

  const apps = [];
  const notScored = [];
  const raw = [];
  for (const t of targets) {
    if (SKIP[t.name]) {
      notScored.push({ name: t.name, repo: t.repo, reason: SKIP[t.name] });
      continue;
    }
    const app = scanApp(t.dir, { wrappers, stopgaps: stopgapList, dsVars, parts });
    const s = summarize(app);
    if (!s.version && !s.componentUses) continue; // no @nexub dependency at all
    if (!s.componentUses && !s.componentsWithWrappers) {
      notScored.push({ name: t.name, repo: t.repo, reason: NO_COMPONENTS, version: s.version });
      continue;
    }
    raw.push(app);
    apps.push({
      name: t.name,
      repo: t.repo,
      ...s,
      ...score(s, latest),
      versions: app.versions,
      components: app.components,
      indirect: app.indirect,
      props: app.props,
      overridesBy: app.overrides,
      copiesBy: app.copies,
      deprecatedBy: app.deprecated,
      native: app.native,
      stopgapsInUse: app.stopgaps,
    });
  }

  const w = wrappers[0];
  const stopgaps = stopgapList.map((s) => ({
    name: s.name,
    replacement: s.replacement,
    since: s.since,
    note: s.note,
    kind: s.pattern ? 'pattern' : 'import',
    // Still exported by admin-ui, and which Nexub parts it renders today (empty: a function or gone).
    inAdminUi: s.pattern ? null : !!w && w.names.includes(s.name),
    wraps: s.pattern || !w ? [] : (w.exports[s.name] ?? []),
    apps: apps.filter((a) => a.stopgapsInUse[s.name]).map((a) => a.name),
    uses: apps.reduce((n, a) => n + (a.stopgapsInUse[s.name] ?? 0), 0),
  }));

  // A stopgap that now renders exactly its Nexub replacement: an import swap plus prop renames.
  const thinWrapper = (s) => s.kind === 'import' && s.uses && s.wraps.length === 1 && s.replacement.startsWith(s.wraps[0]);
  const total = (pick) => {
    const o = {};
    for (const a of apps) for (const [k, v] of Object.entries(pick(a))) o[k] = (o[k] ?? 0) + v;
    return Object.entries(o)
      .sort((x, y) => y[1] - x[1] || x[0].localeCompare(y[0]))
      .map(([name, count]) => ({ name, count, apps: apps.filter((a) => pick(a)[name]).length }));
  };
  const findings = {
    codemods: [
      ...stopgaps
        .filter(thinWrapper)
        .map((s) => ({ id: `stopgap-${s.name}`, fix: `${s.wraps[0]} from Nexub in place of admin-ui's ${s.name} (now a thin wrapper of it)`, count: s.uses, apps: s.apps.length })),
      ...CLASS_TO_PROP.map((c) => ({ id: c.id, fix: c.fix, ...classCount(raw, c.component, c.test) })),
      ...stopgaps.filter((s) => s.kind === 'import' && s.uses && !s.wraps.length)
        .map((s) => ({ id: `stopgap-${s.name}`, fix: `${s.name} -> ${s.replacement}`, count: s.uses, apps: s.apps.length })),
    ].filter((f) => f.count).sort((a, b) => b.count - a.count),
    gaps: CLASS_GAPS.map((c) => ({ id: c.id, gap: c.gap, ...classCount(raw, c.component, c.test) })).filter((f) => f.count).sort((a, b) => b.count - a.count),
    restyled: total((a) => a.overridesBy.classNameVisual).slice(0, 10),
    copies: total((a) => Object.fromEntries(Object.entries(a.copiesBy).map(([k, v]) => [k, (v.name ?? 0) + (v.role ?? 0)]))).slice(0, 10),
    native: total((a) => a.native),
  };

  const data = {
    $comment: 'GENERATED by apps/docs/scripts/adoption.mjs from nexub-usage --apps. Aggregate counts only. Do not edit.',
    scannedOn: new Date().toISOString().slice(0, 10),
    latest,
    sources: [
      { repo: 'nexub-platform', ...headOf(platform), apps: 'apps/*' },
      { repo: 'nexub-website-v2', ...headOf(website), apps: '.' },
    ],
    grade: GRADE,
    dsComponents: parts.size,
    apps,
    notScored,
    stopgaps,
    findings,
  };
  writeFileSync(out, JSON.stringify(data, null, 1) + '\n');
  console.log(`adoption: wrote ${apps.length} apps (${notScored.length} not scored) to ${out}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main(process.argv.slice(2));
