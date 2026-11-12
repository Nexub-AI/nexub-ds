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
  // None right after 3.0 removed Banner, Callout, Tag and StatusPill; this checks any added later.
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

// 7.9 freeze list: every 7.x deprecation of a prop, message or token (not a whole
// component, so not in the registry) with the major that removes it. Its JSDoc must
// agree, and "Migrating to 8.0" lists the same removals. Entries leave once removed (motion: 8.0, hidePassword: 9.0).
const FROZEN_7X: { what: string; file: string; since: string; removeIn: string }[] = []; // hidePassword left in 9.0

test('7.x deprecations are frozen with their removal major', () => {
  const root = new URL('../../../', import.meta.url);
  const found = new Set<string>();
  for (const pkg of ['core', 'react', 'patterns', 'marketing', 'react-native']) {
    const walk = (dir: URL) => {
      for (const e of readdirSync(dir, { withFileTypes: true })) {
        if (e.isDirectory()) walk(new URL(`${e.name}/`, dir));
        else if (/\.tsx?$/.test(e.name) && !/\.(test|stories)\./.test(e.name) && /@deprecated since 7\./.test(readFileSync(new URL(e.name, dir), 'utf8')))
          found.add(new URL(e.name, dir).href.slice(root.href.length));
      }
    };
    walk(new URL(`packages/${pkg}/src/`, root));
  }
  assert.deepEqual([...found].sort(), FROZEN_7X.map((d) => d.file).sort(), 'A `@deprecated since 7.x` JSDoc must be in FROZEN_7X, and vice versa');
  for (const d of FROZEN_7X) {
    const src = readFileSync(new URL(d.file, root), 'utf8');
    const m = src.match(/@deprecated since (7\.\d)[\s\S]*?removed in (\d+\.0)/i);
    assert.ok(m, `${d.file}: JSDoc must say "@deprecated since ${d.since} … removed in ${d.removeIn}"`);
    assert.deepEqual([m[1], m[2]], [d.since, d.removeIn], `${d.what}: JSDoc disagrees with the freeze list`);
  }
});
