'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from '@nexub/icons';
import { cn } from '../../utils/cn.js';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';
import { disabledText, pressable } from '../../utils/control.js';
import { useMergedRefs } from '../../hooks/useMergedRefs.js';
import { useSlidingIndicator } from '../../hooks/useSlidingIndicator.js';

// Text capsules with a state layer; the current page is a filled primary capsule.
const navButton = cn(
  pressable,
  'inline-flex h-[var(--pagination-size,2.75rem)] w-[var(--pagination-size,2.75rem)] items-center justify-center bg-transparent text-[var(--color-on-surface)]',
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
    forwardedRef,
  ) => {
    const messages = useNexubMessages();
    const totalPages = Math.ceil(totalItems / pageSize);
    const pages = generatePages(page, totalPages, siblingCount);
    const ref = React.useRef<HTMLElement>(null);
    const mergedRef = useMergedRefs(ref, forwardedRef);
    // 10.5: one fill slides to the current page. The selector names the slot (indicator and
    // Previous come first), so the hook measures again whenever the current page changes slot,
    // also when its button is new (the set around an ellipsis changed). Same slot = no travel.
    useSlidingIndicator(ref, `[aria-current="page"]:nth-child(${pages.indexOf(page) + 3})`);
    if (totalPages <= 1) return null;

    return (
      <nav
        ref={mergedRef}
        role="navigation"
        aria-label={messages.pagination}
        // Wraps: a long run of pages reflows at 400% zoom instead of scrolling the page (9.4).
        className={cn('group/pg relative flex flex-wrap items-center gap-1 tabular-nums', className)}
        {...props}
      >
        {/* Hidden until the hook has measured (server HTML, no JS): until then the button paints its own fill. */}
        <span
          aria-hidden="true"
          data-nx="page-indicator"
          className={cn(
            'pointer-events-none absolute left-0 top-0 hidden rounded-shape-control bg-[var(--color-primary)]',
            'h-[var(--nx-ind-h,0px)] w-[var(--nx-ind-w,0px)] translate-x-[var(--nx-ind-x,0px)] translate-y-[var(--nx-ind-y,0px)] opacity-[var(--nx-ind-o,0)]',
            '[[data-nx-indicator=ready]>&]:block [[data-nx-indicator=ready]>&]:transition-[transform,width] [[data-nx-indicator=ready]>&]:duration-spatial-default [[data-nx-indicator=ready]>&]:ease-spatial-default',
          )}
        />
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
              className="flex h-[var(--pagination-size,2.75rem)] w-[var(--pagination-size,2.75rem)] items-center justify-center text-[var(--color-on-surface-muted)]"
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
                // tabular-nums on the button itself: Tailwind 4's preflight lets buttons
                // inherit it from the nav, Tailwind 3's (UA font reset) does not.
                'inline-flex h-[var(--pagination-size,2.75rem)] min-w-[var(--pagination-size,2.75rem)] px-2 items-center justify-center text-label-lg tabular-nums',
                p === page
                  ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)] group-data-[nx-indicator=ready]/pg:bg-transparent'
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
