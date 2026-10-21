import * as React from 'react';
import { cn } from '../../utils/cn.js';

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
        if (wrapper.scrollWidth > wrapper.clientWidth) {
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
            className={cn('w-full caption-bottom text-sm tabular-nums', className)}
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

const Body = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
));
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
        'border-b border-[var(--color-outline-variant)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-surface-container-low)_50%,transparent)] data-[state=selected]:bg-[var(--color-surface-container-low)]',
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
        'h-10 px-4 text-start align-middle font-medium text-[var(--color-on-surface-muted)] [&:has([role=checkbox])]:pe-0 [&>[role=checkbox]]:translate-y-[2px]',
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
        'p-4 align-middle [&:has([role=checkbox])]:pe-0 [&>[role=checkbox]]:translate-y-[2px]',
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
      className={cn('mt-4 text-sm text-[var(--color-on-surface-muted)]', className)}
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
