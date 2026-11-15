// 8.4 API truth: docs prop tables are generated from the TypeScript types
// (scripts/web-props.mjs → web-props.generated.json, merged by registry/props-merge.ts).
// The registry may only describe props that exist; hand-written rows are left
// for sub-components and inherited DOM attributes.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import type { ComponentEntry } from '../src/registry/types.ts';
import { mergeProps, propsFor, rowParts, subRow, type GeneratedProps } from '../src/registry/props-merge.ts';

const gen: GeneratedProps = JSON.parse(readFileSync(new URL('../src/registry/web-props.generated.json', import.meta.url), 'utf8'));
const entries: ComponentEntry[] = [];
for (const dir of ['components', 'patterns']) {
  const base = new URL(`../src/registry/${dir}/`, import.meta.url);
  for (const f of readdirSync(base).filter((f) => f.endsWith('.ts'))) entries.push((await import(new URL(f, base).href)).default);
}

// Compound components (Radix parts): the page documents several parts, no single XProps.
const COMPOUND = new Set([
  'accordion', 'alert-dialog', 'breadcrumb', 'collapsible', 'combobox', 'dialog', 'hover-card', 'popover',
  'radio-group', 'select', 'sheet', 'tabs', 'toast', 'toggle-group', 'tooltip', 'activity-feed',
  'app-shell', 'context-menu', 'dropdown-menu', 'menubar', 'navigation-menu', 'visually-hidden',
]);
// Inherited from the HTML element an entry renders; fine to document by hand.
const DOM = new Set(['children', 'className', 'disabled', 'placeholder', 'type', 'href', 'htmlFor', 'required', 'checked', 'defaultChecked', 'value', 'defaultValue', 'onChange', 'name', 'aria-label', 'aria-labelledby', 'id', 'style', 'rows', 'min', 'max']);

test('every documented web component has generated props (or is compound)', () => {
  const missing = entries.filter((e) => !propsFor(e, gen) && !COMPOUND.has(e.meta.slug)).map((e) => `${e.meta.slug} (${e.meta.title}Props)`);
  assert.deepEqual(missing, []);
});

test('registry rows name props that exist in the types', () => {
  const bad: string[] = [];
  for (const e of entries) {
    const g = propsFor(e, gen);
    if (!g) continue;
    const own = new Set([...g.props.map((p) => p.name), ...(g.inherited ?? [])]);
    for (const row of e.props) {
      const parts = rowParts(row);
      if (parts.every((n) => own.has(n))) continue;
      const sub = subRow(e, row, gen);
      if (sub) {
        const subOwn = new Set([...sub.sub.props.map((p) => p.name), ...(sub.sub.inherited ?? [])]);
        if (!sub.parts.every((n) => subOwn.has(n) || DOM.has(n))) bad.push(`${e.meta.slug}: ${row.name}`);
        continue;
      }
      if (/[\s.(…\[]/.test(row.name.replace(/ \/ /g, '/')) || /^[A-Z]/.test(row.name)) continue; // sub-component or call notation
      if (parts.every((n) => own.has(n) || DOM.has(n))) continue;
      bad.push(`${e.meta.slug}: ${row.name}`);
    }
  }
  assert.deepEqual(bad, []);
});

test('merged tables list every own prop once', () => {
  for (const e of entries) {
    const g = propsFor(e, gen);
    if (!g) continue;
    const names = mergeProps(e, gen).props.map((p) => p.name);
    for (const p of g.props) assert.equal(names.filter((n) => n === p.name).length, 1, `${e.meta.slug}: ${p.name}`);
  }
});
