// The brand builder (/foundations/theme-builder): contrast pairs, the live summary and
// the exports, against the published @nexub/tokens files (build the tokens first).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  apca,
  buildExports,
  checkAll,
  checkPairs,
  longHex,
  pickNeutrals,
  summary,
  SURFACE_ROLES,
} from '../src/lib/brand-builder.ts';
import { contrastRatio, createSeedRoles, createSeedStylesheet, createSeedThemeCss, createSeedTokens } from '@nexub/tokens/seed';

const dist = new URL('../../../packages/tokens/dist/', import.meta.url);
const { native } = await import(new URL('js/native.js', dist).href);
const neutrals = pickNeutrals(native.color.roles);

test('neutrals are the built surfaces, nothing else', () => {
  assert.equal(neutrals.standard.light.surface, native.color.roles.standard.light.surface);
  assert.equal(neutrals.high.dark['inverse-surface'], native.color.roles.high.dark['inverse-surface']);
  assert.equal(Object.keys(neutrals.medium.dark).length, SURFACE_ROLES.length + 1);
  assert.ok(JSON.stringify(neutrals).length < 4000, 'the client prop stays small');
});

test('pairs follow the seed tests: on-accent, on-container, accent on every surface, inverse', () => {
  const primary = checkPairs('#e4572e', 'primary', 'standard', 'light', neutrals);
  assert.deepEqual(primary.map((c) => c.id), [
    'on-primary/primary',
    'on-primary-container/primary-container',
    ...SURFACE_ROLES.map((s) => `primary/${s}`),
    'inverse-primary/inverse-surface',
  ]);
  assert.equal(primary.at(-1)!.min, 3);
  const tertiary = checkPairs('#e4572e', 'tertiary', 'high', 'dark', neutrals);
  assert.equal(tertiary.length, 2 + SURFACE_ROLES.length);
  assert.ok(tertiary.every((c) => c.min === 4.5 && !c.id.includes('inverse')));
});

test('ratios are the seed roles against the built surfaces', () => {
  const roles = createSeedRoles('#0f9d58', { contrast: 'medium' }).dark;
  const [onAccent, , onSurface] = checkPairs('#0f9d58', 'primary', 'medium', 'dark', neutrals);
  assert.equal(onAccent!.ratio, contrastRatio(roles['on-primary']!, roles.primary!));
  assert.equal(onSurface!.ratio, contrastRatio(roles.primary!, native.color.roles.medium.dark.surface));
  assert.equal(onAccent!.pass, onAccent!.ratio >= 4.5);
});

test('seeds across the wheel pass every pair at every level and scheme', () => {
  for (const seed of ['#e4572e', '#ffeb3b', '#00e5ff', '#808080', '#0a0a0a', '#fafafa', '#7b1fa2'])
    for (const target of ['primary', 'tertiary'] as const) {
      const all = checkAll(seed, target, neutrals);
      assert.equal(all.total, 6 * (target === 'primary' ? 12 : 11));
      assert.deepEqual(all.failures.map((f) => `${seed} ${f.level}/${f.scheme} ${f.id}`), []);
    }
});

test('the live summary is one sentence per state, short #rgb expanded', () => {
  const checks = checkPairs('#f80', 'primary', 'standard', 'light', neutrals);
  const text = summary('#f80', 'light', 'standard', checks, checkAll('#f80', 'primary', neutrals));
  assert.match(text, /^#ff8800, light, standard contrast: 12 of 12 pairs pass WCAG 2\. All 72 checks pass/);
  assert.match(
    summary('#f80', 'dark', 'high', checks, { total: 72, passed: 70 }),
    /2 of 72 checks fail across every level and scheme\.$/,
  );
});

test('APCA slot: null until wired, then the seed entry’s value on every pair', async (t) => {
  const seed: Record<string, unknown> = await import('@nexub/tokens/seed');
  const checks = checkPairs('#e4572e', 'primary', 'standard', 'light', neutrals);
  if (apca('#000000', '#ffffff') === null) {
    // Not a failure, so the parallel APCA PR can merge first: a reminder in the test output.
    if (typeof seed.apcaContrast === 'function')
      t.todo('apcaContrast is in @nexub/tokens/seed: return it from apca() in src/lib/brand-builder.ts');
    assert.ok(checks.every((c) => c.apca === null));
    return;
  }
  const apcaContrast = seed.apcaContrast as (fg: string, bg: string) => number;
  for (const c of checks) assert.equal(c.apca, apcaContrast(c.fgHex, c.bgHex));
});

test('exports are the @nexub/tokens/seed generators, not copies', () => {
  const files = Object.fromEntries(buildExports('#E4572E', 'tertiary', 'medium').map((f) => [f.id, f]));
  assert.equal(files.css!.code, createSeedStylesheet('#e4572e', { target: 'tertiary' }));
  assert.ok(files.tailwind!.code.endsWith(createSeedThemeCss('#e4572e', { selector: '@theme', target: 'tertiary', contrast: 'medium' })));
  assert.match(files.tailwind!.code, /\n@theme \{\n {2}--color-tertiary: light-dark\(#[0-9a-f]{6}, #[0-9a-f]{6}\);/);
  assert.ok(files.native!.code.includes(JSON.stringify(createSeedRoles('#e4572e', { target: 'tertiary', contrast: 'medium' }), null, 2)));
  assert.match(files.native!.code, /seedTarget="tertiary"/);
  assert.deepEqual(JSON.parse(files.json!.code), createSeedTokens('#e4572e', { target: 'tertiary', contrast: 'medium' }));
  assert.match(files.react!.code, /<ThemeProvider seed="#e4572e" seedTarget="tertiary">/);
  assert.equal(files.react!.filename, undefined);
  for (const id of ['css', 'tailwind', 'native', 'json']) assert.match(files[id]!.filename!, /^nexub-brand\./);
});

test('longHex', () => {
  assert.equal(longHex('#F80'), '#ff8800');
  assert.equal(longHex('#0059C8'), '#0059c8');
});

test('the page builds its neutrals from @nexub/tokens/native and has no streamed boundary', () => {
  const page = readFileSync(new URL('../src/app/(docs)/foundations/theme-builder/page.tsx', import.meta.url), 'utf8');
  assert.match(page, /pickNeutrals\(native\.color\.roles\)/);
  const client = readFileSync(new URL('../src/app/(docs)/foundations/theme-builder/ThemeBuilder.tsx', import.meta.url), 'utf8');
  // #815/#817: no Suspense or lazy import around the builder (an empty streamed placeholder shifts the page).
  assert.doesNotMatch(page + client, /<(React\.)?Suspense\b|\blazy\(|from 'next\/dynamic'/);
  // Live results are polite and debounced, not announced on every keystroke.
  assert.match(client, /role="status"/);
  assert.doesNotMatch(client, /role="alert"/);
});
