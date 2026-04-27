import * as React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from '@nexub/icons';
import { cn } from '../../utils/cn.js';

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
    const totalPages = Math.ceil(totalItems / pageSize);
    if (totalPages <= 1) return null;
    const pages = generatePages(page, totalPages, siblingCount);

    return (
      <nav
        ref={ref}
        role="navigation"
        aria-label="Pagination"
        className={cn('flex items-center gap-1', className)}
        {...props}
      >
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Go to previous page"
          className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-[var(--color-border-default)] text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-bg-subtle)] disabled:pointer-events-none disabled:opacity-50"
        >
          <ChevronLeft size="sm" aria-hidden="true" />
        </button>

        {pages.map((p, i) =>
          p === '...' ? (
            <span
              key={`ellipsis-${i}`}
              className="flex h-11 w-11 items-center justify-center text-[var(--color-text-muted)]"
            >
              <MoreHorizontal size="sm" aria-hidden="true" />
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              aria-label={`Go to page ${p}`}
              aria-current={p === page ? 'page' : undefined}
              className={cn(
                'inline-flex h-11 w-11 items-center justify-center rounded-md text-sm font-medium transition-colors',
                p === page
                  ? 'bg-[var(--color-brand-primary-500)] text-white'
                  : 'border border-[var(--color-border-default)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)]',
              )}
            >
              {p}
            </button>
          ),
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Go to next page"
          className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-[var(--color-border-default)] text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-bg-subtle)] disabled:pointer-events-none disabled:opacity-50"
        >
          <ChevronRight size="sm" aria-hidden="true" />
        </button>
      </nav>
    );
  },
);
Pagination.displayName = 'Pagination';
