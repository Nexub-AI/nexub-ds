// signature.css must be opt-in: every rule is scoped to data-style="signature",
// so an app that never sets it is unchanged (core.css imports it).
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';

const read = (f) => readFileSync(new URL(`../src/${f}`, import.meta.url), 'utf8');
const css = read('signature.css').replace(/\/\*[\s\S]*?\*\//g, '');

test('every selector is scoped to data-style="signature"', () => {
  const selectors = [...css.matchAll(/([^{}@]+)\{/g)].map((m) => m[1].trim()).filter(Boolean);
  assert.ok(selectors.length >= 3);
  for (const group of selectors)
    for (const sel of group.split(/,(?![^(]*\))/)) assert.match(sel.trim(), /\[data-style='signature'\]/, sel.trim());
});

test('core.css imports it after the generated roles', () => {
  const core = read('core.css');
  assert.ok(core.indexOf("@import './signature.css'") > core.indexOf("@import '@nexub/tokens/css/roles'"));
});
