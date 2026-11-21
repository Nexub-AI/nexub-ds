// Pure helpers over the sidebar data (`navGroups` in ./index): the page order
// behind previous / next, and the breadcrumb trail. No imports besides types, so
// the docs tests can load this file directly.
import type { NavGroup, NavItem } from './types';

export interface FlatPage {
  title: string;
  href: string;
  /** Path prefix that also resolves to this page (see NavItem.match). */
  match?: string;
  /** Sidebar sections above the page, outermost first. */
  groups: string[];
  /** First page of the outermost section (its Introduction or Overview). */
  groupHref: string;
}

export interface Crumb {
  label: string;
  href?: string;
}

/** Every sidebar page in the order the sidebar draws it: a section's own items, then its sub-sections. */
export function flattenNav(groups: NavGroup[]): FlatPage[] {
  const walk = (g: NavGroup, above: string[], groupHref: string | undefined): FlatPage[] => {
    const path = [...above, g.title];
    const home = groupHref ?? g.items[0]?.href ?? g.children?.[0]?.items[0]?.href ?? '/';
    return [
      ...g.items.map((i: NavItem) => ({ title: i.title, href: i.href, match: i.match, groups: path, groupHref: home })),
      ...(g.children ?? []).flatMap((c) => walk(c, path, home)),
    ];
  };
  return groups.flatMap((g) => walk(g, [], undefined));
}

const clean = (pathname: string) => (pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname);

/** Index of the page for a path: an exact href first, then a `match` prefix. -1 when the path is not in the sidebar. */
export function pageIndex(pages: FlatPage[], pathname: string): number {
  const path = clean(pathname);
  const exact = pages.findIndex((p) => p.href === path);
  return exact >= 0 ? exact : pages.findIndex((p) => p.match != null && path.startsWith(p.match));
}

/** The pages before and after `pathname` in sidebar order. */
export function pagerFor(pages: FlatPage[], pathname: string): { previous?: FlatPage; next?: FlatPage } {
  const i = pageIndex(pages, pathname);
  if (i < 0) return {};
  return { previous: pages[i - 1], next: pages[i + 1] };
}

// 'migrating-to-11' → 'Migrating to 11': for pages the sidebar has no title for.
const humanise = (slug: string) => {
  const words = slug.replace(/-/g, ' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
};

/**
 * Home → section → sub-section → page. The last crumb is the current page (no href);
 * sub-sections have no page of their own, so no href either.
 */
export function breadcrumbTrail(pages: FlatPage[], pathname: string): Crumb[] {
  const path = clean(pathname);
  const home: Crumb = { label: 'Home', href: '/' };
  const slug = humanise(path.split('/').filter(Boolean).pop() ?? '');
  const page = pages[pageIndex(pages, path)];
  if (!page) {
    // Not in the sidebar (e.g. a release note): hang it under the section that shares its first segment.
    const first = path.split('/')[1];
    const section = pages.find((p) => p.groupHref.split('/')[1] === first);
    return [home, ...(section ? [{ label: section.groups[0]!, href: section.groupHref }] : []), { label: slug }];
  }
  const [top, ...subs] = page.groups;
  // A section's first page is the section itself: "Home › Components", not "Components › Overview".
  if (page.href === path && path === page.groupHref) return [home, { label: top! }];
  return [
    home,
    { label: top!, href: page.groupHref },
    ...subs.map((label) => ({ label })),
    ...(page.href === path ? [{ label: page.title }] : [{ label: page.title, href: page.href }, { label: slug }]),
  ];
}
