import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

// 8.1 guards: docs text goes through the type map, code through CodeFrame.
// Examples are user-facing component demos, so they may render a <pre> of their own.
const SRC = new URL('../src/', import.meta.url);
const files: { path: string; text: string }[] = [];
const walk = (dir: URL) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) walk(new URL(`${e.name}/`, dir));
    else if (/\.(tsx?|mdx?)$/.test(e.name)) {
      const url = new URL(e.name, dir);
      files.push({ path: url.href.slice(SRC.href.length), text: readFileSync(url, 'utf8') });
    }
  }
};
walk(SRC);

test('no ad-hoc font sizes (text-[2rem], text-[clamp(…)]): use the type map', () => {
  const bad = files.flatMap((f) =>
    [...f.text.matchAll(/text-\[(?:[\d.]+(?:r?em|px|%)|clamp\([^\]]*\))\]/g)].map((m) => `${f.path}: ${m[0]}`),
  );
  assert.deepEqual(bad, []);
});

test('no raw <pre> outside CodeFrame and examples', () => {
  const bad = files
    .filter((f) => f.path !== 'components/docs/CodeFrame.tsx' && !f.path.startsWith('examples/'))
    .filter((f) => /<pre[\s>]/.test(f.text.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '')))
    .map((f) => f.path);
  assert.deepEqual(bad, []);
});
