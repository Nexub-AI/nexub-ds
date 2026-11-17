import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROLES, tertiary } from './generate.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const component = JSON.parse(readFileSync(join(root, 'tokens/component/component.json'), 'utf8'));
const shape = JSON.parse(readFileSync(join(root, 'tokens/shape.json'), 'utf8')).shape;
const reactSrc = join(root, '../react/src');

// { button: { 'filled-bg': token } } → [['button-filled-bg', token], …]
const entries = Object.entries(component)
  .filter(([k]) => !k.startsWith('$'))
  .flatMap(([comp, group]) =>
    Object.entries(group)
      .filter(([k]) => !k.startsWith('$'))
      .map(([name, token]) => [`${comp}-${name}`, token]),
  );

const source = readdirSync(reactSrc, { recursive: true })
  .filter((f) => f.endsWith('.ts') || f.endsWith('.tsx'))
  .filter((f) => !/\.(test|stories)\.tsx?$/.test(f))
  .map((f) => readFileSync(join(reactSrc, f), 'utf8'))
  .join('\n');

test('every component token aliases a real semantic token', () => {
  const roles = new Set([...Object.keys(ROLES), ...Object.keys(tertiary('primary'))]);
  for (const [name, token] of entries) {
    // A default with no semantic token behind it is a literal (table-head-bg, avatar-radius).
    if (/^(transparent|\d+px)$/.test(token.$value)) continue;
    const [, ns, key] = token.$value.match(/^\{(color|shape)\.([\w-]+)\}$/) ?? [];
    assert.ok(ns === 'color' ? roles.has(key) : ns === 'shape' && key in shape, `${name}: ${token.$value}`);
  }
});

test('components read each token with the documented fallback', () => {
  for (const [name, token] of entries) {
    // Tailwind arbitrary values write spaces as underscores.
    const css = token.$extensions['dev.nexub'].css.replaceAll(' ', '_');
    assert.ok(source.includes(`var(--${name},${css})`), `--${name} not read as var(--${name},${css})`);
  }
});

test('components read no undocumented component token', () => {
  const documented = new Set(entries.map(([n]) => n));
  const used = new Set([...source.matchAll(/var\(--((?:button|field|card|badge|dialog|popover|menu|tooltip|toast|tabs|avatar|alert|nav)-[\w-]+),/g)].map((m) => m[1]));
  // Density knobs ([data-density] in @nexub/themes core.css), not component tokens.
  const density = /^badge-h-(sm|md|lg)$/;
  assert.deepEqual([...used].filter((n) => !documented.has(n) && !density.test(n)), []);
});
