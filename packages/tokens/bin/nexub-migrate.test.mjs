import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { SNAPSHOT, buildAliasMap, globToRegExp, migrateSource, run } from './nexub-migrate.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const only = (...r) => new Set(r);
const tsx = (src, opts = {}) => migrateSource(src, { ext: '.tsx', ...opts });

// ─── legacy-tokens ───
test('legacy-tokens: snapshot matches @nexub/themes source', () => {
  const css = ['base', 'light'].map((f) => readFileSync(path.join(here, `../../themes/src/${f}.css`), 'utf8'));
  assert.deepEqual(buildAliasMap(css), SNAPSHOT);
});

test('legacy-tokens: rewrites aliases, brand -500, never --color-text-disabled', () => {
  const { output } = migrateSource(
    '.a { color: var(--color-text-primary); background: var(--color-leap-500); border-color: var(--color-brand-primary-500); }\n.b { color: var(--color-text-disabled); }',
    { ext: '.css' },
  );
  assert.equal(output, '.a { color: var(--color-on-surface); background: var(--color-leap); border-color: var(--color-primary); }\n.b { color: var(--color-text-disabled); }');
});

test('legacy-tokens: resolves alias chains, stops at palette tokens and cycles', () => {
  const { aliases, mix } = buildAliasMap([
    ':root { --color-a: var(--color-b); --color-b: var(--color-c); --color-c: var(--color-on-surface); }',
    ':root { --color-fill: var(--color-palette-primary-40); --color-x: var(--color-y); --color-y: var(--color-x); }',
    ':root { --color-m: var(--color-n); --color-n: color-mix(in srgb, var(--color-error) 35%, transparent); --color-lit: #fff; }',
    ':root { --color-accent-500: var(--color-brand-primary-500); }',
  ]);
  assert.equal(aliases['--color-a'], '--color-on-surface');
  assert.equal(aliases['--color-b'], '--color-on-surface');
  assert.equal(aliases['--color-accent-500'], '--color-primary');
  for (const k of ['--color-fill', '--color-x', '--color-y', '--color-lit']) assert.equal(aliases[k], undefined, k);
  assert.match(mix['--color-m'], /^color-mix/);
});

test('legacy-tokens: color-mix aliases are reported, not rewritten; definitions untouched', () => {
  const src = "const s = 'border-[var(--color-semantic-success-border)]';\n:root { --color-text-primary: red; }\nstyle({ '--color-bg-default': 'x' })";
  const { output, manual } = migrateSource(src, { ext: '.ts', rules: only('legacy-tokens') });
  assert.equal(output, src);
  assert.deepEqual(manual.map((m) => [m.line, m.rule]), [[1, 'legacy-tokens']]);
});

// ─── logical-classes ───
test('logical-classes: rewrites physical classes, keeps variants/negatives/important', () => {
  const { output } = tsx('<div className="ml-2 mr-auto md:pl-4 hover:pr-[3px] -ml-2 !mr-1 border-l border-r-2 rounded-l-lg rounded-tl rounded-br-md text-left md:text-right" />');
  assert.equal(output, '<div className="ms-2 me-auto md:ps-4 hover:pe-[3px] -ms-2 !me-1 border-s border-e-2 rounded-s-lg rounded-ss rounded-ee-md text-start md:text-end" />');
});

test('logical-classes: cn/clsx/cva args, tw`…`, templates, html, @apply', () => {
  assert.equal(tsx("cn('ml-2 Foo', cond && 'pr-4')").output, "cn('ms-2 Foo', cond && 'pe-4')");
  assert.equal(tsx('const c = tw`pl-2 text-left`').output, 'const c = tw`ps-2 text-start`');
  assert.equal(tsx('className={`ml-2 ${a ? "pr-1" : ""} pl-${n}`}').output, 'className={`ms-2 ${a ? "pe-1" : ""} pl-${n}`}');
  assert.equal(migrateSource('<p class="ml-2 text-right">x</p>', { ext: '.html' }).output, '<p class="ms-2 text-end">x</p>');
  assert.equal(migrateSource('.x { @apply ml-2 rounded-r; }', { ext: '.css' }).output, '.x { @apply ms-2 rounded-e; }');
});

test('logical-classes: leaves identifiers, prose, lookalikes and other colours alone', () => {
  const src = [
    'const ml = 2; obj.pr = ml; const text = { left: 1 };',
    "const msg = 'Align text-left please';",
    "const key = 'pr-review';",
    "const c = 'border-lime-500 border-red-500 rounded-lg';",
    '// className="ml-2" in a comment',
  ].join('\n');
  assert.equal(tsx(src).output, src);
});

test('logical-classes: reports left-/right- positions instead of rewriting', () => {
  const { output, manual } = tsx('<div className="absolute left-0 md:-right-2" />');
  assert.equal(output, '<div className="absolute left-0 md:-right-2" />');
  assert.equal(manual.length, 2);
  assert.ok(manual.every((m) => m.rule === 'logical-classes'));
});

// ─── tw-animate ───
test('tw-animate: reports enter/exit classes, not plain css or unrelated strings', () => {
  const { output, manual } = tsx('<div className="data-[state=open]:animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 animate-spin" />');
  assert.equal(output, '<div className="data-[state=open]:animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 animate-spin" />');
  assert.equal(manual.filter((m) => m.rule === 'tw-animate').length, 4);
  assert.equal(migrateSource('.a { cursor: zoom-in; }', { ext: '.css' }).manual.length, 0);
});

// ─── opacity-modifier ───
test('opacity-modifier: reports by default, rewrites with fix', () => {
  const src = '<div className="bg-[var(--color-primary)]/10 hover:text-[var(--color-on-surface)]/50 bg-primary/10" />';
  const dry = tsx(src);
  assert.equal(dry.output, src);
  assert.equal(dry.manual.length, 2);
  const fixed = tsx(src, { fix: true });
  assert.equal(fixed.output, '<div className="bg-[color-mix(in_srgb,var(--color-primary)_10%,transparent)] hover:text-[color-mix(in_srgb,var(--color-on-surface)_50%,transparent)] bg-primary/10" />');
  assert.equal(fixed.manual.length, 0);
});

// ─── CLI ───
const fixture = () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'nexub-migrate-'));
  mkdirSync(path.join(dir, 'src/node_modules/x'), { recursive: true });
  mkdirSync(path.join(dir, 'src/gen'), { recursive: true });
  writeFileSync(path.join(dir, 'src/App.tsx'), 'export const A = () => <div className="ml-2 text-[var(--color-text-primary)]" />;\n');
  writeFileSync(path.join(dir, 'src/node_modules/x/i.tsx'), '<div className="ml-2" />');
  writeFileSync(path.join(dir, 'src/gen/g.tsx'), '<div className="ml-2" />');
  writeFileSync(path.join(dir, 'src/big.css'), `.a{color:var(--color-text-primary)}${' '.repeat(1024 * 1024)}`);
  return dir;
};
const cli = (argv, cwd) => {
  let out = '';
  const code = run(argv, { cwd, stdout: (s) => { out += s; }, stderr: (s) => { out += s; } });
  return { code, out };
};

test('cli: dry run reports but does not write; skips node_modules, big files, --ignore', () => {
  const dir = fixture();
  const { code, out } = cli(['--json', '--ignore', 'src/gen/**'], dir);
  assert.equal(code, 0);
  const json = JSON.parse(out);
  assert.deepEqual(json.results.map((r) => r.file), ['src/App.tsx']);
  assert.equal(json.results[0].changes[0].after, 'export const A = () => <div className="ms-2 text-[var(--color-on-surface)]" />;');
  assert.match(readFileSync(path.join(dir, 'src/App.tsx'), 'utf8'), /ml-2/);
});

test('cli: --check exits 1 when something is found, 0 when clean', () => {
  const dir = fixture();
  assert.equal(cli(['--check'], dir).code, 1);
  cli(['--write'], dir);
  assert.equal(cli(['--check', '--ignore', '**/gen/**', '--ignore', 'big.css'], dir).code, 0);
});

test('cli: --write is idempotent', () => {
  const dir = fixture();
  cli(['--write', '--fix'], dir);
  const once = readFileSync(path.join(dir, 'src/App.tsx'), 'utf8');
  assert.equal(once, 'export const A = () => <div className="ms-2 text-[var(--color-on-surface)]" />;\n');
  const second = cli(['--write', '--fix', '--json'], dir);
  assert.equal(JSON.parse(second.out).totals.changes, 0);
  assert.equal(readFileSync(path.join(dir, 'src/App.tsx'), 'utf8'), once);
});

test('cli: --rules filters, unknown rule is a usage error', () => {
  const dir = fixture();
  const json = JSON.parse(cli(['--json', '--rules', 'legacy-tokens', 'src/App.tsx'], dir).out);
  assert.equal(json.results[0].changes[0].after, 'export const A = () => <div className="ml-2 text-[var(--color-on-surface)]" />;');
  assert.equal(cli(['--rules', 'nope'], dir).code, 2);
});

test('globToRegExp: * stays in a segment, ** crosses them', () => {
  assert.ok(globToRegExp('src/*.tsx').test('src/a.tsx'));
  assert.ok(!globToRegExp('src/*.tsx').test('src/x/a.tsx'));
  assert.ok(globToRegExp('src/**/*.tsx').test('src/x/y/a.tsx'));
  assert.ok(globToRegExp('**/gen/**').test('src/gen/g.tsx'));
});
