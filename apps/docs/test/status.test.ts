// Lifecycle status (GOVERNANCE.md → "Status lifecycle"): a deprecated component
// names its replacement and removal major in the docs, and the registry agrees
// with the `@deprecated` JSDoc in @nexub/react.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import type { ComponentEntry } from '../src/registry/types.ts';

const registry = new URL('../src/registry/components/', import.meta.url);
const reactSrc = new URL('../../../packages/react/src/components/', import.meta.url);

// Entry files only `import type`, so type stripping is enough to load them.
const entries: ComponentEntry[] = await Promise.all(
  readdirSync(registry)
    .filter((f) => f.endsWith('.ts'))
    .map(async (f) => (await import(new URL(f, registry).href)).default as ComponentEntry),
);
const bySlug = new Map(entries.map((e) => [e.meta.slug, e]));
const deprecated = entries.filter((e) => e.meta.status === 'deprecated');

test('deprecated entries name a live replacement and a removal major', () => {
  assert.ok(deprecated.length > 0);
  for (const { meta } of deprecated) {
    const d = meta.deprecation;
    assert.ok(d, `${meta.slug}: deprecated without \`deprecation\``);
    assert.match(d.removeIn, /^\d+\.0$/, `${meta.slug}: removeIn must be a major, e.g. '3.0'`);
    assert.ok(d.migration.trim(), `${meta.slug}: empty migration`);
    const replacement = bySlug.get(d.replacement);
    assert.ok(replacement, `${meta.slug}: replacement '${d.replacement}' has no docs page`);
    assert.notEqual(replacement.meta.status, 'deprecated', `${meta.slug}: replacement is itself deprecated`);
  }
});

test('@deprecated components in @nexub/react match the registry', () => {
  const jsdoc = new Map<string, string>();
  for (const dir of readdirSync(reactSrc)) {
    let src: string;
    try {
      src = readFileSync(new URL(`${dir}/${dir}.tsx`, reactSrc), 'utf8');
    } catch {
      continue;
    }
    const m = src.match(new RegExp(`@deprecated ([^\\n]*?)(?:\\*/)?\\n(?:\\s*\\*/\\n)?export const ${dir}\\b`));
    if (m) jsdoc.set(dir, m[1]!);
  }
  const pascal = (slug: string) => slug.replace(/(^|-)(\w)/g, (_, __, c: string) => c.toUpperCase());
  assert.deepEqual(
    [...jsdoc.keys()].sort(),
    deprecated.map((e) => pascal(e.meta.slug)).sort(),
    'A component deprecated in JSDoc must be deprecated in the docs registry, and vice versa',
  );
  for (const e of deprecated) {
    const text = jsdoc.get(pascal(e.meta.slug))!;
    assert.ok(text.includes(`removal planned in ${e.meta.deprecation!.removeIn}`), `${e.meta.slug}: JSDoc must say "removal planned in ${e.meta.deprecation!.removeIn}"`);
  }
});
