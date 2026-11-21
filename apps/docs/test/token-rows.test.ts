// The token explorer's rows (/foundations/tokens), built from the published @nexub/tokens files.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildTokenRows, filterTokenRows, TOKEN_CATEGORIES, TIER_LABEL } from '../src/lib/token-rows.ts';

const dist = new URL('../../../packages/tokens/dist/', import.meta.url);
const json = (path: string) => JSON.parse(readFileSync(new URL(path, dist), 'utf8'));
const { native } = await import(new URL('js/native.js', dist).href);

const tokens: Record<string, string> = json('json/tokens.json');
const rows = buildTokenRows({ tokens, roles: native.color.roles.standard, component: json('json/component.json') });

test('every token is listed once', () => {
  const names = rows.map((r) => r.name);
  assert.equal(new Set(names).size, names.length, 'duplicate token names');
  for (const key of Object.keys(tokens)) assert.ok(names.includes(`--${key}`), `--${key} is missing`);
  for (const r of rows) assert.match(r.name, /^--[a-z0-9-]+$/i);
});

test('tiers and categories', () => {
  for (const r of rows) {
    assert.ok(r.tier in TIER_LABEL, `${r.name}: tier ${r.tier}`);
    assert.ok(TOKEN_CATEGORIES.includes(r.category), `${r.name}: category ${r.category}`);
    assert.ok(r.value.trim(), `${r.name}: empty value`);
  }
  const count = (tier: string) => rows.filter((r) => r.tier === tier).length;
  assert.equal(count('role'), Object.keys(native.color.roles.standard.light).length);
  assert.ok(count('component') > 30);
  assert.ok(count('reference') > 800);
  // A new token prefix should get a category of its own rather than pile up here.
  assert.deepEqual(rows.filter((r) => r.category === 'Other').map((r) => r.name), []);
});

test('colour roles carry a swatch and both resolved values', () => {
  const primary = rows.find((r) => r.name === '--color-primary')!;
  assert.equal(primary.tier, 'role');
  assert.equal(primary.swatch, 'var(--color-primary)');
  assert.match(primary.light!, /^#[0-9a-f]{6}$/i);
  assert.match(primary.dark!, /^#[0-9a-f]{6}$/i);
  assert.notEqual(primary.light, primary.dark);
  assert.equal(rows.find((r) => r.name === '--button-filled-bg')?.swatch, 'var(--color-primary)');
  assert.equal(rows.find((r) => r.name === '--spacing-4')?.swatch, undefined);
});

test('filtering by text, category and tier', () => {
  assert.deepEqual(filterTokenRows(rows, '', null, null), rows);
  assert.ok(filterTokenRows(rows, '  SPACING-4 ', null, null).some((r) => r.name === '--spacing-4'));
  assert.ok(filterTokenRows(rows, '', 'Motion', null).every((r) => r.category === 'Motion'));
  assert.ok(filterTokenRows(rows, 'primary', 'Colour', 'role').every((r) => r.tier === 'role' && r.name.includes('primary')));
  assert.deepEqual(filterTokenRows(rows, 'no-such-token-xyz', null, null), []);
});
