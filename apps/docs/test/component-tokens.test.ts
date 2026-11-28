// The "Design tokens" section on component pages, built from @nexub/tokens/json/component.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { aliasOf, componentTokensFor } from '../src/lib/component-tokens.ts';

const component = JSON.parse(
  readFileSync(new URL('../../../packages/tokens/dist/json/component.json', import.meta.url), 'utf8'),
) as Record<string, unknown>;
const tokens: Record<string, string> = JSON.parse(
  readFileSync(new URL('../../../packages/tokens/dist/json/tokens.json', import.meta.url), 'utf8'),
);
const slugs = readdirSync(new URL('../src/registry/components/', import.meta.url)).map((f) => f.replace(/\.ts$/, ''));

test('the covered components get a section', () => {
  for (const slug of ['button', 'input', 'textarea', 'select', 'card', 'badge', 'dialog', 'tabs', 'table', 'chip', 'alert', 'tooltip']) {
    assert.ok(componentTokensFor(slug, component).length, `${slug} has no design tokens`);
  }
  assert.deepEqual(componentTokensFor('spinner', component), []);
});

test('rows alias a semantic role and keep the fallback', () => {
  const [field] = componentTokensFor('input', component);
  assert.equal(field!.group, 'field');
  const border = field!.rows.find((r) => r.name === '--field-border');
  assert.deepEqual(border, { name: '--field-border', type: 'color', aliases: '--color-outline', css: 'var(--color-outline)' });
  for (const slug of slugs) {
    for (const g of componentTokensFor(slug, component)) {
      for (const r of g.rows) {
        assert.match(r.name, /^--[a-z]+-[a-z-]+$/);
        assert.ok(r.aliases.startsWith('--color-') || r.aliases.startsWith('--shape-') || !r.aliases.startsWith('--'), r.name);
      }
    }
  }
});

test('aliasOf', () => {
  assert.equal(aliasOf('{color.primary}'), '--color-primary');
  assert.equal(aliasOf('{shape.field}'), '--shape-field');
  assert.equal(aliasOf('transparent'), 'transparent');
});

test('the tiers table names a real reference token', () => {
  assert.ok('color-brand-primary-600' in tokens);
});
