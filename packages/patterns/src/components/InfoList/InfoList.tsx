import * as React from 'react';
import { Skeleton, cn } from '@nexub/react';

export interface InfoListRootProps extends React.HTMLAttributes<HTMLDListElement> {
  children?: React.ReactNode;
  /** 10.5: shows skeleton rows in place of the items and sets aria-busy. */
  loading?: boolean;
  /** Skeleton rows while `loading`. @default 3 */
  loadingRows?: number;
  /** Shown when there are no items. */
  emptyState?: React.ReactNode;
  /** Shown in place of the list; wins over `loading` and `emptyState`. */
  errorState?: React.ReactNode;
}

export interface InfoListItemProps {
  label: string;
  value: React.ReactNode;
  className?: string;
}

const Root = React.forwardRef<HTMLDListElement, InfoListRootProps>(
  ({ className, children, loading, loadingRows = 3, emptyState, errorState, ...props }, ref) => {
    // A <dl> only takes term/description groups, so a state replaces it.
    const state = errorState ?? (!loading && React.Children.count(children) === 0 ? emptyState : undefined);
    if (state != null)
      return (
        <div ref={ref as React.Ref<HTMLDivElement>} className={className} {...(props as React.HTMLAttributes<HTMLDivElement>)}>
          {state}
        </div>
      );
    return (
      <dl
        ref={ref}
        aria-busy={loading || undefined}
        className={cn('divide-y divide-[var(--color-outline-variant)]', className)}
        {...props}
      >
        {loading
          ? Array.from({ length: loadingRows }, (_, i) => (
              <div key={i} aria-hidden="true" className="flex items-center justify-between gap-4 py-3">
                <dt className="shrink-0">
                  <Skeleton className="my-0.5 h-4 w-24" />
                </dt>
                <dd>
                  <Skeleton className="my-0.5 h-4 w-32" />
                </dd>
              </div>
            ))
          : children}
      </dl>
    );
  },
);
Root.displayName = 'InfoList.Root';

const Item = ({ label, value, className }: InfoListItemProps) => (
  <div className={cn('flex items-center justify-between py-3 gap-4', className)}>
    <dt className="text-body-sm text-[var(--color-on-surface-muted)] shrink-0">{label}</dt>
    <dd className="text-body-sm font-medium text-[var(--color-on-surface)] text-end">{value}</dd>
  </div>
);
Item.displayName = 'InfoList.Item';

export const InfoList = { Root, Item };
