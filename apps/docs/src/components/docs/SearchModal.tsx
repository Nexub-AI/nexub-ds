'use client';

import * as React from 'react';
import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import type { SearchEntry } from '@/registry/index';
import { Search, FileText, Layers } from '@nexub/icons';

export function SearchModal({ searchIndex }: { searchIndex: SearchEntry[] }) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  // ⌘K / Ctrl+K to open; Escape to close
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleSelect = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        style={{
          position: 'fixed', inset: 0,
          background: 'var(--color-overlay)',
          backdropFilter: 'blur(4px)',
          zIndex: 'var(--z-commandK)',
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '20vh',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(560px, 92vw)',
          zIndex: 'var(--z-commandK)',
          background: 'var(--color-surface-container-high)',
          borderRadius: 'var(--shape-overlay)',
          boxShadow: 'var(--elevation-3)',
          overflow: 'hidden',
        }}
      >
        <Command label="Search docs" shouldFilter>
          {/* Input */}
          <div style={{ display: 'flex', alignItems: 'center', margin: '12px 12px 4px', padding: '0 14px', height: '48px', gap: '10px', background: 'var(--color-surface-container-highest)', borderRadius: 'var(--shape-field)' }}>
            <Search size={16} style={{ color: 'var(--color-on-surface-muted)', flexShrink: 0 }} />
            <Command.Input
              placeholder="Search components, patterns, foundations…"
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                fontSize: 'var(--type-body-lg-size)', color: 'var(--color-on-surface)',
                fontFamily: 'var(--font-family-sans)',
              }}
            />
            <kbd style={{
              fontSize: '0.7rem', padding: '2px 6px',
              background: 'var(--color-surface-container-high)',
              borderRadius: 'var(--shape-tooltip)', color: 'var(--color-on-surface-variant)',
              fontFamily: 'var(--font-family-sans)',
            }}>esc</kbd>
          </div>

          {/* Results */}
          <Command.List style={{ maxHeight: '340px', overflowY: 'auto', padding: '8px' }}>
            <Command.Empty style={{ padding: '24px', textAlign: 'center', color: 'var(--color-on-surface-muted)', fontSize: '0.875rem' }}>
              No results found.
            </Command.Empty>

            {searchIndex.map((item) => (
              <Command.Item
                key={item.id}
                value={`${item.label} ${item.description} ${item.category}`}
                onSelect={() => handleSelect(item.href)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '8px 12px', borderRadius: 'var(--shape-field)',
                  cursor: 'pointer', color: 'var(--color-on-surface)',
                  fontSize: '0.875rem',
                }}
                className="search-item"
              >
                <span style={{ color: 'var(--color-on-surface-muted)', flexShrink: 0 }}>
                  {item.category.startsWith('Pattern') ? <Layers size={14} /> : <FileText size={14} />}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 500 }}>{item.label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-on-surface-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.description}
                  </div>
                </div>
                <span style={{ fontSize: 'var(--type-label-sm-size)', color: 'var(--color-on-surface-muted)', flexShrink: 0 }}>
                  {item.category}
                </span>
              </Command.Item>
            ))}
          </Command.List>
        </Command>
      </div>
    </>
  );
}
