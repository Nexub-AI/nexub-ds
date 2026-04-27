'use client';

import * as React from 'react';
import Link from 'next/link';
import { ThemeSwitcher } from '../docs/ThemeSwitcher';
import { BrandSwitcher } from '../docs/BrandSwitcher';
import { Menu, Search } from 'lucide-react';
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
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 'var(--z-sticky)',
        height: 'var(--docs-header-height)',
        display: 'flex',
        alignItems: 'center',
        paddingInline: '1rem',
        gap: '12px',
        background: 'color-mix(in srgb, var(--color-bg-default) 85%, transparent)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-border-default)',
      }}
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
        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text-primary)' }}>
          Nexub<span style={{ color: 'var(--color-brand-primary-500)' }}> DS</span>
        </span>
      </Link>

      {/* Version badge */}
      {versionBadge && <div style={{ flexShrink: 0 }}>{versionBadge}</div>}

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Search trigger — hidden on mobile */}
      <button
        onClick={openSearch}
        className="docs-header-search"
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '6px 12px',
          background: 'var(--color-bg-muted)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 'var(--radius-lg)',
          color: 'var(--color-text-muted)',
          fontSize: '0.8rem',
          fontFamily: 'var(--font-family-sans)',
          cursor: 'pointer',
          width: '200px',
          justifyContent: 'space-between',
          transition: 'border-color var(--duration-fast) var(--ease-out)',
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
          background: 'var(--color-bg-raised)', border: '1px solid var(--color-border-default)',
          borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-family-sans)',
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
    </header>
  );
}
