// The Figma variables must match the code: same values as @nexub/tokens/native,
// every colour mode has the same variables, and the built files are current.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync, readdirSync } from 'node:fs';
import { figmaFiles } from './figma.mjs';

const root = new URL('..', import.meta.url).pathname;
const src = readFileSync(`${root}src/generated/native.ts`, 'utf8');
const native = JSON.parse(src.slice(src.indexOf('{'), src.lastIndexOf('}') + 1));
const files = figmaFiles(native);
const paths = (o, p = '') =>
  Object.entries(o).flatMap(([k, v]) => ('$value' in v ? [`${p}${k}`] : paths(v, `${p}${k}/`)));

test('six colour modes with identical variables, plus primitives', () => {
  const colour = Object.keys(files).filter((f) => f.startsWith('color.'));
  assert.equal(colour.length, 6);
  const first = paths(files[colour[0]]).join();
  for (const f of colour) assert.equal(paths(files[f]).join(), first, f);
  assert.ok(files['primitives.tokens.json']);
});

test('values are the resolved code values', () => {
  assert.equal(files['color.light.standard.tokens.json'].role.primary.$value, native.color.roles.standard.light.primary);
  assert.equal(files['color.dark.high.tokens.json'].product.payub.tertiary.$value, native.color.products.payub.high.dark.tertiary);
  assert.deepEqual(files['primitives.tokens.json'].type['body-md'].size, { $type: 'number', $value: native.type['body-md'].size });
});

test('dist/figma is current (run the tokens build)', () => {
  const dir = `${root}dist/figma/`;
  assert.deepEqual(readdirSync(dir).sort(), Object.keys(files).sort());
  for (const [name, doc] of Object.entries(files)) assert.equal(readFileSync(dir + name, 'utf8'), JSON.stringify(doc, null, 2) + '\n', name);
});
