import * as React from 'react';
import { cn, SearchInput, useNexubMessages } from '@nexub/react';

export interface FilterBarProps extends React.HTMLAttributes<HTMLDivElement> {
  searchPlaceholder?: string;
  /** Accessible name of the search field. Defaults to the localised "Search". */
  searchLabel?: string;
  onSearch?: (value: string) => void;
  searchValue?: string;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
}

export const FilterBar = React.forwardRef<HTMLDivElement, FilterBarProps>(
  ({ searchPlaceholder, searchLabel, onSearch, searchValue, filters, actions, className, ...props }, ref) => {
    const t = useNexubMessages();
    return (
      <div ref={ref} className={cn('flex flex-wrap items-center gap-3', className)} {...props}>
        <SearchInput
          aria-label={searchLabel ?? t.search}
          placeholder={searchPlaceholder ?? t.searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearch?.(e.target.value)}
          onClear={() => onSearch?.('')}
          wrapperClassName="w-full sm:w-64"
        />
        {filters && <div className="flex flex-wrap items-center gap-2">{filters}</div>}
        {actions && <div className="ms-auto flex items-center gap-2">{actions}</div>}
      </div>
    );
  },
);

FilterBar.displayName = 'FilterBar';
