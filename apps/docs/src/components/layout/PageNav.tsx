'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { ArrowLeft, ArrowRight } from '@nexub/icons';
import { Breadcrumb, Card, CardLink, Text } from '@nexub/react';
import type { NavGroup } from '@/registry/types';
import { breadcrumbTrail, flattenNav, pagerFor, type FlatPage } from '@/registry/nav';
import { DocsLink } from './DocsLink';

// `navGroups` comes from the server layout (the same prop the sidebar gets), so the
// registry itself never ships to the client. Both pieces are in the server HTML.

/** Home › section › page, above the page title on every docs page. */
export function DocsBreadcrumbs({ navGroups }: { navGroups: NavGroup[] }) {
  const pathname = usePathname();
  const trail = React.useMemo(() => breadcrumbTrail(flattenNav(navGroups), pathname), [navGroups, pathname]);
  return (
    <Breadcrumb.Root aria-label="Breadcrumb" className="min-w-0">
      <Breadcrumb.List>
        {trail.map((crumb, i) => (
          <React.Fragment key={i}>
            {i > 0 && <Breadcrumb.Separator />}
            <Breadcrumb.Item>
              {i === trail.length - 1 ? (
                <Breadcrumb.Page>{crumb.label}</Breadcrumb.Page>
              ) : crumb.href ? (
                // Breadcrumb.Link is a plain <a>; DocsLink keeps the navigation client-side.
                <DocsLink href={crumb.href} className="no-underline transition-colors hover:text-on-surface">
                  {crumb.label}
                </DocsLink>
              ) : (
                <span>{crumb.label}</span>
              )}
            </Breadcrumb.Item>
          </React.Fragment>
        ))}
      </Breadcrumb.List>
    </Breadcrumb.Root>
  );
}

function PagerCard({ page, direction }: { page: FlatPage; direction: 'Previous' | 'Next' }) {
  const next = direction === 'Next';
  return (
    <Card variant="interactive" className={'flex flex-col gap-1 px-5 py-4 ' + (next ? 'items-end text-end sm:col-start-2' : 'items-start')}>
      <Text size="caption" tone="muted" className="inline-flex items-center gap-1.5">
        {!next && <ArrowLeft size={14} aria-hidden="true" className="rtl:-scale-x-100" />}
        {direction}
        {next && <ArrowRight size={14} aria-hidden="true" className="rtl:-scale-x-100" />}
      </Text>
      <CardLink asChild className="text-label-lg font-semibold">
        <DocsLink href={page.href} aria-label={`${direction}: ${page.title}`}>
          {page.title}
        </DocsLink>
      </CardLink>
    </Card>
  );
}

/** Previous / next in sidebar order, at the end of every docs page. */
export function DocsPager({ navGroups }: { navGroups: NavGroup[] }) {
  const pathname = usePathname();
  const { previous, next } = React.useMemo(() => pagerFor(flattenNav(navGroups), pathname), [navGroups, pathname]);
  if (!previous && !next) return null;
  return (
    <nav aria-label="Pagination" className="docs-pager">
      {previous && <PagerCard page={previous} direction="Previous" />}
      {next && <PagerCard page={next} direction="Next" />}
    </nav>
  );
}
