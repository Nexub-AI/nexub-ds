// signature.css: Signature is the default (8.0), data-style="classic" opts out.
// Every descendant rule must exclude classic subtrees, so classic stays 7.x.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';

const read = (f) => readFileSync(new URL(`../src/${f}`, import.meta.url), 'utf8');
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '');
const selectors = (css) =>
  [...strip(css).matchAll(/([^{};@]+)\{/g)].flatMap((m) => m[1].split(/,(?![^(]*\))/).map((s) => s.trim())).filter(Boolean);
const SKIPS_CLASSIC = /:not\(\[data-style='classic'\] \*\)|\[data-style='classic'\] \[data-style='signature'\]/;

test('signature.css: descendant rules skip classic subtrees (or re-opt-in with data-style="signature")', () => {
  const sels = selectors(read('signature.css'));
  assert.ok(sels.length >= 4);
  for (const sel of sels) {
    if (sel === ':root' || sel.startsWith(':not(:root)')) continue; // custom properties only
    assert.match(sel, SKIPS_CLASSIC, sel);
  }
});

test('core.css: Signature Switch rules skip classic subtrees too', () => {
  const sw = selectors(read('core.css')).filter((s) => /nx-switch/.test(s));
  assert.ok(sw.length >= 6, 'Signature switch rules present');
  for (const sel of sw) assert.match(sel, SKIPS_CLASSIC, sel);
});

test('core.css imports it after the generated roles', () => {
  const core = read('core.css');
  assert.ok(core.indexOf("@import './signature.css'") > core.indexOf("@import '@nexub/tokens/css/roles'"));
});
