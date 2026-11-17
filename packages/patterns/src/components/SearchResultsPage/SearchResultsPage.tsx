import * as React from 'react';
import { Badge, Button, EmptyStatePreset, Pagination, SearchInput, SkeletonPreset, Tabs, safeHref, useNexubMessages } from '@nexub/react';
import { PageFrame, usePageMessages, type PageFrameProps, type PageTemplateMessages } from '../PageFrame/PageFrame.js';

export interface SearchResult {
  id: string;
  title: string;
  /** The result is one link (or a button with only `onSelect`); its accessible name is the title. */
  href?: string;
  onSelect?: () => void;
  excerpt?: string;
  /** A muted line: the path, a date, the author. */
  meta?: React.ReactNode;
  /** A short type label: "Invoice", "Person". */
  kind?: string;
  icon?: React.ReactNode;
}

export interface SearchResultKind {
  id: string;
  label: React.ReactNode;
  count?: number;
}

export interface SearchResultsPageProps extends Omit<PageFrameProps, 'title' | 'children' | 'onSubmit' | 'results'> {
  /** @default messages.searchResults */
  title?: React.ReactNode;
  query: string;
  onQueryChange: (query: string) => void;
  /** Enter in the field, or a suggestion. */
  onSubmit?: (query: string) => void;
  /** The current page of results. */
  results: SearchResult[];
  /** Across all pages. @default results.length */
  total?: number;
  /** One-based. */
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  /** Beside the count: filter chips. */
  filters?: React.ReactNode;
  /** Result types as tabs: "All", "People", "Files". Your app filters `results` by `kind`. */
  kinds?: SearchResultKind[];
  kind?: string;
  onKindChange?: (id: string) => void;
  /** Beside the count: a sort Select. */
  sort?: React.ReactNode;
  loading?: boolean;
  /** Other searches offered when nothing matches. */
  suggestions?: string[];
  /** Wraps the query's words in `<mark>` in titles and excerpts. @default true */
  highlight?: boolean;
  /** @default the "no results" preset with `suggestions` */
  emptyState?: React.ReactNode;
  /** Shown in place of the results; wins over `loading` and the empty state. */
  errorState?: React.ReactNode;
  messages?: Partial<PageTemplateMessages>;
}

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Splits `text` on the query's words and wraps the matches in <mark>. Text nodes only: nothing is parsed as HTML. */
function mark(text: string, query: string): React.ReactNode {
  // ponytail: the first 8 words, plain substring matches; swap in the search engine's own offsets if it returns them.
  const words = query.trim().split(/\s+/).filter(Boolean).slice(0, 8).sort((a, b) => b.length - a.length).map(escapeRegExp);
  if (!words.length) return text;
  return text.split(new RegExp(`(${words.join('|')})`, 'gi')).map((part, i) =>
    i % 2 ? (
      <mark key={i} className="rounded-shape-min bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)]">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

// The title's link covers the whole card.
const stretched =
  'outline-none after:absolute after:inset-0 after:rounded-shape-container focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-[var(--color-primary)]';

/** Search results: the query field, type tabs, an announced count, highlighted results and paging. */
export const SearchResultsPage = React.forwardRef<HTMLElement, SearchResultsPageProps>(function SearchResultsPage(
  {
    title,
    query,
    onQueryChange,
    onSubmit,
    results,
    total: totalProp,
    page = 1,
    pageSize = 10,
    onPageChange,
    filters,
    kinds,
    kind,
    onKindChange,
    sort,
    loading,
    suggestions = [],
    highlight = true,
    emptyState,
    errorState,
    messages,
    ...props
  },
  ref,
) {
  const m = usePageMessages(messages);
  const t = useNexubMessages();
  const total = totalProp ?? results.length;
  const text = (s: string) => (highlight ? mark(s, query) : s);
  const failed = errorState != null;

  const body = failed ? (
    errorState
  ) : loading ? (
    <div aria-busy="true">
      <SkeletonPreset preset="listRow" count={5} />
    </div>
  ) : results.length === 0 ? (
    (emptyState ?? (
      <EmptyStatePreset
        kind="noResults"
        actions={
          suggestions.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-body-sm text-[var(--color-on-surface-muted)]">{m.trySearching}</span>
              {suggestions.map((s) => (
                <Button
                  key={s}
                  variant="outlined"
                  size="sm"
                  onClick={() => {
                    onQueryChange(s);
                    onSubmit?.(s);
                  }}
                >
                  {s}
                </Button>
              ))}
            </div>
          )
        }
      />
    ))
  ) : (
    <>
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {results.map((r) => (
          <li
            key={r.id}
            className="nx-state-layer relative flex items-start gap-3 rounded-shape-container border border-[var(--color-outline-variant)] bg-[var(--color-surface-elevated)] p-4"
          >
            {r.icon && <span className="mt-0.5 shrink-0 text-[var(--color-on-surface-variant)]">{r.icon}</span>}
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <h2 className="break-words text-title-sm text-[var(--color-on-surface)]">
                {r.href ? (
                  <a href={safeHref(r.href)} onClick={r.onSelect} className={stretched}>
                    {text(r.title)}
                  </a>
                ) : r.onSelect ? (
                  <button type="button" onClick={r.onSelect} className={`text-start ${stretched}`}>
                    {text(r.title)}
                  </button>
                ) : (
                  text(r.title)
                )}
              </h2>
              {r.excerpt && <p className="line-clamp-3 break-words text-body-sm text-[var(--color-on-surface-muted)]">{text(r.excerpt)}</p>}
              {r.meta && <div className="text-label-sm text-[var(--color-on-surface-variant)]">{r.meta}</div>}
            </div>
            {r.kind && (
              <Badge size="sm" variant="soft" className="shrink-0">
                {r.kind}
              </Badge>
            )}
          </li>
        ))}
      </ul>
      {onPageChange && total > pageSize && (
        <Pagination className="self-center" page={page} totalItems={total} pageSize={pageSize} onPageChange={onPageChange} />
      )}
    </>
  );

  const current = kind ?? kinds?.[0]?.id;
  return (
    <PageFrame ref={ref} title={title ?? m.searchResults} {...props}>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.(query);
        }}
      >
        <SearchInput
          aria-label={t.search}
          placeholder={t.searchPlaceholder}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onClear={() => onQueryChange('')}
        />
      </form>
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Always mounted, so the count is announced when it changes. */}
        <p role="status" className="text-body-sm text-[var(--color-on-surface-muted)]">
          {!loading && !failed && query.trim() ? m.resultsFor(total, query.trim()) : ''}
        </p>
        {(filters || sort) && (
          <div className="flex flex-wrap items-center gap-2">
            {filters}
            {sort}
          </div>
        )}
      </div>
      {kinds?.length ? (
        <Tabs.Root value={current} onValueChange={onKindChange} className="flex flex-col gap-4">
          <Tabs.List>
            {kinds.map((k) => (
              <Tabs.Trigger key={k.id} value={k.id}>
                {k.label}
                {k.count != null && (
                  <Badge size="sm" variant="soft">
                    {k.count}
                  </Badge>
                )}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
          <Tabs.Content value={current!} className="flex flex-col gap-4">
            {body}
          </Tabs.Content>
        </Tabs.Root>
      ) : (
        <div className="flex flex-col gap-4">{body}</div>
      )}
    </PageFrame>
  );
});
