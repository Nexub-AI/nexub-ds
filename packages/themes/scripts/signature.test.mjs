// signature.css: Signature is the only style since 9.0 (classic removed).
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync, readdirSync } from 'node:fs';

const read = (f) => readFileSync(new URL(`../src/${f}`, import.meta.url), 'utf8');

test('no style switch is left: nothing reads data-style', () => {
  for (const f of readdirSync(new URL('../src/', import.meta.url)).filter((f) => f.endsWith('.css')))
    assert.doesNotMatch(read(f), /data-style/, f);
});

test('core.css imports it after the generated roles', () => {
  const core = read('core.css');
  assert.ok(core.indexOf("@import './signature.css'") > core.indexOf("@import '@nexub/tokens/css/roles'"));
});
