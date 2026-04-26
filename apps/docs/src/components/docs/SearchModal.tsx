'use client';

import * as React from 'react';
import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import { searchIndex } from '@/registry/index';
import { Search, FileText, Layers } from 'lucide-react';

export function SearchModal() {
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
          background: 'rgba(0,0,0,0.5)',
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
          background: 'var(--color-bg-raised)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden',
        }}
      >
        <Command label="Search docs" shouldFilter>
          {/* Input */}
          <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', gap: '10px', borderBottom: '1px solid var(--color-border-default)' }}>
            <Search size={16} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
            <Command.Input
              placeholder="Search components, patterns, foundations…"
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                fontSize: '0.9rem', color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-family-sans)',
              }}
            />
            <kbd style={{
              fontSize: '0.7rem', padding: '2px 6px',
              background: 'var(--color-bg-muted)', border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-sm)', color: 'var(--color-text-muted)',
              fontFamily: 'var(--font-family-sans)',
            }}>esc</kbd>
          </div>

          {/* Results */}
          <Command.List style={{ maxHeight: '340px', overflowY: 'auto', padding: '8px' }}>
            <Command.Empty style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              No results found.
            </Command.Empty>

            {searchIndex.map((item) => (
              <Command.Item
                key={item.id}
                value={`${item.label} ${item.description} ${item.category}`}
                onSelect={() => handleSelect(item.href)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '8px 10px', borderRadius: 'var(--radius-md)',
                  cursor: 'pointer', color: 'var(--color-text-primary)',
                  fontSize: '0.875rem',
                }}
                className="search-item"
              >
                <span style={{ color: 'var(--color-text-muted)', flexShrink: 0 }}>
                  {item.category.startsWith('Pattern') ? <Layers size={14} /> : <FileText size={14} />}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 500 }}>{item.label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.description}
                  </div>
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-subtle)', flexShrink: 0 }}>
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
