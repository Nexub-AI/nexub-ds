'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Search } from '@nexub/icons';
import { IconButton, Kbd, Logo, TopNav } from '@nexub/react';
import { ThemeSwitcher } from '../docs/ThemeSwitcher';
import { BrandSwitcher } from '../docs/BrandSwitcher';
import { ContrastSwitcher } from '../docs/ContrastSwitcher';
import { VersionBadge } from '../docs/VersionBadge';
import { useSidebar } from './SidebarContext';

const sections = [
  { label: 'Docs', href: '/getting-started' },
  { label: 'Components', href: '/components' },
  { label: 'Patterns', href: '/patterns' },
];

// Docs covers every docs page that isn't under Components or Patterns.
function activeSection(pathname: string): string | undefined {
  if (pathname === '/') return undefined;
  if (pathname.startsWith('/components')) return '/components';
  if (pathname.startsWith('/patterns')) return '/patterns';
  return '/getting-started';
}

const openSearch = () =>
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }));

/** The site header, shared by the landing page and every docs page. */
export function DocsHeader() {
  const { toggle } = useSidebar();
  const active = activeSection(usePathname());

  return (
    <TopNav.Root surface="glass" scrollEdge="soft" className="docs-header gap-3 border-x-0 border-t-0">
      <IconButton label="Open navigation" className="docs-only-mobile" onClick={toggle}>
        <Menu size={20} />
      </IconButton>

      <Link href="/" className="flex shrink-0 items-center no-underline">
        <Logo size="sm" product="Design System" />
      </Link>
      <div className="docs-only-desktop shrink-0">
        <VersionBadge />
      </div>

      <TopNav.Menu aria-label="Sections" className="docs-header-sections ms-4">
        {sections.map((s) => (
          <TopNav.Item key={s.href} asChild active={s.href === active} className="no-underline">
            <Link href={s.href}>{s.label}</Link>
          </TopNav.Item>
        ))}
      </TopNav.Menu>

      <div className="flex-1" />

      <button
        type="button"
        onClick={openSearch}
        aria-keyshortcuts="Meta+K Control+K"
        className="docs-header-search nx-state-layer flex h-control-md w-56 shrink-0 items-center justify-between gap-2 rounded-shape-field bg-[var(--color-surface-container-highest)] ps-4 pe-2 text-body-md text-[var(--color-on-surface-variant)]"
      >
        <span className="flex items-center gap-2">
          <Search size={14} aria-hidden="true" />
          Search
        </span>
        {/* The name is the visible "Search" (WCAG 2.5.3); aria-keyshortcuts carries ⌘K. */}
        <Kbd aria-hidden="true">⌘K</Kbd>
      </button>
      <IconButton label="Search the docs" className="docs-header-search-icon" onClick={openSearch}>
        <Search size={18} />
      </IconButton>

      <div className="docs-only-desktop">
        <BrandSwitcher />
      </div>
      <div className="docs-only-desktop">
        <ContrastSwitcher />
      </div>
      <div className="docs-only-desktop">
        <ThemeSwitcher />
      </div>
    </TopNav.Root>
  );
}
