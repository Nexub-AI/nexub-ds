// compact-generated (12.7): after tsc, writes dist/js/generated/{tokens,native}.js on one line.
// src/generated/*.ts stays pretty-printed (readable diffs when a token changes); the shipped JS
// holds the same object, only without the indentation. Fails if the round trip changes a value.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const dir = fileURLToPath(new URL('../dist/js/generated/', import.meta.url));

for (const name of ['tokens', 'native']) {
  const file = `${dir}${name}.js`;
  const js = readFileSync(file, 'utf8');
  const start = js.indexOf(`export const ${name} = {`);
  const end = js.lastIndexOf('};');
  if (start === -1 || end === -1 || js.slice(end + 2).trim() !== '')
    throw new Error(`${file}: unexpected shape; update scripts/compact-generated.mjs`);
  const open = js.indexOf('{', start);
  const value = JSON.parse(js.slice(open, end + 1));
  const before = await import(`${file}?before`);
  const compact = `${js.slice(0, open)}${JSON.stringify(value)};\n`;
  writeFileSync(file, compact);
  const after = await import(`${file}?after`);
  if (JSON.stringify(after[name]) !== JSON.stringify(before[name])) throw new Error(`${file}: value changed`);
}
