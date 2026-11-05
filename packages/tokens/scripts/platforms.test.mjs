// Swift and Compose outputs carry the same values as @nexub/tokens/native, use
// valid identifiers, and match what the build wrote to dist/.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { compose, ident, swift } from './platforms.mjs';

const root = new URL('..', import.meta.url).pathname;
const src = readFileSync(`${root}src/generated/native.ts`, 'utf8');
const native = JSON.parse(src.slice(src.indexOf('{'), src.lastIndexOf('}') + 1));

test('identifiers', () => {
  assert.equal(ident('space', '0-5'), 'space0_5');
  assert.equal(ident('radius', '2xl'), 'radius2xl');
  assert.equal(ident('type', 'body-md'), 'typeBodyMd');
  // Top-level token names (the `object NexubTokens` members, not the data-class fields).
  const names = [...compose(native).matchAll(/^ {4}val ([^\s:=]+) =/gm)].map((m) => m[1]);
  assert.ok(names.length > 60, `${names.length} names`);
  for (const n of names) assert.match(n, /^[A-Za-z_][A-Za-z0-9_]*$/, n);
  assert.equal(new Set(names).size, names.length, 'no duplicate names');
});

test('values match the native tokens', () => {
  const primary = native.color.roles.standard.light.primary.slice(1).toUpperCase();
  assert.match(compose(native), new RegExp(`val light = NexubColors\\(primary = Color\\(0xFF${primary}\\)`));
  assert.match(compose(native), /val darkHighContrast = NexubColors\(/);
  assert.match(compose(native), new RegExp(`val space4 = ${native.spacing['4']}\\.dp`));
  assert.match(swift(native), new RegExp(`static let typeBodyMd = TypeStyle\\(size: ${native.type['body-md'].size},`));
  for (const m of compose(native).matchAll(/Color\(0xFF([0-9A-F]+)\)/g)) assert.equal(m[1].length, 6);
});

test('dist is current (run the tokens build)', () => {
  assert.equal(readFileSync(`${root}dist/swift/NexubTokens.swift`, 'utf8'), swift(native));
  assert.equal(readFileSync(`${root}dist/compose/NexubTokens.kt`, 'utf8'), compose(native));
});
