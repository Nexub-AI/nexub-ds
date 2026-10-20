import * as React from 'react';
import { cn } from '../../utils/cn.js';

const Root = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table ref={ref} className={cn('w-full caption-bottom text-sm tabular-nums', className)} {...props} />
    </div>
  ),
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

const Head = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'h-10 px-4 text-start align-middle font-medium text-[var(--color-on-surface-muted)] [&:has([role=checkbox])]:pe-0 [&>[role=checkbox]]:translate-y-[2px]',
      className,
    )}
    {...props}
  />
));
Head.displayName = 'Table.Head';

const Cell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      'p-4 align-middle [&:has([role=checkbox])]:pe-0 [&>[role=checkbox]]:translate-y-[2px]',
      className,
    )}
    {...props}
  />
));
Cell.displayName = 'Table.Cell';

const Caption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn('mt-4 text-sm text-[var(--color-on-surface-muted)]', className)}
    {...props}
  />
));
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
