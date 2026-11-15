import { test } from 'node:test';
import assert from 'node:assert/strict';
import { exportName, mergeChangelogs, pageForCode } from '../src/lib/changelog.ts';

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

test('pageForCode links code spans that name a docs page', () => {
  assert.equal(exportName('data-table'), 'DataTable');
  assert.equal(exportName('kpi-tile'), 'KpiTile');
  const pages = new Map([
    ['Button', '/components/button'],
    ['BarChart', '/components/bar-chart'],
  ]);
  assert.equal(pageForCode('BarChart', pages), '/components/bar-chart');
  assert.equal(pageForCode('<Button variant="hero">', pages), '/components/button');
  assert.equal(pageForCode('Button magnetic', pages), '/components/button');
  assert.equal(pageForCode('ButtonGroup', pages), undefined); // no prefix matches
  assert.equal(pageForCode('Button.Root', pages), undefined); // a member, not the component
  assert.equal(pageForCode('ThemeProvider', pages), undefined); // no page
  assert.equal(pageForCode('@nexub/react', pages), undefined);
});
