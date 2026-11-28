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
  const css = ['base', 'light', 'products'].map((f) => readFileSync(path.join(here, `../../themes/src/${f}.css`), 'utf8')).join('\n');
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
    '<NexubNativeProvider style="signature" />',
  ].join('\n');
  const n = migrateSource(native, { ext: '.tsx', rules: only('changes-in-9') });
  assert.equal(n.output.split('\n').slice(1, 5).join('\n'), [
    '<Dialog dismissible={false} open />',
    '<BottomSheet dismissible />',
    '<DateTimeField minDate={a} maxDate={b} />',
    '<ButtonGroup orientation="vertical" />',
  ].join('\n'));
  assert.deepEqual(n.manual.map((m) => m.line), [6, 7, 8, 9]);
  // The web DatePicker rule doesn't touch an @nexub/react-native import, and vice versa.
  assert.equal(migrateSource("import { NumberInput } from '@nexub/react-native';\n<NumberInput onChange={f} />", { ext: '.tsx', rules: only('changes-in-9') }).output.includes('onChange'), true);
});

// ─── changes-in-11 ───
test('changes-in-11: product theme files move to the generated map', () => {
  const css = [
    "@import '@nexub/themes/light' layer(base);",
    "@import '@nexub/themes/leap' layer(base);",
    '@import "@nexub/themes/src/payub.css";',
    '@import url(@nexub/themes/founderub);',
    '[data-product="leap"] { color: red; }',
  ].join('\n');
  const c = migrateSource(css, { ext: '.css', rules: only('changes-in-11') });
  assert.equal(c.output, [
    "@import '@nexub/themes/light' layer(base);",
    "@import '@nexub/themes/products' layer(base);",
    '@import "@nexub/themes/src/products.css";',
    '@import url(@nexub/themes/products);',
    '[data-product="leap"] { color: red; }',
  ].join('\n'));
  // The second and third are now duplicates of the first: reported so they get deleted.
  assert.deepEqual(c.manual.map((m) => [m.line, m.rule]), [[3, 'changes-in-11'], [4, 'changes-in-11']]);

  const js = migrateSource("import '@nexub/themes/products';\nimport '@nexub/themes/bookub';\nimport '@nexub/themes/leapfrog';", { ext: '.ts', rules: only('changes-in-11') });
  assert.equal(js.output, "import '@nexub/themes/products';\nimport '@nexub/themes/products';\nimport '@nexub/themes/leapfrog';");
  assert.deepEqual(js.manual.map((m) => m.line), [2]);
  // A second run changes nothing.
  assert.equal(migrateSource(c.output, { ext: '.css', rules: only('changes-in-11') }).output, c.output);
});

test('changes-in-11: reports overlays without a sheet prop, rewrites none', () => {
  const src = [
    "import { Select, DropdownMenu as Menu, DatePicker, Breadcrumb, Dialog, Button } from '@nexub/react';",
    "import { AppHeader } from '@nexub/patterns';",
    '<Select.Root><Select.Trigger /><Select.Content>x</Select.Content></Select.Root>',
    '<Select.Content sheet="auto">x</Select.Content>',
    '<Menu.Content align="end" />',
    '<Menu.Content sheet={false} />',
    '<DatePicker value={d} />',
    '<DatePicker sheet />',
    '<DatePicker {...props} />',
    '<Breadcrumb.Trail items={items} />',
    '<AppHeader user={user} />',
    '<Dialog.Content /><Button />',
  ].join('\n');
  const r = migrateSource(src, { ext: '.tsx', rules: only('changes-in-11') });
  assert.equal(r.output, src);
  assert.deepEqual(r.manual.map((m) => [m.line, m.rule]), [3, 5, 7, 9, 10, 11].map((l) => [l, 'changes-in-11']));
  assert.match(r.manual[0].message, /^<Select\.Content> has no sheet prop: in 11\.0 the default changed from false to "auto".*sheet=\{false\}/);
  assert.match(r.manual[1].message, /^<DropdownMenu\.Content>/);
  assert.match(r.manual[3].message, /spread/);
  // Same names from another package are not ours.
  assert.deepEqual(migrateSource("import { DatePicker } from 'antd';\n<DatePicker />", { ext: '.tsx', rules: only('changes-in-11') }).manual, []);
});

test('deprecated-in-11: reports Stepper current={-1}, rewrites nothing', () => {
  const src = [
    "import { Stepper as Steps } from '@nexub/react';",
    '<Steps steps={s} current={-1} />',
    '<Steps steps={s} current={2} />',
    '<Steps steps={s} current={ - 1 } orientation="vertical" />',
  ].join('\n');
  const r = migrateSource(src, { ext: '.tsx', rules: only('deprecated-in-11') });
  assert.equal(r.output, src);
  assert.deepEqual(r.manual.map((m) => [m.line, m.rule]), [[2, 'deprecated-in-11'], [4, 'deprecated-in-11']]);
  assert.deepEqual(migrateSource("import { Stepper } from 'other';\n<Stepper current={-1} />", { ext: '.tsx', rules: only('deprecated-in-11') }).manual, []);
});

// ─── changes-in-12 ───
const c12 = (src, ext = '.tsx') => migrateSource(src, { ext, rules: only('changes-in-12') });

test('changes-in-12: the 11.9 layered stylesheet goes back to styles.css (JS, CSS, url())', () => {
  const js = c12("import '@nexub/react/styles.nexub-layer.css';\nimport \"@nexub/react/styles.css\";", '.ts');
  assert.equal(js.output, "import '@nexub/react/styles.css';\nimport \"@nexub/react/styles.css\";");
  const css = c12("@import '@nexub/react/styles.nexub-layer.css';\n@import url(@nexub/react/styles.nexub-layer.css) layer(x);\n@import '@nexub/react/styles.nexub-layer.css.map';", '.css');
  assert.equal(css.output, "@import '@nexub/react/styles.css';\n@import url(@nexub/react/styles.css) layer(x);\n@import '@nexub/react/styles.nexub-layer.css.map';");
  assert.deepEqual(css.manual, []);
  assert.equal(c12(css.output, '.css').output, css.output);
});

test('changes-in-12: rewrites Stepper current={-1} with literal steps, reports the rest', () => {
  const src = [
    "import { Stepper as Steps } from '@nexub/react';",
    "<Steps current={-1} steps={[{ label: 'A' }, { label: 'B', status: 'error' }, {label:'C'}]} />",
    '<Steps steps={[',
    "  { label: 'A' },",
    '  {',
    "    label: 'B',",
    '  },',
    ']} current={ - 1 } orientation="vertical" />',
    '<Steps steps={steps} current={-1} />',
    "<Steps steps={[{ label: 'A' }, ...more]} current={-1} />",
    "<Steps steps={[{ label: 'A', ...extra }]} current={-1} />",
    "<Steps steps={[{ label: 'A' }]} current={-1} completed={[0]} />",
    '<Steps steps={[]} current={-1} />',
    "<Steps steps={[{ label: 'A' }]} current={2} />",
  ].join('\n');
  const r = c12(src);
  assert.deepEqual(r.output.split('\n'), [
    "import { Stepper as Steps } from '@nexub/react';",
    // A step's own status already won over current={-1}: it is kept.
    "<Steps current={2} steps={[{ label: 'A', status: 'complete' }, { label: 'B', status: 'error' }, {label:'C', status: 'complete'}]} />",
    '<Steps steps={[',
    "  { label: 'A', status: 'complete' },",
    '  {',
    "    label: 'B', status: 'complete',",
    '  },',
    ']} current={1} orientation="vertical" />',
    ...src.split('\n').slice(8),
  ]);
  assert.deepEqual(r.manual.map((m) => [m.line, m.rule]), [9, 10, 11, 12, 13].map((l) => [l, 'changes-in-12']));
  // Idempotent: a second run rewrites nothing and reports the same five.
  assert.equal(c12(r.output).output, r.output);
  assert.equal(c12(r.output).manual.length, 5);
  assert.equal(
    c12("import { Stepper } from '@nexub/react';\n<Stepper current={-1} steps={[{}]} />").output,
    "import { Stepper } from '@nexub/react';\n<Stepper current={0} steps={[{ status: 'complete' }]} />",
  );
  const other = "import { Stepper } from 'other';\n<Stepper current={-1} steps={[{}]} />";
  assert.deepEqual(c12(other), { output: other, manual: [] });
});

test('changes-in-12 is opt-in', () => {
  const src = "import '@nexub/react/styles.nexub-layer.css';";
  assert.equal(migrateSource(src, { ext: '.ts' }).output, src);
});

// ─── 12.7 codemods ───
const mod = (src, ...r) => tsx(src, { rules: only(...r) });
const REACT = "import { Button, Text } from '@nexub/react';\n";

test('text-weight: moves a bare weight class into the prop, keeps the rest', () => {
  const src = `${REACT}<Text className="font-medium text-sm">a</Text>
<Text size="caption" className='font-normal'>b</Text>
<Text className={"truncate font-bold"} />
<Text className={\`font-semibold md:font-bold\`}>c</Text>
<Text className="font-mono">d</Text>`;
  const { output, manual } = mod(src, 'text-weight');
  assert.equal(output, `${REACT}<Text weight="medium" className="text-sm">a</Text>
<Text size="caption" weight="regular">b</Text>
<Text weight="bold" className={"truncate"} />
<Text weight="semibold" className={\`md:font-bold\`}>c</Text>
<Text className="font-mono">d</Text>`);
  assert.deepEqual(manual, []);
});

test('text-weight: reports dynamic, doubled, conflicting, already-set and spread cases, rewrites none', () => {
  const interp = ['$', '{x}'].join(''); // a template literal with an interpolation, in the fixture
  const src = `${REACT}<Text className={cn('font-medium', x && 'a')} />
<Text className={\`font-bold ${interp}\`} />
<Text className="font-medium font-bold" />
<Text className="font-light font-medium" />
<Text weight="bold" className="font-medium" />
<Text {...p} className="font-medium" />
<Text className={cn('text-sm', x)} />`;
  const { output, manual } = mod(src, 'text-weight');
  assert.equal(output, src);
  assert.deepEqual(manual.map((m) => m.line), [2, 3, 4, 5, 6, 7]);
  assert.ok(manual.every((m) => m.rule === 'text-weight'));
});

test('text-weight: only Text from @nexub/react, aliases followed', () => {
  const other = "import { Text } from 'ui';\n<Text className=\"font-medium\" />";
  assert.equal(mod(other, 'text-weight').output, other);
  const aliased = "import { Text as T } from '@nexub/react';\n<T className=\"font-medium\" />";
  assert.equal(mod(aliased, 'text-weight').output, "import { Text as T } from '@nexub/react';\n<T weight=\"medium\" />");
});

test('text-truncate: moves truncate, reports conflicts and an existing prop', () => {
  const src = `${REACT}<Text className="min-w-0 truncate">a</Text>
<Text className="truncate whitespace-normal" />
<Text truncate={false} className="truncate" />
<Text className={cn(a && 'truncate')} />`;
  const { output, manual } = mod(src, 'text-truncate');
  assert.equal(output.split('\n')[1], '<Text truncate className="min-w-0">a</Text>');
  assert.deepEqual(output.split('\n').slice(2), src.split('\n').slice(2));
  assert.deepEqual(manual.map((m) => m.line), [3, 4, 5]);
});

test('text-weight + text-truncate together; multi-line className keeps its lines', () => {
  const src = `${REACT}<Text\n  className="font-medium\n    truncate text-sm"\n/>`;
  const { output } = mod(src, 'text-weight', 'text-truncate');
  assert.equal(output, `${REACT}<Text weight="medium" truncate\n  className="\n    text-sm"\n/>`);
  assert.equal(output.split('\n').length, src.split('\n').length);
});

test('button-full-width: moves w-full, leaves other w- classes and other components', () => {
  const src = `${REACT}import { IconButton } from '@nexub/react';
<Button className="w-full" type="submit">Go</Button>
<Button variant="tonal" className="mt-4 w-full sm:w-auto">Go</Button>
<Button className="w-full max-w-xs w-32" />
<Button fullWidth className="w-full" />
<IconButton className="w-full" />`;
  const { output, manual } = mod(src, 'button-full-width');
  const lines = output.split('\n');
  assert.equal(lines[2], '<Button fullWidth type="submit">Go</Button>');
  assert.equal(lines[3], '<Button variant="tonal" fullWidth className="mt-4 sm:w-auto">Go</Button>');
  assert.deepEqual(lines.slice(4), src.split('\n').slice(4));
  assert.deepEqual(manual.map((m) => m.line), [5, 6]);
});

test('codemods are opt-in', () => {
  const src = `${REACT}<Text className="font-medium truncate" /><Button className="w-full" />`;
  assert.equal(tsx(src).output, src);
});

// admin-ui-wrappers
const wrap = (src, opts = {}) => tsx(src, { rules: only('admin-ui-wrappers'), ...opts });

test('admin-ui-wrappers: CheckboxField and SwitchField move to @nexub/react, props renamed', () => {
  const src = `import { CheckboxField, SwitchField, Page } from '@nexub/admin-ui';
import { Button } from '@nexub/react';
<CheckboxField label="A" hint="h" checked={a} onChange={v => setA(v)} />
<CheckboxField label="B" checked={b} onChange={(x) => setB(x)} error={err} />
<CheckboxField label="C" checked={c} onChange={setC} aside="$4" />
<CheckboxField label="D" checked={d} onChange={toggle('d')} disabled />
<SwitchField label="E" hint="h" checked={e} onChange={v => setE(v)} size="sm" />`;
  const { output, manual } = wrap(src);
  assert.deepEqual(manual, []);
  assert.equal(output, `import { Page } from '@nexub/admin-ui';
import { Button, CheckboxField, SwitchField } from '@nexub/react';
<CheckboxField label="A" description="h" checked={a} onCheckedChange={(v: boolean) => setA(v)} />
<CheckboxField label="B" checked={b} onCheckedChange={(x: boolean) => setB(x)} error={err} />
<CheckboxField label="C" checked={c} onCheckedChange={setC} aside="$4" />
<CheckboxField label="D" checked={d} onCheckedChange={toggle('d')} disabled />
<SwitchField label="E" description="h" checked={e} onCheckedChange={v => setE(v)} size="sm" />`);
});

test('admin-ui-wrappers: Metric becomes StatCard from @nexub/patterns', () => {
  const src = `import { Metric, MetricRow } from '@nexub/admin-ui';
<MetricRow>
  <Metric label="Revenue" value={v} change={0.1} />
  <Metric label="Churn" value={c} note="30 days" invert className="col-span-2" />
  <Metric label="Cost" value={x} trend={t} invert={isCost} />
  <Metric label="Flat" value={y} note="n" invert={false}></Metric>
</MetricRow>`;
  const { output, manual } = wrap(src);
  assert.deepEqual(manual, []);
  assert.equal(output, `import { MetricRow } from '@nexub/admin-ui'; import { StatCard } from '@nexub/patterns';
<MetricRow>
  <StatCard className="h-full" label="Revenue" value={v} change={0.1} />
  <StatCard label="Churn" value={c} note="30 days" tone="bad-when-high" className="h-full col-span-2" />
  <StatCard className="h-full" label="Cost" value={x} trend={t} tone={isCost ? 'bad-when-high' : 'default'} />
  <StatCard className="h-full" label="Flat" value={y} note="n"></StatCard>
</MetricRow>`);
});

test('admin-ui-wrappers: a fully moved import is replaced in place; aliases kept', () => {
  const src = `import { CheckboxField as Check } from "@nexub/admin-ui";\n<Check label="A" checked={a} onChange={setA} />`;
  assert.equal(wrap(src).output, `import { CheckboxField as Check } from "@nexub/react";\n<Check label="A" checked={a} onCheckedChange={setA} />`);
  const multi = `import {\n  Metric,\n  SwitchField,\n} from '@nexub/admin-ui';\nimport { StatCard } from '@nexub/patterns';\n<Metric label="A" value={1} note="n" />\n<SwitchField label="B" checked={b} onChange={setB} />`;
  assert.equal(wrap(multi).output, `import { SwitchField } from '@nexub/react';\n\n\n\nimport { StatCard } from '@nexub/patterns';\n<StatCard className="h-full" label="A" value={1} note="n" />\n<SwitchField label="B" checked={b} onCheckedChange={setB} />`);
});

test('admin-ui-wrappers: skips a component whose uses do not all map, and says why', () => {
  const src = `import { CheckboxField, Metric, SwitchField } from '@nexub/admin-ui';
<CheckboxField label="A" checked={a} onChange={setA} />
<CheckboxField label="B" {...rest} />
<Metric label="M" value={1} note="n" onClick={open} />
<SwitchField label="S" checked={s} onChange={setS} required />
<CheckboxField label="C" checked={c} onChange={function (v) { setC(v); }} />
const Same = CheckboxField;`;
  const { output, manual } = wrap(src);
  assert.equal(output, src);
  assert.deepEqual(manual.map((m) => m.line), [3, 4, 5, 6, 7]);
  assert.match(manual.find((m) => m.line === 4).message, /onClick/);
});

test('admin-ui-wrappers: ComboboxField and askText are report-only; other packages untouched', () => {
  const src = `import { ComboboxField, askText } from '@nexub/admin-ui';
<ComboboxField label="A" value={v} onChange={setV} options={o} />
const r = await askText({ title: 'Why?', label: 'Reason' });`;
  const { output, manual } = wrap(src);
  assert.equal(output, src);
  assert.deepEqual(manual.map((m) => m.line), [2, 3]);
  const other = "import { CheckboxField } from 'elsewhere';\n<CheckboxField label=\"A\" onChange={f} />";
  assert.deepEqual(wrap(other), { output: other, manual: [] });
});

test('admin-ui-wrappers: the wrapper package is a flag; a taken StatCard name blocks Metric', () => {
  const src = "import { SwitchField } from '@acme/ui';\n<SwitchField label=\"A\" checked={a} onChange={setA} />";
  assert.equal(wrap(src, { wrapperPackage: '@acme/ui' }).output, "import { SwitchField } from '@nexub/react';\n<SwitchField label=\"A\" checked={a} onCheckedChange={setA} />");
  assert.equal(wrap(src).output, src);
  const taken = "import { Metric } from '@nexub/admin-ui';\nimport { StatCard } from './local';\n<Metric label=\"A\" value={1} note=\"n\" />";
  const r = wrap(taken);
  assert.equal(r.output, taken);
  assert.match(r.manual[0].message, /already a name/);
});

test('cli: --codemod runs only codemods, --dry writes nothing, unknown ids are usage errors', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'nexub-codemod-'));
  mkdirSync(path.join(dir, 'src'));
  const file = path.join(dir, 'src/A.tsx');
  const src = `import { Text } from '@nexub/react';\nexport const A = () => <Text className="ml-2 font-medium">a</Text>;\n`;
  writeFileSync(file, src);
  const dry = cli(['--codemod', 'text-weight', '--dry', '--json'], dir);
  assert.equal(dry.code, 0);
  assert.equal(JSON.parse(dry.out).results[0].changes[0].after, 'export const A = () => <Text weight="medium" className="ml-2">a</Text>;');
  assert.equal(readFileSync(file, 'utf8'), src);
  assert.match(cli(['--codemod', 'all'], dir).out, /^\+export const A = \(\) => <Text weight="medium" className="ml-2">a<\/Text>;$/m);
  assert.equal(cli(['--codemod', 'nope'], dir).code, 2);
  assert.equal(cli(['--codemod', 'text-weight', '--dry', '--write'], dir).code, 2);
  cli(['--codemod', 'text-weight', '--write'], dir);
  assert.match(readFileSync(file, 'utf8'), /<Text weight="medium" className="ml-2">/);
});
