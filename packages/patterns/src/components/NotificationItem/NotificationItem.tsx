import * as React from 'react';
import { cn, useNexubMessages } from '@nexub/react';

export interface NotificationItemProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  timestamp?: string;
  read?: boolean;
  icon?: React.ReactNode;
  onDismiss?: () => void;
  /** Makes the whole item a link to the notification's target. */
  href?: string;
  /** Makes the whole item a button (when there's no `href`). */
  onSelect?: () => void;
}

// Stretched: the title's link or button covers the whole item; dismiss sits above it.
const stretched =
  'outline-none after:absolute after:inset-0 after:rounded-shape-container focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-[var(--color-primary)]';

export const NotificationItem = React.forwardRef<HTMLDivElement, NotificationItemProps>(
  ({ title, description, timestamp, read = false, icon, onDismiss, href, onSelect, className, ...props }, ref) => {
    const t = useNexubMessages();
    return (
      <div
        ref={ref}
        className={cn(
          'nx-state-layer relative flex items-start gap-3 p-3 rounded-shape-container',
          !read && 'bg-[var(--color-surface-container-low)]',
          className,
        )}
        {...props}
      >
        {/* unread dot */}
        {!read && (
          <span
            className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--color-primary)]"
            role="img"
            aria-label={t.unread}
          />
        )}

        {/* icon */}
        {icon && <div className="shrink-0 mt-0.5">{icon}</div>}

        {/* content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[var(--color-on-surface)] truncate">
            {href ? (
              <a href={href} onClick={onSelect} className={stretched}>
                {title}
              </a>
            ) : onSelect ? (
              <button type="button" onClick={onSelect} className={cn('text-start', stretched)}>
                {title}
              </button>
            ) : (
              title
            )}
          </p>
          {description && (
            <p className="text-sm text-[var(--color-on-surface-muted)] mt-0.5 line-clamp-2">
              {description}
            </p>
          )}
          {timestamp && (
            <time className="text-xs text-[var(--color-on-surface-muted)] mt-1 block">
              {timestamp}
            </time>
          )}
        </div>

        {/* dismiss */}
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label={t.dismissNotification}
            className="relative z-[1] shrink-0 text-[var(--color-on-surface-muted)] hover:text-[var(--color-on-surface)] p-1 rounded-shape-control"
          >
            ×
          </button>
        )}
      </div>
    );
  },
);

NotificationItem.displayName = 'NotificationItem';
