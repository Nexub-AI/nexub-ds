import * as React from 'react';
import { IconButton, cn } from '@nexub/react';
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
}

const widths = {
  sm: '[@container(min-width:720px)]:w-72',
  md: '[@container(min-width:720px)]:w-80',
  lg: '[@container(min-width:720px)]:w-[400px]',
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
      className,
      ...props
    },
    ref,
  ) => (
    <div ref={ref} className={cn('h-full [container-type:inline-size]', className)} {...props}>
      <div className="flex h-full">
        <section
          aria-label={listLabel}
          className={cn(
            'min-h-0 w-full shrink-0 flex-col overflow-y-auto',
            '[@container(min-width:720px)]:flex [@container(min-width:720px)]:border-r [@container(min-width:720px)]:border-[var(--color-outline-variant)]',
            widths[listWidth],
            showDetail ? 'hidden' : 'flex',
          )}
        >
          {list}
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
                <ArrowLeft size="md" aria-hidden="true" />
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
