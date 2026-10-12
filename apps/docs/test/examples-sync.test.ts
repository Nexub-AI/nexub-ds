// Every registry example must have a live preview and vice versa. Examples are
// still written twice (code string + JSX), which is how 12 slugs drifted and 5
// previews rendered empty.
// ponytail: regex over source; delete this once examples are single-sourced
// (one .tsx per example, source read at build time — REVIEW_WORK_ITEMS #26).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

const root = new URL('../src/', import.meta.url);
const live = readFileSync(new URL('components/docs/ComponentLivePreview.tsx', root), 'utf8');

function handledIndexes(fn: string): number[] {
  const m = live.match(new RegExp(`function ${fn}\\(\\{ idx \\}[^)]*\\)\\s*\\{([\\s\\S]*?)\\n\\}\\n`));
  assert.ok(m, `live preview function ${fn} not found`);
  return [...new Set([...m[1]!.matchAll(/idx === (\d+)/g)].map((x) => Number(x[1])))].sort((a, b) => a - b);
}

const liveMap = new Map(
  [...live.matchAll(/^\s*'?([\w-]+)'?: (\w+Examples),/gm)].map((m) => [m[1]!, m[2]!] as const),
);

for (const dir of ['components', 'patterns']) {
  for (const file of readdirSync(new URL(`registry/${dir}/`, root))) {
    const src = readFileSync(new URL(`registry/${dir}/${file}`, root), 'utf8');
    const slug = src.match(/slug: '([^']+)'/)?.[1] ?? file.replace(/\.ts$/, '');
    const examples = src.match(/examples:\s*\[([\s\S]*)\]\s*,?\s*\n\s*(?:props|a11y|related|usage|\})/)?.[1] ?? '';
    const count = [...examples.matchAll(/\n\s*\{\s*\n?\s*title:/g)].length;
    const fn = liveMap.get(slug);
    if (!fn || count === 0) continue;

    test(`${slug}: ${count} registry examples ↔ live preview`, () => {
      assert.deepEqual(handledIndexes(fn), [...Array(count).keys()]);
    });
  }
}
