import * as React from 'react';
import { cn } from '../../utils/cn.js';

const columnClasses = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 @md:grid-cols-2',
  3: 'grid-cols-1 @md:grid-cols-2 @3xl:grid-cols-3',
} as const;

export interface DescriptionListRootProps extends React.HTMLAttributes<HTMLDListElement> {
  /** `inline`: label at the start, value at the end of one row. `stacked`: label above the value. @default 'inline' */
  layout?: 'inline' | 'stacked';
  /** Pairs per row. Falls back to fewer columns when the list's own width is narrow. @default 1 */
  columns?: keyof typeof columnClasses;
  /** A hairline between rows. */
  divided?: boolean;
  /** @default 'md' */
  size?: 'sm' | 'md';
}

export interface DescriptionListItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  label: React.ReactNode;
  /** The value. */
  children?: React.ReactNode;
  /** A total: stronger label and value, and a rule above. */
  emphasis?: boolean;
  /** Where the value sits. @default 'end' in the inline layout, 'start' when stacked */
  align?: 'start' | 'end';
  /** A small muted line under the label. */
  helpText?: React.ReactNode;
}

// Layout and size reach the items through CSS (group data attributes), not
// context, so the list stays a server component.
const Root = React.forwardRef<HTMLDListElement, DescriptionListRootProps>(
  ({ className, layout = 'inline', columns = 1, divided, size = 'md', ...props }, ref) => (
    // The container query needs a full-width block around the grid.
    <div className="@container w-full">
      <dl
        ref={ref}
        data-layout={layout}
        data-size={size}
        className={cn(
          'group/dl m-0 grid gap-x-8',
          columnClasses[columns],
          divided && '[&>div]:border-b [&>div]:border-[var(--color-outline-variant)]',
          divided && columns === 1 && '[&>div:last-child]:border-b-0',
          className,
        )}
        {...props}
      />
    </div>
  ),
);
Root.displayName = 'DescriptionList.Root';

const Item = React.forwardRef<HTMLDivElement, DescriptionListItemProps>(
  ({ label, children, emphasis, align, helpText, className, ...props }, ref) => (
    <div
      ref={ref}
      data-emphasis={emphasis || undefined}
      className={cn(
        'flex min-w-0 flex-wrap items-baseline gap-x-4 gap-y-1 py-3 text-body-md',
        'group-data-[size=sm]/dl:py-2 group-data-[size=sm]/dl:text-body-sm',
        'group-data-[layout=stacked]/dl:flex-col group-data-[layout=stacked]/dl:flex-nowrap group-data-[layout=stacked]/dl:items-stretch',
        // The rule sits on the hairline of the row above when the list is divided.
        emphasis && '-mt-px border-t border-t-[var(--color-outline)] font-semibold',
        className,
      )}
      {...props}
    >
      <dt className={cn('min-w-0', emphasis ? 'text-[var(--color-on-surface)]' : 'text-[var(--color-on-surface-muted)]')}>
        {label}
        {helpText != null && (
          <span className="block text-body-sm font-normal text-[var(--color-on-surface-muted)]">{helpText}</span>
        )}
      </dt>
      <dd
        className={cn(
          'm-0 min-w-0 break-words tabular-nums text-[var(--color-on-surface)]',
          !emphasis && 'font-medium',
          align === 'start' && 'flex-1 text-start',
          align === 'end' && 'ms-auto text-end',
          align == null && 'ms-auto text-end group-data-[layout=stacked]/dl:ms-0 group-data-[layout=stacked]/dl:text-start',
        )}
      >
        {children}
      </dd>
    </div>
  ),
);
Item.displayName = 'DescriptionList.Item';

/**
 * Key–value rows with `<dl>` semantics (10.7): a receipt, a fee breakdown, the
 * details of a record. `InfoList` in @nexub/patterns is the ready-made version
 * with loading and empty states.
 */
export const DescriptionList = { Root, Item };
