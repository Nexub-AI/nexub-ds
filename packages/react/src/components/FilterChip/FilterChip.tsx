import * as React from 'react';
import { cn } from '../../utils/cn.js';

export interface FilterChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  count?: number;
  onRemove?: () => void;
  children: React.ReactNode;
}

export const FilterChip = React.forwardRef<HTMLButtonElement, FilterChipProps>(
  ({ className, selected = false, count, onRemove, children, ...props }, ref) => {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-medium select-none transition-colors',
          selected
            ? 'bg-[var(--color-fill-accent)] text-white border-[var(--color-fill-accent)]'
            : 'bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)] border-[var(--color-border-default)] hover:bg-[var(--color-bg-muted)]',
        )}
      >
        <button
          ref={ref}
          type="button"
          className={cn(
            'inline-flex items-center gap-1 bg-transparent border-0 p-0 m-0 cursor-pointer',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring-default)] focus-visible:ring-offset-2 ring-offset-[var(--color-ring-offset)] rounded-sm',
            selected ? 'text-white' : 'text-[var(--color-text-primary)]',
            className,
          )}
          aria-pressed={selected}
          {...props}
        >
          {children}
          {count !== undefined && (
            <span
              className={cn(
                'inline-flex items-center justify-center rounded-full text-xs font-semibold px-1.5 min-w-[1.25rem] h-5',
                selected
                  ? 'bg-white/20 text-white'
                  : 'bg-[var(--color-bg-muted)] text-[var(--color-text-muted)]',
              )}
            >
              {count}
            </span>
          )}
        </button>
        {onRemove && (
          <button
            type="button"
            aria-label="Remove filter"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className={cn(
              'inline-flex items-center justify-center rounded-full w-4 h-4 text-xs transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring-default)] focus-visible:ring-offset-1',
              selected
                ? 'text-white hover:bg-white/20'
                : 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-text-primary)]',
            )}
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M8 2L2 8M2 2l6 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </span>
    );
  },
);

FilterChip.displayName = 'FilterChip';
