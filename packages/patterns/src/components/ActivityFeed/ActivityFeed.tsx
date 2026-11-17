import * as React from 'react';
import { Skeleton, cn, useNexubMessages } from '@nexub/react';

export interface ActivityItemProps {
  avatar?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  timestamp?: string;
  className?: string;
}

export interface ActivityFeedRootProps extends React.HTMLAttributes<HTMLUListElement> {
  /** 10.5: shows skeleton rows in place of the items and sets aria-busy. */
  loading?: boolean;
  /** Skeleton rows while `loading`. @default 3 */
  loadingRows?: number;
  /** Shown when there are no items. */
  emptyState?: React.ReactNode;
  /** Shown in place of the items; wins over `loading` and `emptyState`. */
  errorState?: React.ReactNode;
}

const Root = React.forwardRef<HTMLUListElement, ActivityFeedRootProps>(
  ({ className, children, loading, loadingRows = 3, emptyState, errorState, ...props }, ref) => {
    const t = useNexubMessages();
    const failed = errorState != null;
    return (
      <ul
        ref={ref}
        aria-label={t.activityFeed}
        aria-busy={(loading && !failed) || undefined}
        className={cn('flex flex-col divide-y divide-[var(--color-outline-variant)]', className)}
        {...props}
      >
        {failed ? (
          <li>{errorState}</li>
        ) : loading ? (
          Array.from({ length: loadingRows }, (_, i) => (
            <li key={i} aria-hidden="true" className="flex items-start gap-3 py-3">
              <Skeleton shape="circle" className="size-8" />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <Skeleton className="my-0.5 h-4 w-2/5" />
                <Skeleton className="my-0.5 h-4 w-3/5" />
              </div>
            </li>
          ))
        ) : emptyState != null && React.Children.count(children) === 0 ? (
          <li>{emptyState}</li>
        ) : (
          children
        )}
      </ul>
    );
  },
);
Root.displayName = 'ActivityFeed.Root';

const Item = ({ avatar, title, description, timestamp, className }: ActivityItemProps) => (
  <li className={cn('flex items-start gap-3 py-3', className)}>
    {avatar && <div className="shrink-0 mt-0.5">{avatar}</div>}
    <div className="flex-1 min-w-0">
      <p className="text-body-sm font-medium text-[var(--color-on-surface)]">{title}</p>
      {description && (
        <p className="text-body-sm text-[var(--color-on-surface-muted)] mt-0.5">{description}</p>
      )}
    </div>
    {timestamp && (
      <time className="shrink-0 text-label-sm font-normal text-[var(--color-on-surface-muted)]">{timestamp}</time>
    )}
  </li>
);
Item.displayName = 'ActivityFeed.Item';

export const ActivityFeed = { Root, Item };
