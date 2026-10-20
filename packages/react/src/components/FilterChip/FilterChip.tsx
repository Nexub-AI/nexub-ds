import * as React from 'react';
import { cn } from '../../utils/cn.js';
import { disabledText } from '../../utils/control.js';

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
          // Matches Chip; hover/press come from the state layer.
          'nx-state-layer inline-flex items-center gap-1 rounded-shape-control border h-8 px-3 text-label-lg select-none',
          selected
            ? 'bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)] border-transparent'
            : 'bg-[var(--color-surface-container-low)] text-[var(--color-on-surface-variant)] border-[var(--color-outline-variant)]',
        )}
      >
        <button
          ref={ref}
          type="button"
          className={cn(
            'inline-flex items-center gap-1 bg-transparent border-0 p-0 m-0 cursor-pointer rounded-shape-control text-current',
            disabledText,
            className,
          )}
          aria-pressed={selected}
          {...props}
        >
          {children}
          {count !== undefined && (
            <span
              className={cn(
                'inline-flex items-center justify-center rounded-full text-label-sm px-1.5 min-w-[1.25rem] h-5',
                selected
                  ? 'bg-[var(--color-on-secondary-container)] text-[var(--color-secondary-container)]'
                  : 'bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)]',
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
              // State layer for hover/press; focus = the global ring.
              'nx-state-layer inline-flex items-center justify-center rounded-full w-5 h-5 -mr-1 text-current',
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
