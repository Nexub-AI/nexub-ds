import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mergeChangelogs } from '../src/lib/changelog.ts';

const react = `# @nexub/react

## 1.10.0

### Minor Changes

- abc1234: **New** \`Foo\` component.
  - sub point

### Patch Changes

- Updated dependencies [abc1234]
  - @nexub/icons@1.10.0
- @nexub/core@1.10.0

## 1.9.0

### Patch Changes

- @nexub/icons@1.9.0
`;

const icons = `# @nexub/icons

## 1.10.0

### Minor Changes

- abc1234: **New** \`Foo\` component.
  - sub point
- def5678: New \`Bar\` icon.
`;

test('merges, drops noise, dedupes and sorts newest first', () => {
  const releases = mergeChangelogs([
    { name: '@nexub/react', md: react },
    { name: '@nexub/icons', md: icons },
  ]);
  assert.deepEqual(releases, [
    {
      version: '1.10.0',
      packages: [
        { name: '@nexub/react', entries: [{ body: '**New** `Foo` component.\n- sub point' }] },
        { name: '@nexub/icons', entries: [{ body: 'New `Bar` icon.' }] },
      ],
    },
    { version: '1.9.0', packages: [] },
  ]);
});
