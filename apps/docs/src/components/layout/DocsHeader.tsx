'use client';

import * as React from 'react';
import Link from 'next/link';
import { ThemeSwitcher } from '../docs/ThemeSwitcher';
import { BrandSwitcher } from '../docs/BrandSwitcher';
import { Menu, Search } from '@nexub/icons';
import { TopNav } from '@nexub/react';
import { NexubLogo } from './NexubLogo';
import { useSidebar } from './SidebarContext';

interface DocsHeaderProps {
  versionBadge?: React.ReactNode;
}

export function DocsHeader({ versionBadge }: DocsHeaderProps) {
  const { toggle } = useSidebar();

  const openSearch = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }));
  };

  return (
    <TopNav.Root
      surface="glass"
      scrollEdge="soft"
      className="docs-header border-x-0 border-t-0"
      style={{ height: 'var(--docs-header-height)' }}
    >
      {/* Hamburger — mobile only */}
      <button
        onClick={toggle}
        className="docs-hamburger"
        aria-label="Toggle navigation menu"
      >
        <Menu size={20} />
      </button>

      {/* Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
        <NexubLogo size={28} />
        <span style={{ fontFamily: 'var(--font-family-display)', fontWeight: 700, fontSize: 'var(--type-title-md-size)', color: 'var(--color-on-surface)' }}>
          Nexub<span style={{ color: 'var(--color-primary)' }}> DS</span>
        </span>
      </Link>

      {/* Version badge */}
      {versionBadge && <div style={{ flexShrink: 0 }}>{versionBadge}</div>}

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Search trigger — hidden on mobile */}
      <button
        onClick={openSearch}
        className="docs-header-search nx-state-layer"
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          height: 'var(--size-control-md)',
          paddingInline: '14px',
          background: 'var(--color-surface-container-highest)',
          border: 'none',
          borderRadius: 'var(--shape-field)',
          color: 'var(--color-on-surface-variant)',
          fontSize: 'var(--type-body-md-size)',
          fontFamily: 'var(--font-family-sans)',
          cursor: 'pointer',
          width: '220px',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
        aria-label="Search (⌘K)"
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Search size={13} />
          Search…
        </span>
        <kbd style={{
          fontSize: '0.65rem', padding: '1px 5px',
          background: 'var(--color-surface-elevated)', border: '1px solid var(--color-outline-variant)',
          borderRadius: 'var(--shape-tooltip)', fontFamily: 'var(--font-family-sans)',
        }}>⌘K</kbd>
      </button>

      {/* Search icon — mobile only */}
      <button
        onClick={openSearch}
        className="docs-header-search-icon"
        aria-label="Search (⌘K)"
      >
        <Search size={18} />
      </button>

      {/* Brand switcher — hidden on mobile */}
      <div className="docs-header-brand-switcher">
        <BrandSwitcher />
      </div>

      {/* Theme switcher */}
      <ThemeSwitcher />
    </TopNav.Root>
  );
}
