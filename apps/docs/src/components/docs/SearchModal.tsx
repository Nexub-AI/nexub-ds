'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { CommandPalette } from '@nexub/react';
import { FileText, Layers } from '@nexub/icons';
import type { SearchEntry } from '@/registry/index';

/**
 * Docs search on the Nexub CommandPalette. Opens with ⌘K / Ctrl+K (DocsHeader
 * dispatches the same keydown from its search buttons).
 */
export function SearchModal({ searchIndex }: { searchIndex: SearchEntry[] }) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
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
    <CommandPalette.Root open={open} onOpenChange={setOpen} label="Search the docs" scrollLock="class">
      <CommandPalette.Input placeholder="Search components, patterns, foundations…" />
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
                <span className="shrink-0 text-[var(--color-on-surface-muted)]" aria-hidden="true">
                  {item.category.startsWith('Pattern') ? <Layers size={16} /> : <FileText size={16} />}
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="text-body-sm font-medium text-[var(--color-on-surface)]">{item.label}</span>
                  <span className="truncate text-label-sm text-[var(--color-on-surface-muted)]">{item.description}</span>
                </span>
              </CommandPalette.Item>
            ))}
          </CommandPalette.Group>
        ))}
      </CommandPalette.List>
    </CommandPalette.Root>
  );
}
