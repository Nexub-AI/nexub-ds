import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { nativeEssentials } from '../src/registry/native-essentials.ts';

// Every name on the native essentials list (11.8) is a real @nexub/react-native export,
// so a rename or removal there fails here instead of leaving a dead entry in the docs.
const index = readFileSync(new URL('../../../packages/react-native/src/index.ts', import.meta.url), 'utf8');
const exported = new Set([...index.matchAll(/export\s*\{([^}]*)\}/g)].flatMap((m) => m[1].split(',').map((s) => s.trim().split(/\s+as\s+/).pop()!.trim())).filter(Boolean));

test('every essential is exported by @nexub/react-native', () => {
  const missing = nativeEssentials.map((x) => x.name).filter((n) => !exported.has(n));
  assert.deepEqual(missing, []);
});

test('the list has no duplicates and stays near 80 (decision 3)', () => {
  const names = nativeEssentials.map((x) => x.name);
  assert.equal(new Set(names).size, names.length);
  assert.ok(names.length >= 70 && names.length <= 95, `${names.length} essentials`);
});
