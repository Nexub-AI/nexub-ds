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
test('legacy-tokens: 3.0 themes declare no alias in the table; brand-overridden tokens are not in it', () => {
  const css = ['base', 'light', 'leap', 'bookub', 'payub', 'founderub'].map((f) => readFileSync(path.join(here, `../../themes/src/${f}.css`), 'utf8')).join('\n');
  for (const name of [...Object.keys(SNAPSHOT.aliases), ...Object.keys(SNAPSHOT.mix)]) {
    assert.ok(!new RegExp(`${name}\\s*:`).test(css), `${name} is still declared in @nexub/themes`);
  }
  for (const name of ['--color-ring-default', '--color-ring-offset', '--color-accent-500', '--color-text-disabled']) {
    assert.ok(!(name in SNAPSHOT.aliases), name);
    assert.equal(migrateSource(`a { color: var(${name}); }`, { ext: '.css' }).output, `a { color: var(${name}); }`);
  }
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
    ':root { --color-old-accent: var(--color-brand-primary-500); }',
  ]);
  assert.equal(aliases['--color-a'], '--color-on-surface');
  assert.equal(aliases['--color-b'], '--color-on-surface');
  assert.equal(aliases['--color-old-accent'], '--color-primary');
  for (const k of ['--color-fill', '--color-x', '--color-y', '--color-lit']) assert.equal(aliases[k], undefined, k);
  assert.match(mix['--color-m'], /^color-mix/);
});

test('legacy-tokens: color-mix aliases are reported, not rewritten; definitions untouched', () => {
  const src = "const s = 'border-[var(--color-semantic-success-border)]';\n:root { --color-text-primary: red; }\nstyle({ '--color-bg-default': 'x' })";
  const { output, manual } = migrateSource(src, { ext: '.ts', rules: only('legacy-tokens') });
  assert.equal(output, src);
  assert.deepEqual(manual.map((m) => [m.line, m.rule]), [[1, 'legacy-tokens']]);
});

test('legacy-tokens: Tailwind utilities on legacy names move to role utilities', () => {
  const { output, manual } = tsx('<div className="bg-bg-default md:hover:text-text-primary/80 border-border-default bg-surface-raised ring-ring-default border-semantic-error-border" />');
  assert.equal(output, '<div className="bg-surface md:hover:text-on-surface/80 border-outline-variant bg-surface-elevated ring-ring-default border-semantic-error-border" />');
  assert.deepEqual(manual.map((m) => m.rule), ['legacy-tokens']);
  assert.equal(tsx("const s = 'Text text-primary is fine';").output, "const s = 'Text text-primary is fine';");
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

// ─── deprecated-components ───
const comp = (src) => migrateSource(src, { ext: '.tsx', rules: only('deprecated-components') });

test('deprecated-components: Banner/Callout -> Alert, Tag -> soft Badge, imports deduped', () => {
  const src = [
    "import { Alert, Banner, Callout, Tag, type TagProps } from '@nexub/react';",
    'const p: TagProps = {};',
    '<Banner tone="info" title="Hi" onClose={close}>Body</Banner>',
    '<Callout icon={<I />}>x</Callout>',
    '<Tag size="sm" tone="success">New</Tag>',
    '<Tag variant="outline">Keep</Tag>',
  ].join('\n');
  const { output, manual } = comp(src);
  assert.equal(output, [
    "import { Alert, Badge, type BadgeProps } from '@nexub/react';",
    'const p: BadgeProps = {};',
    '<Alert tone="info" title="Hi" onClose={close}>Body</Alert>',
    '<Alert icon={<I />}>x</Alert>',
    '<Badge variant="soft" size="sm" tone="success">New</Badge>',
    '<Badge variant="outline">Keep</Badge>',
  ].join('\n'));
  assert.equal(manual.length, 0);
});

test('deprecated-components: StatusPill label -> children, dot reported, newlines kept', () => {
  const src = [
    "import { StatusPill } from '@nexub/react';",
    '<StatusPill tone="success" label="Live" />',
    '<StatusPill',
    '  label={t("x")}',
    '  dot',
    '/>',
    '<StatusPill label="a > b" dot={false} />',
  ].join('\n');
  const { output, manual } = comp(src);
  assert.equal(output, [
    "import { Badge } from '@nexub/react';",
    '<Badge variant="soft" tone="success">Live</Badge>',
    '<Badge variant="soft"',
    '',
    '',
    '>{t("x")}</Badge>',
    '<Badge variant="soft">{"a > b"}</Badge>',
  ].join('\n'));
  assert.deepEqual(manual.map((m) => m.line), [3]);
});

test('deprecated-components: aliases keep the local name; non-JSX uses reported; other packages untouched', () => {
  const aliased = comp("import { Banner as B, Tag as T } from '@nexub/react';\n<B>x</B><T>y</T>\nstyled(T)");
  assert.equal(aliased.output, "import { Alert as B, Badge as T } from '@nexub/react';\n<B>x</B><T variant=\"soft\">y</T>\nstyled(T)");
  assert.deepEqual(aliased.manual.map((m) => m.line), [3]);
  const other = "import { Banner } from '@nexub/react-native';\n<Banner />";
  assert.equal(comp(other).output, other);
  const typeOf = comp("import { Callout, calloutVariants } from '@nexub/react';\ntype P = React.ComponentProps<typeof Callout>;");
  assert.equal(typeOf.manual.length, 2);
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

test('tailwind-3-preset: reports the deprecated preset import, never rewrites it', () => {
  const src = "import nexub from '@nexub/tokens/tailwind';\nexport default { presets: [nexub] };\n";
  const { output, manual } = migrateSource(src, { ext: '.js', rules: new Set(['tailwind-3-preset']), fix: true });
  assert.equal(output, src);
  assert.deepEqual(manual.map((m) => [m.line, m.rule]), [[1, 'tailwind-3-preset']]);
  assert.equal(migrateSource('@import "@nexub/tokens/tailwind.css";', { ext: '.css', rules: new Set(['tailwind-3-preset']) }).manual.length, 0);
});

// ─── keep-5-defaults ───
const pin = (src) => migrateSource(src, { ext: '.tsx', rules: only('keep-5-defaults') });

test('keep-5-defaults: pins the DataTable 6.0 default, leaves explicit props alone', () => {
  const src = `import { Autocomplete, DataTable as Table } from '@nexub/react';
import { DataTableVirtual } from '@nexub/react/DataTableVirtual';
<Autocomplete options={o} />
<Autocomplete mode="popover" options={o} />
<Table enableRowSelection columns={c} data={d} />
<Table enableRowSelection selectionColumn columns={c} data={d} />
<Table columns={c} data={d} />
<DataTableVirtual
  enableRowSelection
  maxHeight={400}
/>
<Autocomplete {...rest} />`;
  const { output, manual } = pin(src);
  assert.equal(
    output,
    `import { Autocomplete, DataTable as Table } from '@nexub/react';
import { DataTableVirtual } from '@nexub/react/DataTableVirtual';
<Autocomplete options={o} />
<Autocomplete mode="popover" options={o} />
<Table selectionColumn={false} enableRowSelection columns={c} data={d} />
<Table enableRowSelection selectionColumn columns={c} data={d} />
<Table columns={c} data={d} />
<DataTableVirtual selectionColumn={false}
  enableRowSelection
  maxHeight={400}
/>
<Autocomplete {...rest} />`,
  );
  assert.deepEqual(manual, []);
});

test('keep-5-defaults is opt-in', () => {
  const src = `import { Autocomplete } from '@nexub/react';\n<Autocomplete options={o} />`;
  assert.equal(migrateSource(src, { ext: '.tsx' }).output, src);
});

// ─── removed-in-7 ───
test('removed-in-7: reports StepIndicator and Autocomplete mode, never rewrites', () => {
  const src = `import { StepIndicator } from '@nexub/patterns';
import { Autocomplete } from '@nexub/react';
<StepIndicator steps={steps} currentStep={1} />;
<Autocomplete options={o} mode="inline" />;
<Autocomplete options={o} mode={'inline'} />;
<Autocomplete options={o} mode="popover" />;
`;
  const { output, manual } = migrateSource(src, { ext: '.tsx', rules: only('removed-in-7') });
  assert.equal(output, src);
  assert.deepEqual(manual.map((m) => [m.line, m.rule]), [[3, 'removed-in-7'], [4, 'removed-in-7'], [5, 'removed-in-7'], [6, 'removed-in-7']]);
});

// ─── changes-in-8 ───
test('changes-in-8: reports legacy motion tokens, never the spring ones or definitions', () => {
  const src = `.a { transition: opacity var(--duration-normal) var(--ease-out); }
.b { transition: transform var(--motion-spring-effects-default-duration) var(--ease-spatial-default); }
.c { --duration-fast: 1ms; animation-timing-function: var(--ease-in-out); }
`;
  const { output, manual } = migrateSource(src, { ext: '.css', rules: only('changes-in-8') });
  assert.equal(output, src);
  assert.deepEqual(manual.map((m) => [m.line, m.message.split(' ')[0]]), [[1, '--duration-normal'], [1, '--ease-out'], [3, '--ease-in-out']]);
});

test('changes-in-8: Motion easing, default scrollLock, safeHref and custom-scheme links', () => {
  const src = `import { Fade, Dialog, Drawer, CommandPalette, safeHref } from '@nexub/react';
<Fade in easing="out">x</Fade>;
<Fade in duration="fast">x</Fade>;
<Dialog.Root open={o}>x</Dialog.Root>;
<Drawer.Root scrollLock="class">x</Drawer.Root>;
<CommandPalette {...p} />;
const a = safeHref(u);
const b = safeHref(u, { strict: true });
<AppHeader homeHref="slack://open" logoHref="https://x.dev" />;
const items = [{ href: 'tel:123' }, { href: 'zoommtg://join' }];
`;
  const { output, manual } = migrateSource(src, { ext: '.tsx', rules: only('changes-in-8') });
  assert.equal(output, src);
  assert.deepEqual(manual.map((m) => m.line), [2, 4, 6, 7, 9, 10]);
  assert.match(manual[2].message, /unless the spread sets scrollLock/);
});

test('changes-in-8: Signature note where @nexub/themes is imported, unless data-style is set', () => {
  const report = (src, ext) => migrateSource(src, { ext, rules: only('changes-in-8') }).manual.map((m) => m.line);
  assert.deepEqual(report(`@import "tailwindcss";\n@import "@nexub/themes/base";\n@import "@nexub/themes/light";\n`, '.css'), [2]);
  assert.deepEqual(report(`import '@nexub/themes/base.css';\n`, '.tsx'), [1]);
  assert.deepEqual(report(`import '@nexub/themes/base.css';\n<html data-style="classic" />;\n`, '.tsx'), []);
  // Files that don't import Nexub are left alone.
  assert.deepEqual(report(`<Dialog.Root /><Fade easing="out" />;\nconst x = { href: 'slack://a' };\n`, '.tsx'), []);
});

// ─── button-aliases ───
test('button-aliases: rewrites legacy Button variants, leaves other components and expressions', () => {
  const src = [
    "import { Button as B, IconButton, buttonVariants } from '@nexub/react';",
    '<B variant="primary" size="sm">Go</B>',
    "<B variant={'ghost'} />",
    '<IconButton variant="ghost" aria-label="x" />',
    '<B variant={cond ? "outline" : "filled"} />',
    "<a className={buttonVariants({ size: 'sm', variant: 'secondary' })} />",
  ].join('\n');
  const { output, manual } = migrateSource(src, { ext: '.tsx', rules: only('button-aliases') });
  assert.equal(output, [
    "import { Button as B, IconButton, buttonVariants } from '@nexub/react';",
    '<B variant="filled" size="sm">Go</B>',
    '<B variant="text" />',
    '<IconButton variant="ghost" aria-label="x" />',
    '<B variant={cond ? "outline" : "filled"} />',
    "<a className={buttonVariants({ size: 'sm', variant: 'tonal' })} />",
  ].join('\n'));
  assert.deepEqual(manual.map((m) => [m.line, m.rule]), [[5, 'button-aliases']]);
});

// ─── changes-in-9 ───
test('changes-in-9: renames the 8.5 aliases, reports classic and hidePassword', () => {
  const web = [
    "import { DatePicker, NumberInput as N, Input } from '@nexub/react';",
    '<DatePicker value={d} onChange={setD} />',
    '<N onChange={setN} />',
    '<Input onChange={onInput} />',
    '<html data-style="classic" />',
  ].join('\n');
  const w = migrateSource(web, { ext: '.tsx', rules: only('changes-in-9') });
  assert.equal(w.output, [
    "import { DatePicker, NumberInput as N, Input } from '@nexub/react';",
    '<DatePicker value={d} onValueChange={setD} />',
    '<N onValueChange={setN} />',
    '<Input onChange={onInput} />',
    '<html data-style="classic" />',
  ].join('\n'));
  assert.deepEqual(w.manual.map((m) => [m.line, m.rule]), [[5, 'changes-in-9']]);

  const native = [
    "import { Dialog, BottomSheet, DateTimeField, ButtonGroup, NexubNativeProvider } from '@nexub/react-native';",
    '<Dialog dismissable={false} open />',
    '<BottomSheet dismissable />',
    '<DateTimeField minimumDate={a} maximumDate={b} />',
    '<ButtonGroup direction="stack" />',
    '<ButtonGroup direction={dir} />',
    '<NexubNativeProvider style="classic" />',
    'const messages = { hidePassword: "Hide" };',
  ].join('\n');
  const n = migrateSource(native, { ext: '.tsx', rules: only('changes-in-9') });
  assert.equal(n.output.split('\n').slice(1, 5).join('\n'), [
    '<Dialog dismissible={false} open />',
    '<BottomSheet dismissible />',
    '<DateTimeField minDate={a} maxDate={b} />',
    '<ButtonGroup orientation="vertical" />',
  ].join('\n'));
  assert.deepEqual(n.manual.map((m) => m.line), [6, 7, 8]);
  // The web DatePicker rule doesn't touch an @nexub/react-native import, and vice versa.
  assert.equal(migrateSource("import { NumberInput } from '@nexub/react-native';\n<NumberInput onChange={f} />", { ext: '.tsx', rules: only('changes-in-9') }).output.includes('onChange'), true);
});
