import * as React from 'react';
import { cn } from '@nexub/react';

export interface NotificationItemProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  timestamp?: string;
  read?: boolean;
  icon?: React.ReactNode;
  onDismiss?: () => void;
}

export const NotificationItem = React.forwardRef<HTMLDivElement, NotificationItemProps>(
  (
    { title, description, timestamp, read = false, icon, onDismiss, className, ...props },
    ref,
  ) => (
    <div
      ref={ref}
      className={cn(
        'flex items-start gap-3 p-3 rounded-lg transition-colors hover:bg-[var(--color-bg-subtle)]',
        !read && 'bg-[var(--color-bg-subtle)]',
        className,
      )}
      {...props}
    >
      {/* unread dot */}
      {!read && (
        <span
          className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--color-brand-primary-500)]"
          aria-label="Unread"
        />
      )}

      {/* icon */}
      {icon && <div className="shrink-0 mt-0.5">{icon}</div>}

      {/* content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">{title}</p>
        {description && (
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5 line-clamp-2">
            {description}
          </p>
        )}
        {timestamp && (
          <time className="text-xs text-[var(--color-text-muted)] mt-1 block">{timestamp}</time>
        )}
      </div>

      {/* dismiss */}
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="shrink-0 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] p-1 rounded"
        >
          ×
        </button>
      )}
    </div>
  ),
);

NotificationItem.displayName = 'NotificationItem';
