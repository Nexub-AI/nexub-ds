'use client';

import * as React from 'react';
import Link from 'next/link';
import { Menu, Search } from '@nexub/icons';
import { IconButton, Kbd, Logo, TopNav } from '@nexub/react';
import { ThemeSwitcher } from '../docs/ThemeSwitcher';
import { BrandSwitcher } from '../docs/BrandSwitcher';
import { useSidebar } from './SidebarContext';

interface DocsHeaderProps {
  versionBadge?: React.ReactNode;
}

const openSearch = () =>
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }));

export function DocsHeader({ versionBadge }: DocsHeaderProps) {
  const { toggle } = useSidebar();

  return (
    <TopNav.Root surface="glass" scrollEdge="soft" className="docs-header gap-3 border-x-0 border-t-0">
      <IconButton label="Open navigation" className="docs-only-mobile" onClick={toggle}>
        <Menu size={20} />
      </IconButton>

      <Link href="/" aria-label="Nexub Design System home" className="flex min-w-0 items-center no-underline">
        <Logo size="sm" product="Design System" />
      </Link>
      {versionBadge && <div className="docs-only-desktop shrink-0">{versionBadge}</div>}

      <div className="flex-1" />

      <button
        type="button"
        onClick={openSearch}
        aria-label="Search the docs"
        aria-keyshortcuts="Meta+K Control+K"
        className="docs-only-desktop nx-state-layer flex h-control-md w-56 shrink-0 items-center justify-between gap-2 rounded-shape-field bg-[var(--color-surface-container-highest)] ps-4 pe-2 text-body-md text-[var(--color-on-surface-variant)]"
      >
        <span className="flex items-center gap-2">
          <Search size={14} aria-hidden="true" />
          Search
        </span>
        <Kbd>⌘K</Kbd>
      </button>
      <IconButton label="Search the docs" className="docs-only-mobile" onClick={openSearch}>
        <Search size={18} />
      </IconButton>

      <div className="docs-only-desktop">
        <BrandSwitcher />
      </div>
      <div className="docs-only-desktop">
        <ThemeSwitcher />
      </div>
    </TopNav.Root>
  );
}
