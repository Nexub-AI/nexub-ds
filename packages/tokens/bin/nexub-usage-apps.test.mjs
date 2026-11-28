import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  readAttrs,
  analyzeSource,
  findCopies,
  importsOf,
  deprecatedIn,
  wrapperMap,
  scanApp,
  summarize,
  manifestsOf,
  appVersion,
} from './nexub-usage-apps.mjs';

/** Writes { 'path/in/app': text } under a fresh temp folder and returns it. */
function fixture(files) {
  const root = mkdtempSync(join(tmpdir(), 'nexub-usage-'));
  for (const [path, text] of Object.entries(files)) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), typeof text === 'string' ? text : JSON.stringify(text));
  }
  return root;
}

test('readAttrs: bare, string, expression and spread props; nested braces and strings', () => {
  const src = ` variant="filled" disabled onClick={() => go({ a: '}' })} {...rest} className={cn('p-4', x && "w-full")}>`;
  const { attrs, end } = readAttrs(src, 0);
  assert.deepEqual(
    attrs.map((a) => a.name),
    ['variant', 'disabled', 'onClick', '...', 'className'],
  );
  assert.equal(src[end - 1], '>');
});

test('analyzeSource: components, props, aliases, namespaces and compound parts', () => {
  const src = `
    import { Button as Btn, Card, Text } from '@nexub/react';
    import * as N from '@nexub/patterns';
    import { Check } from '@nexub/icons';
    const x = useState<Card>(null);
    export function Page() {
      return (
        <Card variant="outlined" className="p-6 flex gap-2">
          <Card.Header className="mb-2" />
          <Btn variant="filled" size="sm" onClick={go}>Go</Btn>
          <Btn variant="text" className="w-full">Back</Btn>
          <Text style={{ color: 'red' }}>Hi</Text>
          <N.StatCard label="Revenue" />
          <Check className="size-4" />
        </Card>
      );
    }`;
  const r = analyzeSource(src, { ext: '.tsx' });
  assert.deepEqual(r.components, { Card: 1, 'Card.Header': 1, Button: 2, Text: 1, StatCard: 1 });
  assert.deepEqual(r.props.Button, { variant: 2, size: 1, onClick: 1, className: 1 });
  // className on Card restyles it (p-6); Card.Header's mb-2 and Button's w-full only place it.
  assert.deepEqual(r.className, { Card: 1, 'Card.Header': 1, Button: 1 });
  assert.deepEqual(r.classNameVisual, { Card: 1 });
  assert.deepEqual(r.style, { Text: 1 });
  assert.equal(r.classTokens.Button['w-full'], 1);
});

test('analyzeSource: a workspace package with an @nexub name is not Nexub', () => {
  const src = `import { Panel } from '@nexub/admin-ui';\nconst a = <Panel title="x" />;`;
  const r = analyzeSource(src, { ext: '.tsx', isDs: (p) => p !== '@nexub/admin-ui' });
  assert.deepEqual(r.components, {});
  assert.deepEqual(r.imports, [{ pkg: '@nexub/admin-ui', name: 'Panel' }]);
});

test('analyzeSource: overrides in CSS and code (.nx-* selectors, Nexub custom properties)', () => {
  const dsVars = new Set(['--color-primary', '--radius-md']);
  const css = `/* .nx-card in a comment */\n.nx-card .title { color: red }\n:root { --color-primary: #f00; --app-own: 1px; }\n@media (min-width: 1px) { .x { --radius-md: 0 } }`;
  const c = analyzeSource(css, { ext: '.css', dsVars });
  assert.equal(c.nxSelectors, 1);
  assert.deepEqual(c.varOverrides, { '--color-primary': 1, '--radius-md': 1 });
  const tsx = `const a = <div className="[&_.nx-button]:rounded-none [--color-primary:red]" style={{ '--radius-md': '0' }} />;\nel.style.setProperty('--color-primary', v);`;
  const t = analyzeSource(tsx, { ext: '.tsx', dsVars });
  assert.equal(t.nxSelectors, 1);
  assert.deepEqual(t.varOverrides, { '--color-primary': 2, '--radius-md': 1 });
});

test('analyzeSource: native elements that have a Nexub part', () => {
  const r = analyzeSource(`const a = <><button>x</button><input type="checkbox" /><input type="text" /><select /></>;`, { ext: '.tsx' });
  assert.deepEqual(r.native, { button: 1, 'input[type=checkbox]': 1, select: 1 });
});

test('findCopies: a name match with own markup, a role match, and wrappers that are not copies', () => {
  const parts = new Set(['Badge', 'Button', 'StatCard', 'Section', 'CheckboxField']);
  const src = `
import { Button as DsButton, CheckboxField as DsCheckboxField } from '@nexub/react';
export function Badge({ children }) {
  return <span className="rounded-full px-2">{children}</span>;
}
export function Button(props) {
  return <DsButton {...props} />;
}
export function CheckboxField({ hint, ...p }) {
  return <div><DsCheckboxField description={hint} {...p} /></div>;
}
export function Section({ children }) {
  return <section>{children}</section>;
}
function Picker() {
  return <div role="dialog" aria-modal="true"><div role="switch" /></div>;
}
const StatCard = () => <OtherCard />;
`;
  const copies = findCopies(src, importsOf(src), parts);
  assert.deepEqual(copies, [
    { part: 'Badge', kind: 'name' },
    { part: 'Dialog', kind: 'role' },
    { part: 'Switch', kind: 'role' },
  ]);
});

test('deprecatedIn: counts removed APIs from nexub-migrate rules, not default-change notices', () => {
  const css = `.a { outline: 2px solid var(--color-brand-primary-500); }\n@import '@nexub/themes/base';`;
  assert.deepEqual(deprecatedIn(css, '.css'), { 'legacy-tokens': 1 });
  const tsx = `import { Button, Banner } from '@nexub/react';\nconst a = <Button variant="primary">Go</Button>;`;
  const d = deprecatedIn(tsx, '.tsx');
  assert.equal(d['button-aliases'], 1);
  assert.ok(d['deprecated-components'] >= 1);
  assert.deepEqual(deprecatedIn(`const a = 1;`, '.ts'), {});
});

test('manifestsOf / appVersion: versions asked for, and @nexub workspace packages', () => {
  const root = fixture({
    'web/package.json': { dependencies: { '@nexub/react': '^12.2.0', '@nexub/admin-ui': 'workspace:*', '@nexub/icons': '12.2.0' } },
    'api/package.json': { name: '@nexub/crm-api', dependencies: { '@nexub/db': 'workspace:*' } },
    'web/node_modules/@nexub/react/package.json': { name: '@nexub/react', version: '9.0.0' },
  });
  try {
    const m = manifestsOf(root);
    assert.deepEqual(m.versions, { '@nexub/react': ['^12.2.0'], '@nexub/icons': ['12.2.0'] });
    assert.deepEqual([...m.workspace].sort(), ['@nexub/admin-ui', '@nexub/crm-api', '@nexub/db']);
    assert.equal(appVersion(m.versions), '12.2.0');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

/** A small monorepo: a wrapper package and two apps. */
function platform() {
  return fixture({
    'packages/ui/package.json': { name: '@nexub/ui' },
    'packages/ui/src/index.ts': `export * from './fields';`,
    'packages/ui/src/fields.tsx': `
import { ComboboxField as DsComboboxField, FormField, NumberInput, Select } from '@nexub/react';
import { StatCard } from '@nexub/patterns';
export function ComboboxField(p) {
  return <DsComboboxField {...p} />;
}
export function NumberField({ label, ...p }) {
  return <FormField label={label}><NumberInput {...p} /></FormField>;
}
export function SelectField(p) {
  return <FormField label={p.label}><Select {...p} /></FormField>;
}
export const PickField = (p) => p.options.length > 10 ? <ComboboxField {...p} /> : <SelectField {...p} />;
export function Metric(p) {
  return <StatCard {...p} />;
}
export const askText = (o) => new Promise((r) => r(null));
`,
    'apps/crm/web/package.json': { dependencies: { '@nexub/react': '12.2.0', '@nexub/ui': 'workspace:*' } },
    'apps/crm/web/src/page.tsx': `
import { Button, Card } from '@nexub/react';
import { PickField, Metric, askText } from '@nexub/ui';
export function Page() {
  const reason = askText({ title: 'Why?' });
  return <Card className="p-4"><Button variant="primary">Save</Button><PickField options={[]} /><Metric label="x" /></Card>;
}
`,
    'apps/crm/web/src/page.test.tsx': `import { Button } from '@nexub/react';\nconst a = <Button />;`,
    'apps/crm/web/src/index.css': `.nx-card { padding: 0 }`,
    'apps/go/web/package.json': { dependencies: { '@nexub/react': '^12.5.0' } },
    'apps/go/web/src/page.tsx': `
import { Button } from '@nexub/react';
function Badge({ children }) { return <span className="rounded-full">{children}</span>; }
export const Page = () => <Button onClick={go}>Go</Button>;
`,
  });
}

test('wrapperMap: what each wrapper export renders, through other wrappers of the same package', () => {
  const root = platform();
  try {
    const w = wrapperMap(join(root, 'packages/ui'));
    assert.equal(w.pkg, '@nexub/ui');
    assert.deepEqual(w.exports, {
      ComboboxField: ['ComboboxField'],
      NumberField: ['FormField', 'NumberInput'],
      SelectField: ['FormField', 'Select'],
      PickField: ['ComboboxField', 'FormField', 'Select'],
      Metric: ['StatCard'],
    });
    assert.ok(w.names.includes('askText'));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('scanApp: per-app counts, indirect use through the wrapper, stopgaps still imported', () => {
  const root = platform();
  try {
    const wrappers = [wrapperMap(join(root, 'packages/ui'))];
    const stopgaps = [
      { pkg: '@nexub/ui', name: 'PickField', replacement: 'ComboboxField', since: '11.1.0' },
      { pkg: '@nexub/ui', name: 'askText', replacement: 'usePrompt()', since: '11.2.0' },
      { pkg: '@nexub/ui', name: 'UsageMetric', replacement: 'UsageTile', since: '11.3.0' },
      { name: 'window.prompt', pattern: '\\bwindow\\.prompt\\(', replacement: 'usePrompt()', since: '11.2.0' },
    ];
    const parts = new Set(['Badge', 'Button', 'Card']);
    const crm = scanApp(join(root, 'apps/crm'), { wrappers, stopgaps, parts });
    assert.equal(crm.version, '12.2.0');
    assert.deepEqual(crm.components, { Button: 1, Card: 1 }); // the test file is skipped
    assert.deepEqual(crm.props.Button, { variant: 1 });
    assert.deepEqual(crm.indirect, { ComboboxField: 1, FormField: 1, Select: 1, StatCard: 1 });
    assert.deepEqual(crm.stopgaps, { PickField: 1, askText: 1 });
    assert.equal(crm.overrides.nxSelectors, 1);
    assert.deepEqual(crm.overrides.classNameVisual, { Card: 1 });
    assert.deepEqual(crm.deprecated, { 'button-aliases': 1 });
    const s = summarize(crm);
    assert.equal(s.componentsDirect, 2);
    assert.equal(s.componentsWithWrappers, 6);
    assert.equal(s.overrides, 2);
    assert.equal(s.stopgaps, 2);

    const go = scanApp(join(root, 'apps/go'), { wrappers, stopgaps, parts });
    assert.equal(go.version, '12.5.0');
    assert.deepEqual(go.copies, { Badge: { name: 1 } });
    assert.deepEqual(go.stopgaps, {});
    assert.equal(scanApp(join(root, 'apps/crm'), { wrappers, stopgaps, parts, tests: true }).components.Button, 2);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('CLI: --apps prints one row per app, and --json the full reports; the old table still works', () => {
  const root = platform();
  const bin = join(dirname(fileURLToPath(import.meta.url)), 'nexub-usage.mjs');
  try {
    const parts = join(root, 'parts.json');
    writeFileSync(parts, JSON.stringify({ '@nexub/react': ['Badge', 'Button', 'Card'] }));
    const md = execFileSync(process.execPath, [bin, '--apps', join(root, 'apps/crm'), join(root, 'apps/go'), '--wrapper', join(root, 'packages/ui'), '--parts', parts], { encoding: 'utf8' });
    const rows = md.trim().split('\n');
    assert.equal(rows.length, 4);
    assert.match(rows[3], /apps\/go \| 12\.5\.0 \| 1 \(1\) \| 1 \| 0 \| 1 \| 0 \| 0 \|$/);
    const json = JSON.parse(execFileSync(process.execPath, [bin, '--apps', join(root, 'apps/crm'), '--wrapper', join(root, 'packages/ui'), '--json'], { encoding: 'utf8' }));
    assert.deepEqual(json.wrappers[0].exports.Metric, ['StatCard']);
    assert.equal(Object.values(json.apps)[0].components.Card, 1);
    const old = execFileSync(process.execPath, [bin, join(root, 'apps/go')], { encoding: 'utf8' });
    assert.match(old, /^\| Package \| Export \| Imports \| Repos \|/);
    assert.match(old, /\| @nexub\/react \| Button \| 1 \| 1 \|/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
