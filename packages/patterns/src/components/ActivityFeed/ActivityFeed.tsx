import * as React from 'react';
import { cn } from '@nexub/react';

export interface ActivityItemProps {
  avatar?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  timestamp?: string;
  className?: string;
}

const Root = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, children, ...props }, ref) => (
    <ul
      ref={ref}
      role="feed"
      aria-label="Activity feed"
      className={cn('flex flex-col divide-y divide-[var(--color-border-default)]', className)}
      {...props}
    >
      {children}
    </ul>
  ),
);
Root.displayName = 'ActivityFeed.Root';

const Item = ({ avatar, title, description, timestamp, className }: ActivityItemProps) => (
  <li className={cn('flex items-start gap-3 py-3', className)}>
    {avatar && <div className="shrink-0 mt-0.5">{avatar}</div>}
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-[var(--color-text-primary)]">{title}</p>
      {description && (
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">{description}</p>
      )}
    </div>
    {timestamp && (
      <time className="shrink-0 text-xs text-[var(--color-text-muted)]">{timestamp}</time>
    )}
  </li>
);
Item.displayName = 'ActivityFeed.Item';

export const ActivityFeed = { Root, Item };
