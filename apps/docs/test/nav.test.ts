// 11.0 navigation aids: previous / next follows the sidebar exactly, and every
// sidebar page has a breadcrumb trail. The helpers are pure (src/registry/nav.ts);
// the real sidebar data comes from the registry, loaded through a small resolver
// (the registry uses extensionless and JSON imports, which Next resolves).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { flattenNav, pagerFor, breadcrumbTrail, pageIndex } from '../src/registry/nav.ts';
import type { NavGroup } from '../src/registry/types.ts';

registerHooks({
  resolve(specifier, context, next) {
    if (specifier.endsWith('.json')) {
      const importAttributes = { ...context.importAttributes, type: 'json' };
      return { ...next(specifier, { ...context, importAttributes }), importAttributes };
    }
    if (/^\.\.?\//.test(specifier) && context.parentURL && !/\.[a-z]+$/.test(specifier)) {
      const ts = new URL(specifier + '.ts', context.parentURL);
      if (existsSync(fileURLToPath(ts))) return next(ts.href, context);
    }
    return next(specifier, context);
  },
});

const { navGroups, pageOrder } = (await import('../src/registry/index.ts')) as {
  navGroups: NavGroup[];
  pageOrder: ReturnType<typeof flattenNav>;
};

const sample: NavGroup[] = [
  { title: 'Start', items: [{ title: 'Intro', href: '/start' }, { title: 'Latest', href: '/start/v-3', match: '/start/v-' }] },
  {
    title: 'Components',
    items: [{ title: 'Overview', href: '/components' }],
    children: [
      { title: 'Actions', items: [{ title: 'Button', href: '/components/button' }, { title: 'Link', href: '/components/link' }] },
      { title: 'Forms', items: [{ title: 'Input', href: '/components/input' }] },
    ],
  },
];

test('the order is a section’s own pages, then its sub-sections, in sidebar order', () => {
  assert.deepEqual(
    flattenNav(sample).map((p) => p.href),
    ['/start', '/start/v-3', '/components', '/components/button', '/components/link', '/components/input'],
  );
  assert.deepEqual(flattenNav(sample)[3]!.groups, ['Components', 'Actions']);
});

test('previous / next: ends have one neighbour, categories run into each other', () => {
  const pages = flattenNav(sample);
  assert.equal(pagerFor(pages, '/start').previous, undefined);
  assert.equal(pagerFor(pages, '/start').next?.href, '/start/v-3');
  assert.equal(pagerFor(pages, '/components/input').next, undefined);
  // Last page of Actions → first page of Forms.
  assert.equal(pagerFor(pages, '/components/link').next?.href, '/components/input');
  assert.equal(pagerFor(pages, '/components/button').previous?.href, '/components');
  // A page reached through `match` takes its sidebar item's neighbours; a trailing slash is the same page.
  assert.equal(pagerFor(pages, '/start/v-2').next?.href, '/components');
  assert.equal(pageIndex(pages, '/components/button/'), 3);
  assert.deepEqual(pagerFor(pages, '/nowhere'), {});
});

test('breadcrumb trails', () => {
  const pages = flattenNav(sample);
  const labels = (path: string) => breadcrumbTrail(pages, path).map((c) => (c.href ? `${c.label}→${c.href}` : c.label));
  assert.deepEqual(labels('/components/button'), ['Home→/', 'Components→/components', 'Actions', 'Button']);
  assert.deepEqual(labels('/components'), ['Home→/', 'Components']);
  assert.deepEqual(labels('/start/v-3'), ['Home→/', 'Start→/start', 'Latest']);
  assert.deepEqual(labels('/start/v-2'), ['Home→/', 'Start→/start', 'Latest→/start/v-3', 'V 2']);
  assert.deepEqual(labels('/start/release-notes'), ['Home→/', 'Start→/start', 'Release notes']);
});

test('the real sidebar: unique pages, in order, each with a trail', () => {
  assert.deepEqual(pageOrder, flattenNav(navGroups));
  const hrefs = pageOrder.map((p) => p.href);
  assert.ok(hrefs.length > 150, `only ${hrefs.length} pages`);
  assert.deepEqual(hrefs.filter((h, i) => hrefs.indexOf(h) !== i), [], 'a page is in the sidebar twice');
  assert.equal(pagerFor(pageOrder, hrefs[0]!).previous, undefined);
  assert.equal(pagerFor(pageOrder, hrefs.at(-1)!).next, undefined);
  assert.ok(hrefs.includes('/foundations/tokens'));

  // Component pages follow their category's order in the sidebar.
  const components = navGroups.find((g) => g.title === 'Components')!;
  for (const category of components.children!) {
    const items = category.items.map((i) => i.href);
    const start = hrefs.indexOf(items[0]!);
    assert.deepEqual(hrefs.slice(start, start + items.length), items, category.title);
  }

  for (const page of pageOrder) {
    const trail = breadcrumbTrail(pageOrder, page.href);
    assert.ok(trail.length >= 2 && trail.length <= 4, `${page.href}: ${trail.length} crumbs`);
    assert.deepEqual(trail[0], { label: 'Home', href: '/' });
    const last = trail.at(-1)!;
    assert.equal(last.href, undefined, `${page.href}: the current page is not a link`);
    assert.ok(last.label.trim(), `${page.href}: empty label`);
    for (const crumb of trail.slice(0, -1)) {
      assert.ok(!crumb.href || crumb.href === '/' || hrefs.includes(crumb.href), `${page.href}: crumb to ${crumb.href}`);
    }
  }
});
