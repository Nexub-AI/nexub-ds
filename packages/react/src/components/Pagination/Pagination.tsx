import * as React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';
import { disabledText, pressable } from '../../utils/control.js';

// Text capsules with a state layer; the current page is a filled primary capsule.
const navButton = cn(
  pressable,
  'inline-flex h-11 w-11 items-center justify-center bg-transparent text-[var(--color-on-surface)]',
  disabledText,
);

function generatePages(
  current: number,
  total: number,
  siblings: number,
): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const leftSibling = Math.max(current - siblings, 1);
  const rightSibling = Math.min(current + siblings, total);
  const showLeft = leftSibling > 2;
  const showRight = rightSibling < total - 1;
  const pages: (number | '...')[] = [1];
  if (showLeft) pages.push('...');
  for (let i = leftSibling; i <= rightSibling; i++) {
    if (i !== 1 && i !== total) pages.push(i);
  }
  if (showRight) pages.push('...');
  pages.push(total);
  return pages;
}

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  page: number;
  totalItems: number;
  pageSize?: number;
  siblingCount?: number;
  onPageChange: (page: number) => void;
}

export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  (
    {
      className,
      page,
      totalItems,
      pageSize = 20,
      siblingCount = 1,
      onPageChange,
      ...props
    },
    ref,
  ) => {
    const messages = useNexubMessages();
    const totalPages = Math.ceil(totalItems / pageSize);
    if (totalPages <= 1) return null;
    const pages = generatePages(page, totalPages, siblingCount);

    return (
      <nav
        ref={ref}
        role="navigation"
        aria-label={messages.pagination}
        className={cn('flex items-center gap-1 tabular-nums', className)}
        {...props}
      >
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label={messages.previousPage}
          className={navButton}
        >
          <ChevronLeft size="sm" aria-hidden="true" className="rtl:-scale-x-100" />
        </button>

        {pages.map((p, i) =>
          p === '...' ? (
            <span
              key={`ellipsis-${i}`}
              className="flex h-11 w-11 items-center justify-center text-[var(--color-on-surface-muted)]"
            >
              <MoreHorizontal size="sm" aria-hidden="true" />
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              aria-label={messages.goToPage(p)}
              aria-current={p === page ? 'page' : undefined}
              className={cn(
                pressable,
                'inline-flex h-11 min-w-11 px-2 items-center justify-center text-label-lg',
                p === page
                  ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]'
                  : 'bg-transparent text-[var(--color-on-surface)]',
              )}
            >
              {p}
            </button>
          ),
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label={messages.nextPage}
          className={navButton}
        >
          <ChevronRight size="sm" aria-hidden="true" className="rtl:-scale-x-100" />
        </button>
      </nav>
    );
  },
);
Pagination.displayName = 'Pagination';
