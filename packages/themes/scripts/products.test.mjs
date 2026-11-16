// Division and app themes (10.1): generated files are current, every key in the
// token map has a rule, and the published types list the same keys.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { DIVISIONS, PRODUCT_KEYS } from '../../tokens/scripts/generate.mjs';
import { files } from './build-products.mjs';

const read = (p) => readFileSync(new URL(p, import.meta.url), 'utf8');

test('committed theme files match the token map (run build:products)', () => {
  for (const [name, css] of Object.entries(files())) assert.equal(read(`../src/${name}`), css, name);
});

test('every division and app key has a rule that sets the accent and the tertiary roles', () => {
  const rule = (css, sel) => {
    const block = css.split(/\n(?=\S)/).find((b) => b.split('{')[0].includes(sel) && b.includes('--color-accent-500'));
    assert.ok(block, sel);
    return block;
  };
  for (const d of DIVISIONS) assert.match(rule(read('../src/divisions.css'), `[data-division='${d}']`), /--color-tertiary: light-dark\(#/);
  const products = read('../src/products.css');
  for (const p of PRODUCT_KEYS) rule(products, `[data-product='${p}']`);
  // Aliases are not in roles.css, so products.css carries their tertiary roles.
  for (const a of ['book-hub', 'payhub', 'founder-hub']) assert.ok(products.includes(`[data-product='${a}'] {\n  --color-tertiary`), a);
});

test('only [data-division] / [data-product] selectors: nothing changes for an app that sets neither', () => {
  for (const [name, css] of Object.entries(files())) {
    const selectors = [...css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/@media[^{]*\{/g, '{').matchAll(/([^{}]+)\{/g)].map((m) => m[1].trim()).filter(Boolean);
    for (const s of selectors) assert.match(s, /\[data-(division|product)='/, `${name}: ${s}`);
  }
});

test('@nexub/core DivisionKey / ProductKey list the same keys as the token map', () => {
  const types = read('../../core/src/types.ts');
  const keys = (name) => [...types.match(new RegExp(`${name} = \\[([^\\]]+)\\]`))[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
  assert.deepEqual(keys('DIVISIONS'), DIVISIONS);
  assert.deepEqual(keys('PRODUCT_KEYS').sort(), [...PRODUCT_KEYS].sort());
});

test('package.json exports every generated file', () => {
  const { exports } = JSON.parse(read('../package.json'));
  for (const name of Object.keys(files())) assert.equal(exports[`./${name.replace('.css', '')}`], `./src/${name}`);
});
