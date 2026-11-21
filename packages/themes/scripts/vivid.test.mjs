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

// 11.1 (platform gap #1): data-expression="calm" on a wrapper inside a vivid page opts that
// area back out, so every component rule stops at the nearest expression.
test('every component rule stops at a nested non-vivid expression', () => {
  const CALM = ":not([data-expression='vivid'] [data-expression]:not([data-expression='vivid']) *)";
  const rules = [...css.matchAll(/([^{}@]+)\{/g)].map((m) => m[1].trim()).filter((s) => s && !s.startsWith('@'));
  // Custom-property blocks on the vivid element itself (and the contrast variants) are not component rules.
  const componentRules = rules.filter((s) => /^\[data-expression='vivid'\] \S/.test(s) && !/^\[data-expression='vivid'\] \[data-expression\]:not/.test(s));
  assert.ok(componentRules.length >= 15);
  for (const sel of componentRules) assert.ok(sel.includes(CALM), sel);
});

test('a calm area clears the fallback-read vivid tokens', () => {
  const block = /\[data-expression='vivid'\] \[data-expression\]:not\(\[data-expression='vivid'\]\)\s*\{([^}]*)\}/.exec(css)?.[1] ?? '';
  for (const token of ['--page-title-weight', '--nav-active-bg', '--row-hover', '--nx-chart-fade']) assert.match(block, new RegExp(`${token}: initial`));
});
