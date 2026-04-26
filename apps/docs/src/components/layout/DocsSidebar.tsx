'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navGroups } from '@/registry/index';
import { ChevronDown } from 'lucide-react';
import type { NavGroup } from '@/registry/types';

/* ─── Sub-group (category inside Components) ─────────────────────────────── */

// React.memo: prevents re-render when pathname changes but this group's
// active state hasn't changed. usePathname() in DocsSidebar triggers a
// parent re-render on every navigation — memo ensures only the group that
// actually became active/inactive re-renders.
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
          padding: '4px 20px 4px 32px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--color-text-subtle)',
          fontSize: '0.68rem',
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
                style={{
                  display: 'block',
                  padding: '4px 20px 4px 40px',
                  fontSize: '0.83rem',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive
                    ? 'var(--color-brand-primary-500)'
                    : 'var(--color-text-secondary)',
                  textDecoration: 'none',
                  borderLeft: isActive
                    ? '2px solid var(--color-brand-primary-500)'
                    : '2px solid transparent',
                  background: isActive
                    ? 'var(--color-semantic-info-bg)'
                    : 'transparent',
                  transition: 'color var(--duration-fast) var(--ease-out)',
                }}
              >
                {item.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
});

/* ─── Top-level group ─────────────────────────────────────────────────────── */

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
          padding: '6px 20px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--color-text-muted)',
          fontSize: '0.7rem',
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
                    style={{
                      display: 'block',
                      padding: '5px 20px 5px 24px',
                      fontSize: '0.84rem',
                      fontWeight: isActive ? 600 : 400,
                      color: isActive
                        ? 'var(--color-brand-primary-500)'
                        : 'var(--color-text-secondary)',
                      textDecoration: 'none',
                      borderLeft: isActive
                        ? '2px solid var(--color-brand-primary-500)'
                        : '2px solid transparent',
                      background: isActive
                        ? 'var(--color-semantic-info-bg)'
                        : 'transparent',
                      transition: 'color var(--duration-fast) var(--ease-out)',
                    }}
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
});

/* ─── Sidebar ─────────────────────────────────────────────────────────────── */

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside
      aria-label="Documentation navigation"
      style={{
        width: 'var(--docs-sidebar-width)',
        flexShrink: 0,
        position: 'sticky',
        top: 'var(--docs-header-height)',
        height: 'calc(100vh - var(--docs-header-height))',
        overflowY: 'auto',
        borderRight: '1px solid var(--color-border-default)',
        padding: '1rem 0',
        background: 'var(--color-bg-subtle)',
      }}
    >
      {navGroups.map((group, i) => (
        <TopGroup
          key={group.title}
          group={group}
          pathname={pathname}
          defaultOpen={i < 2} // Getting Started + Foundations open by default
        />
      ))}
    </aside>
  );
}
