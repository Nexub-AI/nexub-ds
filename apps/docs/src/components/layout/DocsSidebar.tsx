'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown } from '@nexub/icons';
import type { NavGroup } from '@/registry/types';
import { useSidebar } from './SidebarContext';

// Every href in the nav tree. Used to prefetch all routes on sidebar mount so
// links inside collapsed groups (display:none → invisible to
// IntersectionObserver) are ready before the user ever expands them.
function allHrefs(groups: NavGroup[]): string[] {
  return groups.flatMap((g) => [
    ...g.items.map((i) => i.href),
    ...(g.children ?? []).flatMap((sub) => sub.items.map((i) => i.href)),
  ]);
}

/* ─── Sub-group (category inside Components) ─────────────────────────────── */

// Custom memo comparator: re-render this SubGroup ONLY when the href that
// is active inside it changes. Every navigation dispatches a new `pathname`
// string, so default shallow comparison would re-render all 17 SubGroups.
// With this comparator, only the 1–2 groups whose active link changed fire.
//
// Comparator logic:
//   prevActive = the href in this group that was active before navigation
//   nextActive = the href in this group that is active after navigation
//   If prevActive === nextActive → nothing in this group changed → skip.
function subGroupEqual(
  prev: { group: NavGroup; pathname: string },
  next: { group: NavGroup; pathname: string },
) {
  const prevActive = prev.group.items.find((i) => i.href === prev.pathname)?.href;
  const nextActive = next.group.items.find((i) => i.href === next.pathname)?.href;
  return prevActive === nextActive;
}

const SubGroup = React.memo(function SubGroup({
  group,
  pathname,
}: {
  group: NavGroup;
  pathname: string;
}) {
  const hasActive = group.items.some((i) => pathname === i.href);
  const [open, setOpen] = React.useState(hasActive);

  React.useEffect(() => {
    if (hasActive) setOpen(true);
  }, [hasActive]);

  return (
    <div style={{ marginBottom: '2px' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '6px 24px 4px 36px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--color-on-surface-muted)',
          fontSize: 'var(--type-label-sm-size)',
          fontWeight: 600,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          fontFamily: 'var(--font-family-sans)',
        }}
        aria-expanded={open}
      >
        {group.title}
        <ChevronDown
          size={10}
          style={{
            flexShrink: 0,
            transform: open ? 'rotate(0deg)' : 'rotate(-90deg)',
            transition: 'transform var(--duration-fast) var(--ease-out)',
          }}
        />
      </button>

      {/*
       * Always keep the <ul> in the DOM (visibility toggled via CSS).
       * This lets Next.js <Link prefetch> work even when the group is
       * collapsed, so RSC payloads are ready before the user clicks.
       */}
      <ul
        style={{
          listStyle: 'none',
          margin: 0,
          padding: '1px 0',
          display: open ? 'block' : 'none',
        }}
        aria-hidden={!open}
      >
        {group.items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                prefetch={true}
                className="docs-nav-item nx-state-layer"
                data-depth="2"
                aria-current={isActive ? 'page' : undefined}
              >
                {item.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}, subGroupEqual);

/* ─── Top-level group ─────────────────────────────────────────────────────── */

// Custom memo comparator for TopGroup: skip re-render unless the active
// state *within this specific top-level group* actually changed.
// Covers both flat items and nested SubGroup items.
function topGroupEqual(
  prev: { group: NavGroup; pathname: string; defaultOpen: boolean },
  next: { group: NavGroup; pathname: string; defaultOpen: boolean },
) {
  if (prev.defaultOpen !== next.defaultOpen) return false;

  // Which href in this top-level group was active before / after?
  const findActive = (g: NavGroup, path: string) =>
    g.items.find((i) => i.href === path)?.href ??
    (g.children ?? [])
      .flatMap((sub) => sub.items)
      .find((i) => i.href === path)?.href;

  return findActive(prev.group, prev.pathname) === findActive(next.group, next.pathname);
}

const TopGroup = React.memo(function TopGroup({
  group,
  pathname,
  defaultOpen,
}: {
  group: NavGroup;
  pathname: string;
  defaultOpen: boolean;
}) {
  const hasActive =
    group.items.some((i) => pathname === i.href) ||
    (group.children ?? []).some((sub) =>
      sub.items.some((i) => pathname === i.href),
    );

  const [open, setOpen] = React.useState(defaultOpen || hasActive);

  React.useEffect(() => {
    if (hasActive) setOpen(true);
  }, [hasActive]);

  return (
    <div style={{ marginBottom: '4px' }}>
      {/* Group header */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '8px 24px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--color-on-surface-variant)',
          fontSize: 'var(--type-label-md-size)',
          fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          fontFamily: 'var(--font-family-sans)',
        }}
        aria-expanded={open}
      >
        {group.title}
        <ChevronDown
          size={12}
          style={{
            flexShrink: 0,
            transform: open ? 'rotate(0deg)' : 'rotate(-90deg)',
            transition: 'transform var(--duration-fast) var(--ease-out)',
          }}
        />
      </button>

      {/*
       * Always keep children in DOM. CSS display toggles visibility while
       * keeping <Link prefetch> elements mounted for background prefetching.
       */}
      <div style={{ display: open ? 'block' : 'none' }} aria-hidden={!open}>
        {/* Flat items (Getting Started, Foundations, Patterns) */}
        {group.items.length > 0 && (
          <ul style={{ listStyle: 'none', margin: 0, padding: '2px 0' }}>
            {group.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    prefetch={true}
                    className="docs-nav-item nx-state-layer"
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        {/* Nested sub-groups (component categories) */}
        {(group.children ?? []).map((sub) => (
          <SubGroup key={sub.title} group={sub} pathname={pathname} />
        ))}
      </div>
    </div>
  );
}, topGroupEqual);

/* ─── Sidebar ─────────────────────────────────────────────────────────────── */

// `navGroups` is passed from the server layout so the full registry (props,
// code strings, a11y notes) never ships to the client just to draw links.
export function DocsSidebar({ navGroups }: { navGroups: NavGroup[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen, close } = useSidebar();

  // Prefetch every sidebar route once after the sidebar mounts.
  // Links inside collapsed groups (display:none) are not visible to the
  // IntersectionObserver that Next.js uses for automatic prefetching, so
  // they would never be cached until clicked. This runs during idle time
  // so it doesn't compete with the initial page render.
  React.useEffect(() => {
    if (typeof requestIdleCallback !== 'undefined') {
      const id = requestIdleCallback(() => {
        for (const href of allHrefs(navGroups)) {
          router.prefetch(href);
        }
      });
      return () => cancelIdleCallback(id);
    } else {
      // Safari fallback
      const t = setTimeout(() => {
        for (const href of allHrefs(navGroups)) {
          router.prefetch(href);
        }
      }, 0);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount — navGroups is static build-time data

  return (
    <aside
      aria-label="Documentation navigation"
      className="docs-sidebar"
      data-open={isOpen ? 'true' : 'false'}
      style={{
        overflowY: 'auto',
        padding: '1rem 0',
        background: 'var(--color-surface-container-low)',
      }}
      // Close sidebar on mobile when any link is clicked (event delegation)
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('a')) close();
      }}
    >
      {navGroups.map((group, i) => (
        <TopGroup
          key={group.title}
          group={group}
          pathname={pathname}
          defaultOpen={i < 2}
        />
      ))}
    </aside>
  );
}
