'use client';

// The brand builder: pick one brand colour (or a product preset), see every
// text/background pair checked live for the chosen scheme and contrast level,
// preview real components in a scoped theme, and export the theme. All colour
// maths is @nexub/tokens/seed (via src/lib/brand-builder.ts), the same code
// <ThemeProvider seed> uses, so what you see here is what ships.
//
// No Suspense, lazy chunk or measured placeholder (#815/#817): the server renders
// the whole builder at its final size, and every ratio is computed from hex, so
// nothing below it moves when it hydrates.
import * as React from 'react';
import { createSeedRoles, createSeedTheme } from '@nexub/tokens/seed';
import { Download } from '@nexub/icons';
import {
  Alert,
  Badge,
  Button,
  Card,
  Checkbox,
  FormField,
  Input,
  SegmentedControl,
  Select,
  Switch,
  Tabs,
  Text,
} from '@nexub/react';
import { CodeSnippet } from '@/components/docs/CodeFrame';
import {
  HEX,
  LEVELS,
  buildExports,
  checkAll,
  checkPairs,
  longHex,
  summary,
  type ExportFile,
  type Level,
  type Neutrals,
  type Scheme,
  type Target,
} from '@/lib/brand-builder';

const PRESETS = ['#0059c8', '#e4572e', '#0f9d58', '#7b1fa2', '#ffb300', '#00897b'];
const START = '#e4572e';
/** How long the seed must hold still before the live region speaks. */
const ANNOUNCE_DELAY = 800;

// Literal class names per family, so Tailwind sees every one.
const SWATCHES: Record<Target, [role: string, className: string][]> = {
  primary: [
    ['primary', 'bg-primary text-on-primary'],
    ['on-primary', 'bg-on-primary text-primary'],
    ['primary-container', 'bg-primary-container text-on-primary-container'],
    ['on-primary-container', 'bg-on-primary-container text-primary-container'],
    ['inverse-primary', 'bg-inverse-primary text-inverse-surface'],
  ],
  tertiary: [
    ['tertiary', 'bg-tertiary text-on-tertiary'],
    ['on-tertiary', 'bg-on-tertiary text-tertiary'],
    ['tertiary-container', 'bg-tertiary-container text-on-tertiary-container'],
    ['on-tertiary-container', 'bg-on-tertiary-container text-tertiary-container'],
  ],
};

const cap = (s: string) => s[0]!.toUpperCase() + s.slice(1);

/** The scoped theme container. Seeded variables go in through CSSOM, not a style attribute. */
function Pane({ scheme, level, vars, children }: {
  scheme: Scheme;
  level: Level;
  vars: Record<string, string>;
  children: React.ReactNode;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    for (const [k, v] of Object.entries(vars)) el.style.setProperty(k, v);
    return () => {
      for (const k of Object.keys(vars)) el.style.removeProperty(k);
    };
  }, [vars]);
  return (
    <div
      ref={ref}
      data-theme={scheme}
      data-contrast={level}
      // Calm: the docs page is Vivid, whose gradient tokens resolve on <html> from the
      // Nexub primary and would paint over the seeded one. The preview shows the base look.
      data-expression="calm"
      data-theme-builder-pane=""
      role="group"
      aria-label={`Preview, ${scheme} theme`}
      className="flex flex-col gap-5 rounded-2xl border border-outline-variant bg-surface p-5 text-on-surface"
    >
      {children}
    </div>
  );
}

function Swatches({ target, roles }: { target: Target; roles: Record<string, string> }) {
  return (
    <ul aria-label="Accent roles" className="m-0 grid list-none grid-cols-2 gap-2 p-0 sm:grid-cols-3 lg:grid-cols-5">
      {SWATCHES[target].map(([role, className]) => (
        <li key={role} className={`m-0 flex min-h-20 flex-col justify-end rounded-xl border border-outline-variant p-3 ${className}`}>
          <span className="text-label-md">{role}</span>
          <span className="font-mono text-body-sm">{roles[role]}</span>
        </li>
      ))}
    </ul>
  );
}

function Preview() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          <Button>Save changes</Button>
          <Button variant="tonal">Preview</Button>
          <Button variant="outlined">Cancel</Button>
        </div>
        <FormField.Root name="workspace">
          <FormField.Label>Workspace name</FormField.Label>
          <FormField.Control>
            <Input placeholder="Acme" />
          </FormField.Control>
          <FormField.Description>Shown on invoices and invites.</FormField.Description>
        </FormField.Root>
        <div className="flex flex-wrap items-center gap-4">
          <Switch aria-label="Notifications" defaultChecked />
          <Checkbox aria-label="Remember me" defaultChecked />
          <Badge>New</Badge>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Card variant="surface">
          <div className="mb-1 flex items-center justify-between gap-2">
            <span className="text-title-sm text-on-surface">Team plan</span>
            <Badge variant="soft">Active</Badge>
          </div>
          <Text size="body-sm" tone="muted">Cards sit on the elevated surface; the accent marks what you can act on.</Text>
        </Card>
        <Tabs.Root defaultValue="overview">
          <Tabs.List aria-label="Preview sections">
            <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
            <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="overview"><Text size="body-sm">Three projects, two due this week.</Text></Tabs.Content>
          <Tabs.Content value="activity"><Text size="body-sm">Nothing new since yesterday.</Text></Tabs.Content>
        </Tabs.Root>
        <Alert tone="info" title="Status colours stay Nexub">Info, success, warning and error keep their meaning in every brand.</Alert>
      </div>
    </div>
  );
}

function download(file: ExportFile) {
  const url = URL.createObjectURL(new Blob([file.code], { type: file.mime ?? 'text/plain' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = file.filename!;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

export interface ThemeBuilderProps {
  /** Built-in surfaces per level and scheme (from @nexub/tokens/native, at build time). */
  neutrals: Neutrals;
  /** Product presets: each seeds the product brand (tertiary) family with that product's colour. */
  products: { id: string; label: string; seed: string }[];
}

export function ThemeBuilder({ neutrals, products }: ThemeBuilderProps) {
  const [input, setInput] = React.useState(START);
  const [lastGood, setLastGood] = React.useState(START);
  const [target, setTarget] = React.useState<Target>('primary');
  const [level, setLevel] = React.useState<Level>('standard');
  const [scheme, setScheme] = React.useState<Scheme>('light');
  const valid = HEX.test(input);
  if (valid && input !== lastGood) setLastGood(input);
  const s = longHex(valid ? input : lastGood);
  const product = (target === 'tertiary' && products.find((p) => longHex(p.seed) === s)?.id) || 'custom';

  const vars = React.useMemo(() => createSeedTheme(s, { target, contrast: level }), [s, target, level]);
  const roles = React.useMemo(() => createSeedRoles(s, { target, contrast: level })[scheme], [s, target, level, scheme]);
  const checks = React.useMemo(() => checkPairs(s, target, level, scheme, neutrals), [s, target, level, scheme, neutrals]);
  const all = React.useMemo(() => checkAll(s, target, neutrals), [s, target, neutrals]);
  const files = React.useMemo(() => buildExports(s, target, level), [s, target, level]);
  const hasApca = checks.some((c) => c.apca != null);
  const passed = checks.filter((c) => c.pass).length;

  // Polite and debounced: the result is read once the seed holds still, not per keystroke,
  // and not on load (the visible summary says it already).
  const text = summary(s, scheme, level, checks, all);
  const initial = React.useRef(text);
  const changed = React.useRef(false);
  const [said, setSaid] = React.useState('');
  React.useEffect(() => {
    if (!changed.current && text === initial.current) return;
    changed.current = true;
    const t = setTimeout(() => setSaid(text), ANNOUNCE_DELAY);
    return () => clearTimeout(t);
  }, [text]);

  const pickProduct = (id: string) => {
    const p = products.find((x) => x.id === id);
    if (!p) return;
    setInput(longHex(p.seed));
    setTarget('tertiary');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start gap-x-6 gap-y-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="tb-hex" className="text-label-md text-on-surface-variant">Brand colour</label>
          <span className="flex items-center gap-2">
            <input
              type="color"
              value={s}
              onChange={(e) => setInput(e.target.value)}
              aria-label="Brand colour picker"
              className="size-10 cursor-pointer rounded-lg border border-outline-variant bg-transparent p-0.5"
            />
            <Input
              id="tb-hex"
              value={input}
              onChange={(e) => setInput(e.target.value.trim())}
              aria-describedby="tb-hex-hint"
              aria-invalid={!valid}
              spellCheck={false}
              autoComplete="off"
              className="w-32 font-mono"
            />
          </span>
          {/* Always rendered, one line: the error replaces the hint instead of pushing the page down. */}
          <p id="tb-hex-hint" className={`m-0 min-h-5 text-body-sm ${valid ? 'text-on-surface-muted' : 'text-error'}`}>
            {valid ? 'Hex, #rgb or #rrggbb.' : `Not a hex colour. Showing ${lastGood}.`}
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          <span id="tb-product" className="text-label-md text-on-surface-variant">Product preset</span>
          <Select.Root value={product} onValueChange={(v) => v && v !== 'custom' && pickProduct(v)}>
            <Select.Trigger aria-labelledby="tb-product" className="w-44"><Select.Value /></Select.Trigger>
            <Select.Content>
              <Select.Item value="custom">None (custom)</Select.Item>
              {products.map((p) => <Select.Item key={p.id} value={p.id}>{p.label}</Select.Item>)}
            </Select.Content>
          </Select.Root>
        </div>
        <div className="flex flex-col gap-1.5">
          <span id="tb-presets" className="text-label-md text-on-surface-variant">Colour presets</span>
          <div className="flex h-10 flex-wrap items-center gap-1.5" role="group" aria-labelledby="tb-presets">
            {PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setInput(p)}
                aria-label={`Use ${p}`}
                aria-pressed={s === p}
                className="size-8 rounded-full border-2 border-surface outline-offset-2 aria-pressed:outline-2 aria-pressed:outline-on-surface aria-pressed:outline-solid"
                ref={(el) => el?.style.setProperty('background', p)}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <SegmentedControl.Root aria-label="Accent family" value={target} onValueChange={(v) => v && setTarget(v as Target)}>
          <SegmentedControl.Item value="primary">Primary</SegmentedControl.Item>
          <SegmentedControl.Item value="tertiary">Product brand</SegmentedControl.Item>
        </SegmentedControl.Root>
        <SegmentedControl.Root aria-label="Scheme" value={scheme} onValueChange={(v) => v && setScheme(v as Scheme)}>
          <SegmentedControl.Item value="light">Light</SegmentedControl.Item>
          <SegmentedControl.Item value="dark">Dark</SegmentedControl.Item>
        </SegmentedControl.Root>
        <SegmentedControl.Root aria-label="Contrast" value={level} onValueChange={(v) => v && setLevel(v as Level)}>
          {LEVELS.map((l) => <SegmentedControl.Item key={l} value={l}>{cap(l)}</SegmentedControl.Item>)}
        </SegmentedControl.Root>
      </div>

      <Pane scheme={scheme} level={level} vars={vars}>
        <Swatches target={target} roles={roles} />
        <Preview />
      </Pane>

      <section aria-labelledby="tb-contrast">
        <h3 id="tb-contrast">Contrast check</h3>
        <p>
          WCAG 2.2 ratios for the {scheme} theme at {level} contrast, against the real Nexub surfaces. Text pairs need
          4.5:1; the accent needs 4.5:1 on every surface because it is used for text and links.
          {target === 'primary' && ' The inverse accent needs 3:1 on the inverse surface (snackbar actions).'}
        </p>
        <p className="text-body-sm text-on-surface-variant">
          <strong className="text-on-surface">{passed} of {checks.length} pairs pass</strong> here.{' '}
          {all.passed === all.total
            ? `All ${all.total} checks pass across every level and scheme.`
            : `${all.total - all.passed} of ${all.total} checks fail across every level and scheme.`}
        </p>
        <span id="tb-contrast-status" role="status" aria-live="polite" aria-atomic="true" className="sr-only">{said}</span>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th scope="col">Text</th>
                <th scope="col">Background</th>
                <th scope="col">WCAG 2</th>
                {hasApca && <th scope="col">APCA Lc</th>}
                <th scope="col">Needs</th>
                <th scope="col">Result</th>
              </tr>
            </thead>
            <tbody>
              {checks.map((c) => (
                <tr key={c.id}>
                  <td><code>{c.fg}</code> <span className="font-mono text-body-sm text-on-surface-muted">{c.fgHex}</span></td>
                  <td><code>{c.bg}</code> <span className="font-mono text-body-sm text-on-surface-muted">{c.bgHex}</span></td>
                  <td className="whitespace-nowrap tabular-nums">{c.ratio.toFixed(2)}:1</td>
                  {hasApca && <td className="tabular-nums">{c.apca == null ? '—' : c.apca.toFixed(1)}</td>}
                  <td className="tabular-nums">{c.min}:1</td>
                  <td className={`whitespace-nowrap ${c.pass ? 'text-success' : 'text-error'}`}>{c.pass ? '✓ Pass' : '✗ Fail'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="tb-export">
        <h3 id="tb-export">Export</h3>
        <p>
          Every format comes from the <code>@nexub/tokens/seed</code> generators. The CSS carries all three contrast
          levels; Tailwind v4, React Native and the tokens are for the {level} level selected above.
        </p>
        <Tabs.Root defaultValue="css">
          <Tabs.List aria-label="Export format">
            {files.map((f) => <Tabs.Trigger key={f.id} value={f.id}>{f.label}</Tabs.Trigger>)}
          </Tabs.List>
          {files.map((f) => (
            <Tabs.Content key={f.id} value={f.id} className="flex flex-col gap-3">
              <CodeSnippet code={f.code} title={f.filename ?? f.label} scrollLabel={`${f.label} export`} />
              {f.filename && (
                <div>
                  <Button variant="outlined" size="sm" onClick={() => download(f)}>
                    <Download aria-hidden="true" />
                    Download {f.filename}
                  </Button>
                </div>
              )}
            </Tabs.Content>
          ))}
        </Tabs.Root>
      </section>
    </div>
  );
}
