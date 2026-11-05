'use client';

// Pick one brand colour, get the full accent family for light, dark and every
// contrast level, check the WCAG pairs against the real surfaces, and export it.
// All colour maths is @nexub/tokens/seed, the same code <ThemeProvider seed>
// uses, so what you see here is what ships.
import * as React from 'react';
import {
  contrastRatio,
  createSeedRoles,
  createSeedStylesheet,
  createSeedTheme,
  createSeedTokens,
} from '@nexub/tokens/seed';
import { Badge, Button, Checkbox, Input, Progress, SegmentedControl, Switch, Tabs } from '@nexub/react';
import { CopyButton } from '@/components/docs/CopyButton';

type Target = 'primary' | 'tertiary';
type Level = 'standard' | 'medium' | 'high';
const LEVELS: Level[] = ['standard', 'medium', 'high'];
const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;
const PRESETS = ['#0059c8', '#e4572e', '#0f9d58', '#7b1fa2', '#ffb300', '#00897b'];

/** Expands #rgb to #rrggbb so <input type="color"> accepts it. */
const long = (hex: string) =>
  (hex.length === 4 ? `#${[...hex.slice(1)].map((c) => c + c).join('')}` : hex).toLowerCase();

/** Resolved background of an element as #rrggbb (the browser resolves light-dark()). */
function bgHex(el: Element | null): string | null {
  if (!el) return null;
  const m = getComputedStyle(el).backgroundColor.match(/\d+(\.\d+)?/g);
  if (!m || m.length < 3) return null;
  return `#${m.slice(0, 3).map((n) => Math.round(Number(n)).toString(16).padStart(2, '0')).join('')}`;
}

/** A themed pane. Seeded variables go in through CSSOM, not a style attribute. */
function Pane({ scheme, level, vars, onSurface, children }: {
  scheme: 'light' | 'dark';
  level: Level;
  vars: Record<string, string>;
  onSurface: (hex: string | null) => void;
  children: React.ReactNode;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    for (const [k, v] of Object.entries(vars)) el.style.setProperty(k, v);
    onSurface(bgHex(el));
    return () => {
      for (const k of Object.keys(vars)) el.style.removeProperty(k);
    };
  }, [vars, scheme, level, onSurface]);
  return (
    <div
      ref={ref}
      data-theme={scheme}
      data-contrast={level}
      data-theme-builder-pane=""
      className="flex flex-col gap-4 rounded-2xl border border-[var(--color-outline-variant)] bg-[var(--color-surface)] p-5 text-[var(--color-on-surface)]"
    >
      <p className="text-label-md text-[var(--color-on-surface-variant)]">{scheme === 'light' ? 'Light' : 'Dark'}</p>
      {children}
    </div>
  );
}

function Preview({ target }: { target: Target }) {
  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button>Save changes</Button>
        <Button variant="tonal">Preview</Button>
        <Button variant="outlined">Cancel</Button>
      </div>
      <Input aria-label="Workspace name" placeholder="Workspace name" />
      <div className="flex flex-wrap items-center gap-4">
        <Switch aria-label="Notifications" defaultChecked />
        <Checkbox aria-label="Remember me" defaultChecked />
        {target === 'tertiary' ? <Badge variant="soft" tone="founderub">Brand</Badge> : <Badge>New</Badge>}
      </div>
      <Progress value={64} aria-label="Setup progress" />
    </>
  );
}

function Ratio({ r, min }: { r: number; min: number }) {
  const pass = r >= min;
  return (
    <td className="tabular-nums">
      {r.toFixed(2)}{' '}
      <span className={pass ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'}>{pass ? '✓' : `✗ below ${min}`}</span>
    </td>
  );
}

export function ThemeBuilder() {
  const [input, setInput] = React.useState('#e4572e');
  const [target, setTarget] = React.useState<Target>('primary');
  const [level, setLevel] = React.useState<Level>('standard');
  const [surfaces, setSurfaces] = React.useState<{ light: string | null; dark: string | null }>({ light: null, dark: null });
  const [lastGood, setLastGood] = React.useState('#e4572e');
  const valid = HEX.test(input);
  if (valid && input !== lastGood) setLastGood(input);
  const s = valid ? input : lastGood;

  const vars = React.useMemo(() => createSeedTheme(s, { target, contrast: level }), [s, target, level]);
  const onLight = React.useCallback((hex: string | null) => setSurfaces((p) => (p.light === hex ? p : { ...p, light: hex })), []);
  const onDark = React.useCallback((hex: string | null) => setSurfaces((p) => (p.dark === hex ? p : { ...p, dark: hex })), []);

  const a = target;
  const rows = LEVELS.flatMap((lvl) => {
    const roles = createSeedRoles(s, { target, contrast: lvl });
    return (['light', 'dark'] as const).map((scheme) => {
      const r = roles[scheme];
      const surface = lvl === level ? surfaces[scheme] : null;
      return {
        lvl,
        scheme,
        on: contrastRatio(r[`on-${a}`]!, r[a]!),
        container: contrastRatio(r[`on-${a}-container`]!, r[`${a}-container`]!),
        surface: surface ? contrastRatio(r[a]!, surface) : null,
      };
    });
  });

  const opt = target === 'tertiary' ? ", { target: 'tertiary' }" : '';
  const exports = [
    ['css', 'CSS', createSeedStylesheet(s, { target })],
    ['react', 'React', `<ThemeProvider seed="${s}"${target === 'tertiary' ? ' seedTarget="tertiary"' : ''}>
  <App />
</ThemeProvider>

// No flash on first paint: also render the stylesheet on the server.
import { createSeedStylesheet } from '@nexub/tokens/seed';
<style>{createSeedStylesheet('${s}'${opt})}</style>`],
    ['native', 'React Native', `import { NexubNativeProvider } from '@nexub/react-native';

<NexubNativeProvider seed="${s}"${target === 'tertiary' ? ' seedTarget="tertiary"' : ''}>
  <App />
</NexubNativeProvider>`],
    ['json', 'Tokens (DTCG)', JSON.stringify(createSeedTokens(s, { target, contrast: level }), null, 2)],
  ] as const;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1.5">
          <span id="tb-colour" className="text-label-md text-[var(--color-on-surface-variant)]">Brand colour</span>
          <span className="flex items-center gap-2">
            <input
              type="color"
              value={long(s)}
              onChange={(e) => setInput(e.target.value)}
              aria-label="Pick brand colour"
              className="size-10 cursor-pointer rounded-lg border border-[var(--color-outline-variant)] bg-transparent p-0.5"
            />
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value.trim())}
              aria-labelledby="tb-colour"
              aria-invalid={!valid}
              className="w-32 font-mono"
            />
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Presets">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setInput(p)}
              aria-label={`Use ${p}`}
              aria-pressed={s.toLowerCase() === p}
              className="size-8 rounded-full border-2 border-[var(--color-surface)] outline-offset-2 aria-pressed:outline-2 aria-pressed:outline-[var(--color-on-surface)] aria-pressed:outline-solid"
              ref={(el) => el?.style.setProperty('background', p)}
            />
          ))}
        </div>
        <SegmentedControl.Root aria-label="Accent family" value={target} onValueChange={(v) => v && setTarget(v as Target)}>
          <SegmentedControl.Item value="primary">Primary</SegmentedControl.Item>
          <SegmentedControl.Item value="tertiary">Product brand</SegmentedControl.Item>
        </SegmentedControl.Root>
        <SegmentedControl.Root aria-label="Contrast" value={level} onValueChange={(v) => v && setLevel(v as Level)}>
          {LEVELS.map((l) => (
            <SegmentedControl.Item key={l} value={l}>{l[0]!.toUpperCase() + l.slice(1)}</SegmentedControl.Item>
          ))}
        </SegmentedControl.Root>
      </div>
      {!valid && (
        <p role="alert" className="text-body-sm text-[var(--color-error)]">
          Enter a hex colour such as #e4572e. Showing the last valid one.
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Pane scheme="light" level={level} vars={vars} onSurface={onLight}><Preview target={target} /></Pane>
        <Pane scheme="dark" level={level} vars={vars} onSurface={onDark}><Preview target={target} /></Pane>
      </div>

      <section aria-labelledby="tb-contrast">
        <h3 id="tb-contrast">Contrast check</h3>
        <p>
          WCAG 2.2 ratios for every contrast level and scheme. Text pairs need 4.5:1. The accent on the surface needs
          4.5:1 too, because it is used for text and links; it is measured against the surface in the preview above, so
          it shows for the selected level.
        </p>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th scope="col">Contrast</th>
                <th scope="col">Scheme</th>
                <th scope="col">on-{a} on {a}</th>
                <th scope="col">on-{a}-container on {a}-container</th>
                <th scope="col">{a} on surface</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={`${r.lvl}-${r.scheme}`}>
                  <td>{r.lvl}</td>
                  <td>{r.scheme}</td>
                  <Ratio r={r.on} min={4.5} />
                  <Ratio r={r.container} min={4.5} />
                  {r.surface == null ? <td>—</td> : <Ratio r={r.surface} min={4.5} />}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="tb-export">
        <h3 id="tb-export">Export</h3>
        <Tabs.Root defaultValue="css">
          <Tabs.List aria-label="Export format">
            {exports.map(([k, label]) => <Tabs.Trigger key={k} value={k}>{label}</Tabs.Trigger>)}
          </Tabs.List>
          {exports.map(([k, , code]) => (
            <Tabs.Content key={k} value={k}>
              <div className="relative">
                <div className="absolute end-2 top-2"><CopyButton text={code} /></div>
                <pre className="max-h-80 overflow-auto"><code>{code}</code></pre>
              </div>
            </Tabs.Content>
          ))}
        </Tabs.Root>
      </section>
    </div>
  );
}
