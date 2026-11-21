'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button, CommandPalette, Kbd } from '@nexub/react';
import { FileText, Layers } from '@nexub/icons';
import type { SearchEntry } from '@/registry/index';

// Namespaced: the docs share an origin with the previews and examples.
const RECENT_KEY = 'nexub-docs:search-recents';

const hasStoredRecents = () => {
  try {
    return (JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]') as unknown[]).length > 0;
  } catch {
    return false;
  }
};

/**
 * Docs search on the Nexub CommandPalette. Opens with ⌘K / Ctrl+K (DocsHeader
 * dispatches the same keydown from its search buttons).
 */
export function SearchModal({ searchIndex }: { searchIndex: SearchEntry[] }) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const input = React.useRef<HTMLInputElement>(null);
  // The palette keeps the last pages opened (its `recentKey`) and lists them while the
  // query is empty. It has no "clear", so: empty the key, then drop and restore the prop
  // for one render so the palette reads it again. This file only runs in the browser
  // (ssr: false in ClientProviders), so recents never reach the server HTML.
  const [hasRecents, setHasRecents] = React.useState(false);
  const [cleared, setCleared] = React.useState(false);
  React.useEffect(() => {
    if (open) setHasRecents(hasStoredRecents());
  }, [open]);
  React.useEffect(() => {
    if (cleared) setCleared(false);
  }, [cleared]);
  const clearRecents = () => {
    try {
      localStorage.removeItem(RECENT_KEY);
    } catch {
      // Storage blocked: there was nothing stored to clear.
    }
    setHasRecents(false);
    setCleared(true);
    input.current?.focus(); // the button is about to go away
  };

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', handler);
    const root = document.documentElement.dataset;
    root.searchReady = 'true';
    if (root.searchPending) {
      delete root.searchPending;
      setOpen(true);
    }
    return () => {
      window.removeEventListener('keydown', handler);
      delete root.searchReady;
    };
  }, []);

  const groups = React.useMemo(() => {
    const map = new Map<string, SearchEntry[]>();
    for (const item of searchIndex) {
      const list = map.get(item.category) ?? [];
      list.push(item);
      map.set(item.category, list);
    }
    return Array.from(map);
  }, [searchIndex]);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <CommandPalette.Root open={open} onOpenChange={setOpen} label="Search the docs" scrollLock="class" recentKey={cleared ? undefined : RECENT_KEY}>
      <CommandPalette.Input ref={input} placeholder="Search components, patterns, foundations…" />
      <CommandPalette.List>
        <CommandPalette.Empty>No results found.</CommandPalette.Empty>
        {groups.map(([category, items]) => (
          <CommandPalette.Group key={category} heading={category}>
            {items.map((item) => (
              <CommandPalette.Item
                key={item.id}
                value={`${item.label} ${item.description} ${item.category}`}
                onSelect={() => go(item.href)}
                className="gap-3"
              >
                <span className="shrink-0 text-on-surface-muted" aria-hidden="true">
                  {item.category.startsWith('Pattern') ? <Layers size={16} /> : <FileText size={16} />}
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="text-body-sm font-medium text-on-surface">{item.label}</span>
                  {/* Generated content, not a text node: the palette names a Recent row by the item's text, which should be the title alone. */}
                  <span
                    data-description={item.description}
                    className="truncate text-label-sm text-on-surface-muted before:content-[attr(data-description)]"
                  />
                </span>
              </CommandPalette.Item>
            ))}
          </CommandPalette.Group>
        ))}
      </CommandPalette.List>
      <div className="flex min-h-10 flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-outline-variant px-4 py-1.5 text-label-sm text-on-surface-muted">
        <span aria-hidden="true" className="flex flex-wrap items-center gap-1.5">
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd> to move
          <Kbd className="ms-2">↵</Kbd> to open
          <Kbd className="ms-2">esc</Kbd> to close
        </span>
        {hasRecents && (
          <Button variant="text" size="xs" onClick={clearRecents}>
            Clear recent
          </Button>
        )}
      </div>
    </CommandPalette.Root>
  );
}
