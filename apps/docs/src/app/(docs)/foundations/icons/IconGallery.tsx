'use client';

import * as React from 'react';
import * as Icons from '@nexub/icons';
import { Input, Text } from '@nexub/react';

type IconComponent = React.ComponentType<{ size?: number }>;

// Every runtime export of @nexub/icons is an icon component (types are erased).
const all = Object.entries(Icons)
  .filter(([name]) => /^[A-Z]/.test(name))
  .sort(([a], [b]) => a.localeCompare(b)) as [string, IconComponent][];

export function IconGallery() {
  const [query, setQuery] = React.useState('');
  const [copied, setCopied] = React.useState<string | null>(null);
  const q = query.trim().toLowerCase();
  const shown = q ? all.filter(([name]) => name.toLowerCase().includes(q)) : all;

  const copy = async (name: string) => {
    try {
      await navigator.clipboard.writeText(`import { ${name} } from '@nexub/icons';`);
      setCopied(name);
      setTimeout(() => setCopied((c) => (c === name ? null : c)), 1800);
    } catch {
      // Clipboard blocked (non-HTTPS / permissions): the name is still visible to copy by hand.
    }
  };

  return (
    <div className="not-prose flex flex-col gap-4">
      <Input
        type="search"
        aria-label="Search icons"
        placeholder={`Search ${all.length} icons`}
        leadingIcon={<Icons.Search size={16} />}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? `Copied import for ${copied}` : `${shown.length} icons`}
      </span>
      {shown.length === 0 ? (
        <Text size="body-sm" tone="secondary">No icons match “{query}”.</Text>
      ) : (
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-2">
          {shown.map(([name, Icon]) => (
            <li key={name}>
              <button
                type="button"
                onClick={() => copy(name)}
                title={`Copy import for ${name}`}
                className="flex w-full flex-col items-center gap-2 rounded-shape-container bg-[var(--color-surface-container-low)] px-2 py-4 text-[var(--color-on-surface)] transition-colors hover:bg-[var(--color-surface-container)] focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <Icon size={24} />
                <span className="w-full truncate text-center font-mono text-label-sm">
                  {copied === name ? 'Copied' : name}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
