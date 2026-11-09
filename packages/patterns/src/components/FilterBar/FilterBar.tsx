import * as React from 'react';
import { Button, cn, SearchInput, useNexubMessages } from '@nexub/react';

export interface FilterBarProps extends React.HTMLAttributes<HTMLDivElement> {
  searchPlaceholder?: string;
  /**
   * Accessible name of the search field. Defaults to `searchPlaceholder` without a
   * trailing "…", else the localised "Search".
   */
  searchLabel?: string;
  /**
   * Fires on every keystroke. Filter big lists from a deferred copy so typing stays
   * responsive: `const query = React.useDeferredValue(search)`, then filter by `query`
   * (in a memoised component or `useMemo`).
   */
  onSearch?: (value: string) => void;
  searchValue?: string;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
  /** How many filters are applied; shows "N filters" with a Clear all button when above 0. */
  activeCount?: number;
  /** Clears search and filters; the button shows when `activeCount` is above 0. */
  onClearAll?: () => void;
}

export const FilterBar = React.forwardRef<HTMLDivElement, FilterBarProps>(
  ({ searchPlaceholder, searchLabel, onSearch, searchValue, filters, actions, activeCount = 0, onClearAll, className, ...props }, ref) => {
    const t = useNexubMessages();
    return (
      <div ref={ref} className={cn('flex flex-wrap items-center gap-3', className)} {...props}>
        <SearchInput
          aria-label={searchLabel ?? searchPlaceholder?.replace(/\s*(…|\.\.\.)$/, '') ?? t.search}
          placeholder={searchPlaceholder ?? t.searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearch?.(e.target.value)}
          onClear={() => onSearch?.('')}
          wrapperClassName="w-full sm:w-64"
        />
        {filters && <div className="flex flex-wrap items-center gap-2">{filters}</div>}
        {activeCount > 0 && (
          <div className="flex items-center gap-1 text-body-sm text-[var(--color-on-surface-muted)]">
            <span aria-live="polite">{t.filtersApplied(activeCount)}</span>
            {onClearAll && (
              <Button variant="link" size="sm" onClick={onClearAll}>
                {t.clearAll}
              </Button>
            )}
          </div>
        )}
        {actions && <div className="ms-auto flex items-center gap-2">{actions}</div>}
      </div>
    );
  },
);

FilterBar.displayName = 'FilterBar';
