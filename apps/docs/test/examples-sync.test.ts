// Every registry example has exactly one file in src/examples/<kind>/<slug>/<i>.tsx
// (its preview and its shown code), and there are no orphan files.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync } from 'node:fs';

const src = new URL('../src/', import.meta.url);

for (const kind of ['components', 'patterns']) {
  for (const file of readdirSync(new URL(`registry/${kind}/`, src))) {
    const { default: entry } = await import(new URL(`registry/${kind}/${file}`, src).href);
    const dir = new URL(`examples/${kind}/${entry.meta.slug}/`, src);
    const files = existsSync(dir) ? readdirSync(dir).sort((a, b) => parseInt(a) - parseInt(b)) : [];

    test(`${kind}/${entry.meta.slug}: one file per example`, () => {
      assert.deepEqual(files, entry.examples.map((_: unknown, i: number) => `${i}.tsx`));
    });
  }
}

test('no example folder without a registry entry', () => {
  for (const kind of ['components', 'patterns']) {
    const slugs = new Set(readdirSync(new URL(`registry/${kind}/`, src)).map((f) => f.replace(/\.ts$/, '')));
    for (const slug of readdirSync(new URL(`examples/${kind}/`, src))) assert.ok(slugs.has(slug), `${kind}/${slug}`);
  }
});
