import * as React from 'react';
import { cn } from '@nexub/react';

export interface FilterBarProps extends React.HTMLAttributes<HTMLDivElement> {
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  searchValue?: string;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
}

export const FilterBar = React.forwardRef<HTMLDivElement, FilterBarProps>(
  (
    { searchPlaceholder, onSearch, searchValue, filters, actions, className, ...props },
    ref,
  ) => (
    <div ref={ref} className={cn('flex flex-wrap items-center gap-3', className)} {...props}>
      <input
        type="search"
        placeholder={searchPlaceholder ?? 'Search…'}
        value={searchValue}
        onChange={(e) => onSearch?.(e.target.value)}
        className="h-9 rounded-md border border-[var(--color-border-default)] bg-[var(--color-bg-default)] px-3 py-2 text-sm placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary-500)] w-full sm:w-64"
      />
      {filters && (
        <div className="flex flex-wrap items-center gap-2">{filters}</div>
      )}
      {actions && (
        <div className="ml-auto flex items-center gap-2">{actions}</div>
      )}
    </div>
  ),
);

FilterBar.displayName = 'FilterBar';
