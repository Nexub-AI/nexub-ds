import * as React from 'react';
import { IconButton, Skeleton, cn } from '@nexub/react';
import { ArrowLeft } from '@nexub/icons';

export interface ListDetailProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  list: React.ReactNode;
  detail: React.ReactNode;
  /**
   * When narrow (one pane at a time), show the detail instead of the list.
   * Set it when an item is selected. Ignored when both panes fit.
   */
  showDetail?: boolean;
  /** Called by the back button, shown only when narrow. Omit to hide it. */
  onBack?: () => void;
  /** @default 'Back' */
  backLabel?: string;
  /** Fixed list width when both panes show. @default 'md' (320px) */
  listWidth?: 'sm' | 'md' | 'lg';
  /** Accessible names for the two regions. */
  listLabel?: string;
  detailLabel?: string;
  /** 10.5: shows skeleton rows in the list pane and sets aria-busy on it. */
  loading?: boolean;
  /** Shown in the list pane in place of `list`. Pass it when the list has no items. */
  emptyState?: React.ReactNode;
  /** Shown in the list pane in place of `list`; wins over `loading` and `emptyState`. */
  errorState?: React.ReactNode;
}

const widths = {
  sm: '[@container(min-width:720px)]:w-72',
  md: '[@container(min-width:720px)]:w-80',
  lg: '[@container(min-width:720px)]:w-[25rem]',
};

/**
 * The M3 list-detail canonical layout. It responds to its *own* width via a
 * container query, not the viewport: at 720px and up the list (fixed width)
 * and detail sit side by side; below that one pane shows at a time.
 */
export const ListDetail = React.forwardRef<HTMLDivElement, ListDetailProps>(
  (
    {
      list,
      detail,
      showDetail = false,
      onBack,
      backLabel = 'Back',
      listWidth = 'md',
      listLabel = 'List',
      detailLabel = 'Detail',
      loading,
      emptyState,
      errorState,
      className,
      ...props
    },
    ref,
  ) => (
    <div ref={ref} className={cn('h-full [container-type:inline-size]', className)} {...props}>
      <div className="flex h-full">
        <section
          aria-label={listLabel}
          aria-busy={(loading && errorState == null) || undefined}
          className={cn(
            'min-h-0 w-full shrink-0 flex-col overflow-y-auto',
            '[@container(min-width:720px)]:flex [@container(min-width:720px)]:border-e [@container(min-width:720px)]:border-[var(--color-outline-variant)]',
            widths[listWidth],
            showDetail ? 'hidden' : 'flex',
          )}
        >
          {errorState ??
            (loading
              ? [0, 1, 2, 3, 4, 5].map((i) => (
                  <div key={i} aria-hidden="true" className="flex items-center gap-3 px-4 py-3">
                    <Skeleton shape="circle" />
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <Skeleton className="my-0.5 h-4 w-1/2" />
                      <Skeleton className="my-0.5 h-4 w-4/5" />
                    </div>
                  </div>
                ))
              : (emptyState ?? list))}
        </section>
        <section
          aria-label={detailLabel}
          className={cn(
            'min-h-0 min-w-0 flex-1 flex-col overflow-y-auto',
            '[@container(min-width:720px)]:flex',
            showDetail ? 'flex' : 'hidden',
          )}
        >
          {onBack && (
            <div className="p-2 [@container(min-width:720px)]:hidden">
              <IconButton label={backLabel} onClick={onBack}>
                <ArrowLeft size="md" aria-hidden="true" className="rtl:-scale-x-100" />
              </IconButton>
            </div>
          )}
          {detail}
        </section>
      </div>
    </div>
  ),
);
ListDetail.displayName = 'ListDetail';
