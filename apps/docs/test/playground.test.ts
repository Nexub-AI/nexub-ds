// 11.0: the playground and states gallery of every component page are generated
// (scripts/playground.mjs → registry/playground.generated.json + components/docs/playground/<slug>.tsx).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
// @ts-expect-error plain .mjs script, no types
import { buildBase, controlFor, generate, parseUnion, sortControls, statesFor } from '../scripts/playground.mjs';
import { printJsx, type PlaygroundRecipe } from '../src/components/docs/playground-code.ts';

const src = new URL('../src/', import.meta.url);
const recipes: Record<string, PlaygroundRecipe | { skip: string }> = JSON.parse(readFileSync(new URL('registry/playground.generated.json', src), 'utf8'));

test('unions of literals become options; anything else does not', () => {
  assert.deepEqual(parseUnion("'sm' | 'md' | 'lg'"), ['sm', 'md', 'lg']);
  assert.deepEqual(parseUnion("false | true | 'auto'"), [false, true, 'auto']);
  assert.deepEqual(parseUnion('1 | 2 | 3'), [1, 2, 3]);
  assert.equal(parseUnion('string | number'), null);
  assert.equal(parseUnion('string'), null);
});

test('props map to the right control, with the default from the types', () => {
  assert.deepEqual(controlFor({ name: 'size', type: "'sm' | 'md'", default: "'md'" }), { kind: 'select', name: 'size', options: ['sm', 'md'], default: 'md' });
  assert.deepEqual(controlFor({ name: 'loading', type: 'boolean' }), { kind: 'switch', name: 'loading' });
  assert.deepEqual(controlFor({ name: 'step', type: 'number', default: '1' }), { kind: 'number', name: 'step', default: 1 });
  assert.deepEqual(controlFor({ name: 'label', type: 'string' }), { kind: 'text', name: 'label' });
});

test('props a form field cannot drive are skipped', () => {
  const skipped = [
    { name: 'onValueChange', type: '((value: number) => void)' },
    { name: 'leadingIcon', type: 'React.ReactNode' },
    { name: 'items', type: 'string[]' },
    { name: 'className', type: 'string' },
    { name: 'style', type: 'React.CSSProperties' },
    { name: 'aria-label', type: 'string' },
    { name: 'asChild', type: 'boolean' },
    { name: 'src', type: 'string' }, // a string that is not copy, and the example does not set it
    { name: 'old', type: 'boolean', deprecated: true },
  ];
  for (const p of skipped) assert.equal(controlFor(p), null, p.name);
  assert.deepEqual(controlFor({ name: 'src', type: 'string' }, true), { kind: 'text', name: 'src' });
});

test('controls and states come out in a stable order', () => {
  const names = (cs: { name: string }[]) => cs.map((c) => c.name);
  const controls = [{ kind: 'number', name: 'max' }, { kind: 'switch', name: 'loading' }, { kind: 'select', name: 'size' }, { kind: 'select', name: 'align' }, { kind: 'select', name: 'variant' }];
  assert.deepEqual(names(sortControls(controls)), ['variant', 'size', 'align', 'loading', 'max']);
  assert.deepEqual(names(sortControls([...controls].reverse())), ['variant', 'size', 'align', 'loading', 'max']);
  const cells = statesFor({ variant: "'a' | 'b'", size: "'sm' | 'md'", disabled: 'boolean', checked: 'string', loading: 'boolean' });
  assert.deepEqual(cells.map((c: { prop: string; value: unknown }) => `${c.prop}=${c.value}`), ['disabled=true', 'loading=true', 'size=sm', 'size=md', 'variant=a', 'variant=b']);
  const many = statesFor({ variant: Array.from({ length: 12 }, (_, i) => `'v${i}'`).join(' | '), tone: Array.from({ length: 30 }, (_, i) => `'t${i}'`).join(' | ') });
  assert.equal(many.length, 16); // each capped at 8
});

test('the base module is the example element with the props spread on it', () => {
  const source = `'use client';\nimport { Badge, Stack } from '@nexub/react';\nexport default function Example() {\n  return <Stack><Badge id="a" tone="info">New</Badge><Badge>Old</Badge></Stack>;\n}\n`;
  const built = buildBase(source, ['badge', 'badgeroot'], 'badge');
  assert.equal(built.tag, 'Badge');
  assert.equal(built.children, 'text');
  assert.match(built.module, /<Badge id=\{pgId \+ "a"\} tone="info" \{\.\.\.pg\}>\{\(pg\.children as string\) \?\? "New"\}<\/Badge>/);
  assert.doesNotMatch(built.module, /Stack|Old/); // only the element, and only the imports it needs
  assert.equal(buildBase(source, ['avatar'], 'avatar'), null);
});

test('the JSX printer shows only what differs from the defaults', () => {
  const recipe: PlaygroundRecipe = {
    tag: 'Button',
    children: 'text',
    fixed: ['onClick={save}'],
    controls: [
      { kind: 'select', name: 'size', options: ['sm', 'md'], default: 'md' },
      { kind: 'select', name: 'variant', options: ['filled', 'outlined'], default: 'filled', initial: 'outlined' },
      { kind: 'switch', name: 'loading' },
      { kind: 'switch', name: 'animated', default: true },
      { kind: 'number', name: 'max' },
      { kind: 'text', name: 'label' },
      { kind: 'text', name: 'children', initial: 'Save' },
    ],
    states: [],
  };
  assert.equal(printJsx(recipe, {}), '<Button onClick={save} variant="outlined">Save</Button>');
  assert.equal(
    printJsx(recipe, { size: 'sm', variant: 'filled', loading: true, animated: false, max: 3, label: 'Say "hi"', children: 'Go' }),
    '<Button onClick={save} size="sm" loading animated={false} max={3} label={"Say \\"hi\\""}>Go</Button>',
  );
  assert.equal(printJsx({ ...recipe, children: 'none', fixed: [], controls: [] }, {}), '<Button />');
  assert.equal(printJsx({ ...recipe, tag: 'Tabs.Root', children: 'nodes', fixed: [], controls: [] }, {}), '<Tabs.Root>…</Tabs.Root>');
});

test('the generated files are up to date and the generator is deterministic', async () => {
  const [a, b] = [await generate(), await generate()];
  assert.equal(a.json, b.json);
  assert.equal(a.json, readFileSync(new URL('registry/playground.generated.json', src), 'utf8'), 'run `node apps/docs/scripts/playground.mjs`');
});

// Pages without a playground or states gallery. A new component must either get a
// base module from its first example or be added here with the reason the generator gives.
const NO_PLAYGROUND = [
  'action-bar', 'alert-dialog', 'app-shell', 'aspect-ratio', 'aurora', 'box', 'breadcrumb', 'check-list', 'combobox',
  'context-menu', 'dropdown-menu', 'filter-builder', 'form', 'form-field', 'keyboard-shortcut', 'menubar', 'motion-reveal',
  'navigation-menu', 'navigation-rail', 'plan-tracker', 'scroll-progress', 'shared-element', 'streaming-text', 'toast',
];

test('every component has a playground base module or is on the explicit list', () => {
  const slugs = readdirSync(new URL('registry/components/', src)).map((f) => f.replace(/\.ts$/, '')).sort();
  assert.deepEqual(Object.keys(recipes).sort(), slugs);
  const skipped = slugs.filter((s) => 'skip' in recipes[s]!);
  assert.deepEqual(skipped, NO_PLAYGROUND);
  for (const slug of slugs) {
    const has = existsSync(new URL(`components/docs/playground/${slug}.tsx`, src));
    assert.equal(has, !skipped.includes(slug), slug);
  }
  assert.deepEqual(readdirSync(new URL('components/docs/playground/', src)).length, slugs.length - skipped.length);
});
