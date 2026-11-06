// @nexub/themes/vivid must be opt-in: every rule is scoped to
// data-expression="vivid", so an app that never sets it is unchanged.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/vivid.css', import.meta.url), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/@media[^{]*\{/g, '{'); // keep the rules inside @media, drop the at-rule header

test('every selector is scoped to data-expression="vivid"', () => {
  const selectors = [...css.matchAll(/([^{}@]+)\{/g)].map((m) => m[1].trim()).filter((s) => s && !s.startsWith('@'));
  assert.ok(selectors.length > 5);
  for (const group of selectors)
    for (const sel of group.split(/,(?![^(]*\))/)) assert.match(sel.trim(), /\[data-expression='vivid'\]/, sel.trim());
});

test('colours come from roles, never hex', () => {
  assert.doesNotMatch(css, /#[0-9a-f]{3,8}\b/i);
});
