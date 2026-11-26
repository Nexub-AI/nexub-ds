import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { needsPart, render, splitCore, triggersOf } from './build-parts.mjs';

const SRC = fileURLToPath(new URL('../src/', import.meta.url));
const core = readFileSync(SRC + 'core.css', 'utf8');
const GENERATED = /^\/\* GENERATED[\s\S]*?\*\/\n/;

test('the generated files are up to date (run `pnpm --filter @nexub/themes build:parts`)', () => {
  const files = render(core);
  for (const [path, contents] of Object.entries(files)) {
    assert.equal(readFileSync(SRC + path, 'utf8'), contents, `src/${path} is stale`);
  }
  const onDisk = readdirSync(SRC + 'parts').sort();
  assert.deepEqual(
    onDisk,
    Object.keys(files)
      .filter((p) => p.startsWith('parts/'))
      .map((p) => p.slice(6))
      .sort(),
  );
});

test('core-lean plus every part, in order, is core.css rule for rule', () => {
  const files = render(core);
  const { order } = JSON.parse(files['parts/index.json']);
  const joined = [files['core-lean.css'], ...order.map((n) => files[`parts/${n}.css`])]
    .map((f) => f.replace(GENERATED, ''))
    .join('\n');
  const rules = (s) =>
    s
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
  assert.deepEqual(rules(joined), rules(core));
});

test('core-lean keeps the global layer and no component part', () => {
  const lean = render(core)['core-lean.css'];
  for (const keep of [
    '@import',
    '.nx-state-layer',
    '.nx-motion',
    '[data-density',
    '--app-header-height',
    '.nx-hit',
  ]) {
    assert.ok(lean.includes(keep), `core-lean lost ${keep}`);
  }
  for (const part of [
    '.nx-aurora',
    '[data-vaul-drawer]',
    '.nx-celebrate',
    '.nx-sheen',
    'data-nx-sheet',
  ]) {
    assert.ok(!lean.includes(part), `core-lean still has ${part}`);
  }
});

test('every part has at least one trigger', () => {
  const { triggers } = JSON.parse(render(core)['parts/index.json']);
  for (const [name, list] of Object.entries(triggers))
    assert.ok(list.length > 0, `part ${name} has no trigger`);
  assert.ok(needsPart(triggers.aurora, 'cn("nx-aurora")'));
  assert.ok(needsPart(triggers.drawer, '"data-vaul-drawer"'));
  assert.ok(needsPart(triggers.marquee, 'animate-[logo-scroll_40s_linear_infinite]'));
  // The state layer alone (every Button) doesn't pull in the sheen part.
  assert.ok(!needsPart(triggers.sheen, 'className: "nx-state-layer"'));
  assert.ok(needsPart(triggers.sheen, '"nx-state-layer nx-sheen"'));
});

test('splitCore rejects broken markers', () => {
  assert.throws(() => splitCore('/*@part a*/\nx\n'), /never closed/);
  assert.throws(() => splitCore('/*@end*/\n'), /without @part/);
  assert.throws(() => splitCore('/*@part a*/\n/*@part b*/\n'), /inside/);
});

test('triggersOf: one set per selector, keyframe names, no generic attributes', () => {
  assert.deepEqual(
    triggersOf(
      '@keyframes k { from { a: b } to { c: d } } .nx-x[data-state="open"], .nx-a .nx-b, [data-nx-y] { e: f }',
    ),
    [['data-nx-y'], ['k'], ['nx-a', 'nx-b'], ['nx-x']],
  );
  // A keyframe the part's own rules use is not a trigger (it may share a name with a global class).
  assert.deepEqual(
    triggersOf('@keyframes nx-pop { from { scale: 0 } } .nx-y { animation: nx-pop 1s both; }'),
    [['nx-y']],
  );
});

test('needsPart matches whole names only', () => {
  assert.equal(needsPart([['nx-tick']], '"nx-ticker"'), false);
  assert.equal(needsPart([['nx-tick']], 'cn("nx-tick", x)'), true);
});
