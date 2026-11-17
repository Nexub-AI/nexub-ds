'use client';

import * as React from 'react';
import { cn } from '../../utils/cn.js';
import { dataBusy, dataState, type DataStateProps } from '../../utils/dataState.js';
import { Skeleton } from '../Skeleton/Skeleton.js';
import { useNexubMessages } from '../NexubProvider/NexubProvider.js';

export interface TableRootProps extends React.HTMLAttributes<HTMLTableElement> {
  /**
   * Accessible name of the scroll region shown when the table overflows
   * horizontally. Falls back to the table's `aria-label`/`aria-labelledby`, then its caption.
   */
  scrollLabel?: string;
}

// Lets Table.Caption get an id without the author passing one, so the scroll region can point at it.
const CaptionIdContext = React.createContext<string | undefined>(undefined);

const Root = React.forwardRef<HTMLTableElement, TableRootProps>(
  ({ className, scrollLabel, ...props }, ref) => {
    const wrapperRef = React.useRef<HTMLDivElement>(null);
    const tableRef = React.useRef<HTMLTableElement | null>(null);
    const captionId = React.useId();
    // The labelled-by id of the caption, or null when there is none.
    const [overflow, setOverflow] = React.useState<{ captionId: string | null } | null>(null);

    React.useEffect(() => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const measure = () => {
        // Only an overflowing wrapper is a scroll region worth a tab stop (WCAG 2.1.1).
        // Either axis: a DataTable with maxHeight scrolls vertically (8.3).
        if (wrapper.scrollWidth > wrapper.clientWidth || wrapper.scrollHeight > wrapper.clientHeight) {
          const id = tableRef.current?.caption?.id || null;
          setOverflow((prev) => (prev && prev.captionId === id ? prev : { captionId: id }));
        } else {
          setOverflow(null);
        }
      };
      measure();
      if (typeof ResizeObserver === 'undefined') return;
      const ro = new ResizeObserver(measure);
      ro.observe(wrapper);
      if (tableRef.current) ro.observe(tableRef.current);
      return () => ro.disconnect();
    }, []);

    const setRefs = (el: HTMLTableElement | null) => {
      tableRef.current = el;
      if (typeof ref === 'function') ref(el);
      else if (ref) ref.current = el;
    };

    const label = scrollLabel ?? props['aria-label'];
    const labelledBy = label
      ? undefined
      : (props['aria-labelledby'] ?? overflow?.captionId ?? undefined);
    const named = Boolean(label || labelledBy);

    return (
      <CaptionIdContext.Provider value={captionId}>
        <div
          ref={wrapperRef}
          className="relative w-full overflow-auto"
          {...(overflow
            ? {
                tabIndex: 0,
                ...(named
                  ? { role: 'region', 'aria-label': label, 'aria-labelledby': labelledBy }
                  : {}),
              }
            : {})}
        >
          <table
            ref={setRefs}
            className={cn('w-full caption-bottom text-body-sm tabular-nums', className)}
            {...props}
          />
        </div>
      </CaptionIdContext.Provider>
    );
  },
);
Root.displayName = 'Table.Root';

const Header = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} />
));
Header.displayName = 'Table.Header';

export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement>, DataStateProps {
  /**
   * Number of columns, so a state can span the table. Setting it turns the
   * states on: skeleton rows while `loading`, `errorState`, and `emptyState`
   * (default: the "no results" message) when the body has no rows.
   */
  columns?: number;
  /** Skeleton rows shown while loading. @default 5 */
  loadingRows?: number;
}

const Body = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, columns, loadingRows = 5, loading, emptyState, errorState, children, ...props }, ref) => {
    const messages = useNexubMessages();
    const states = { loading, emptyState, errorState };
    const on = columns !== undefined;
    const skeletonRows = Array.from({ length: loadingRows }, (_, r) => (
      <Row key={r} data-loading="" className="hover:bg-transparent">
        {Array.from({ length: columns ?? 0 }, (_, c) => (
          <Cell key={c}>
            <Skeleton />
          </Cell>
        ))}
      </Row>
    ));
    const state = on ? dataState(states, React.Children.count(children) === 0, skeletonRows, messages.noResults) : null;
    return (
      <tbody
        ref={ref}
        aria-busy={on ? dataBusy(states) : undefined}
        className={cn('[&_tr:last-child]:border-0', className)}
        {...props}
      >
        {state == null ? (
          children
        ) : state === skeletonRows ? (
          skeletonRows
        ) : (
          // Error and empty: one full-width row, like DataTable.
          <Row className="hover:bg-transparent">
            <Cell colSpan={columns} className="h-24">
              <div className="flex flex-col">{state}</div>
            </Cell>
          </Row>
        )}
      </tbody>
    );
  },
);
Body.displayName = 'Table.Body';

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      'border-t bg-[var(--color-surface-container-low)] font-medium [&>tr]:last:border-b-0',
      className,
    )}
    {...props}
  />
));
TableFooter.displayName = 'Table.Footer';

const Row = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        'border-b border-[var(--table-border,var(--color-outline-variant))] transition-colors hover:bg-[var(--row-hover,color-mix(in_srgb,var(--color-surface-container-low)_50%,transparent))] data-[state=selected]:bg-[var(--color-surface-container-low)]',
        className,
      )}
      {...props}
    />
  ),
);
Row.displayName = 'Table.Row';

const Head = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        'h-[var(--table-head-h,2.5rem)] px-[var(--table-cell-p,1rem)] bg-[var(--table-head-bg,transparent)] text-start align-middle font-medium text-[var(--table-head-fg,var(--color-on-surface-muted))] [&:has([role=checkbox])]:pe-0 [&>[role=checkbox]]:translate-y-0-5',
        className,
      )}
      {...props}
    />
  ),
);
Head.displayName = 'Table.Head';

const Cell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(
        'p-[var(--table-cell-p,1rem)] align-middle [&:has([role=checkbox])]:pe-0 [&>[role=checkbox]]:translate-y-0-5',
        className,
      )}
      {...props}
    />
  ),
);
Cell.displayName = 'Table.Cell';

const Caption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, id, ...props }, ref) => {
  const contextId = React.useContext(CaptionIdContext);
  return (
    <caption
      ref={ref}
      id={id ?? contextId}
      className={cn('mt-4 text-body-sm text-[var(--color-on-surface-muted)]', className)}
      {...props}
    />
  );
});
Caption.displayName = 'Table.Caption';

export const Table = {
  Root,
  Header,
  Body,
  Footer: TableFooter,
  Row,
  Head,
  Cell,
  Caption,
};
