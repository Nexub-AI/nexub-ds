'use client';

import * as React from 'react';
import { Check, Copy } from '@nexub/icons';
import { Badge, Button, EmptyStatePreset, FilterChip, SearchInput, SegmentedControl, Table, Text, Truncate } from '@nexub/react';
import { filterTokenRows, TIER_LABEL, TOKEN_CATEGORIES, type TokenRow, type TokenTier } from '@/lib/token-rows';

// The static HTML carries the first rows only (roles come first); "Show all" and any
// filter work on the whole set, which arrives as a prop.
const FIRST = 100;

const TIER_TONE = { role: 'info', component: 'success', reference: 'neutral' } as const;

/** A colour chip. An SVG fill, not a style attribute: the value is a CSS colour or var(). */
function Swatch({ colour }: { colour: string }) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" className="shrink-0">
      <rect x="0.5" y="0.5" width="15" height="15" rx="4" fill={colour} className="stroke-outline-variant" />
    </svg>
  );
}

export function TokenExplorer({ rows }: { rows: TokenRow[] }) {
  const [query, setQuery] = React.useState('');
  const [category, setCategory] = React.useState<string | null>(null);
  const [tier, setTier] = React.useState<TokenTier | null>(null);
  const [showAll, setShowAll] = React.useState(false);
  const [copied, setCopied] = React.useState<string | null>(null);

  const categories = React.useMemo(() => TOKEN_CATEGORIES.filter((c) => rows.some((r) => r.category === c)), [rows]);
  const matches = React.useMemo(() => filterTokenRows(rows, query, category, tier), [rows, query, category, tier]);
  // ponytail: "Show all" renders every match (about 1,000 rows at most); move to DataTableVirtual if the set grows past a few thousand.
  const shown = showAll ? matches : matches.slice(0, FIRST);

  const copy = async (name: string) => {
    try {
      await navigator.clipboard.writeText(`var(${name})`);
      setCopied(name);
      setTimeout(() => setCopied((c) => (c === name ? null : c)), 1800);
    } catch {
      // Clipboard blocked (permissions, non-HTTPS): the name is on screen to copy by hand.
    }
  };

  const reset = () => {
    setQuery('');
    setCategory(null);
    setTier(null);
  };

  return (
    <div className="not-prose flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-[16rem] flex-1">
          <SearchInput
            aria-label="Search tokens"
            placeholder={`Search ${rows.length} tokens by name or value`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClear={() => setQuery('')}
          />
        </div>
        <SegmentedControl.Root
          size="sm"
          aria-label="Tier"
          value={tier ?? 'all'}
          onValueChange={(v) => v && setTier(v === 'all' ? null : (v as TokenTier))}
        >
          <SegmentedControl.Item value="all">All tiers</SegmentedControl.Item>
          <SegmentedControl.Item value="role">Roles</SegmentedControl.Item>
          <SegmentedControl.Item value="component">Component</SegmentedControl.Item>
          <SegmentedControl.Item value="reference">Reference</SegmentedControl.Item>
        </SegmentedControl.Root>
      </div>

      <div role="group" aria-label="Category" className="flex flex-wrap gap-2">
        <FilterChip selected={category === null} onClick={() => setCategory(null)}>
          All
        </FilterChip>
        {categories.map((c) => (
          <FilterChip key={c} selected={category === c} onClick={() => setCategory(category === c ? null : c)}>
            {c}
          </FilterChip>
        ))}
      </div>

      <Text size="body-sm" tone="muted" role="status" aria-live="polite">
        {shown.length < matches.length ? `Showing ${shown.length} of ${matches.length} tokens` : `${matches.length} tokens`}
      </Text>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? `Copied var(${copied})` : ''}
      </span>

      {matches.length === 0 ? (
        <EmptyStatePreset
          kind="noResults"
          actions={
            <Button variant="tonal" onClick={reset}>
              Clear filters
            </Button>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-shape-container border border-outline-variant">
          <Table.Root density="compact">
            <Table.Caption className="sr-only">Design tokens: name, tier, category and value</Table.Caption>
            <Table.Header>
              <Table.Row>
                <Table.Head>Token</Table.Head>
                <Table.Head>Tier</Table.Head>
                <Table.Head>Category</Table.Head>
                <Table.Head>Value</Table.Head>
                <Table.Head>Light / dark</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {shown.map((r) => (
                <Table.Row key={r.name}>
                  <Table.Cell>
                    <Button
                      variant="text"
                      size="xs"
                      onClick={() => copy(r.name)}
                      aria-label={`Copy ${r.name}`}
                      trailingIcon={copied === r.name ? <Check size={12} aria-hidden="true" /> : <Copy size={12} aria-hidden="true" />}
                      className="-ms-2 font-mono font-normal"
                    >
                      {r.name}
                    </Button>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge variant="soft" size="sm" tone={TIER_TONE[r.tier]}>
                      {TIER_LABEL[r.tier]}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>{r.category}</Table.Cell>
                  <Table.Cell>
                    <span className="flex max-w-[26rem] items-center gap-2 font-mono text-label-sm">
                      {r.swatch && <Swatch colour={r.swatch} />}
                      <Truncate className="min-w-0">{r.value}</Truncate>
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    {r.light && r.dark && (
                      <span className="flex items-center gap-2 whitespace-nowrap font-mono text-label-sm">
                        <Swatch colour={r.light} />
                        {r.light}
                        <Swatch colour={r.dark} />
                        {r.dark}
                      </span>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </div>
      )}

      {shown.length < matches.length && (
        <Button variant="outlined" className="self-start" onClick={() => setShowAll(true)}>
          Show all {matches.length} tokens
        </Button>
      )}
    </div>
  );
}
