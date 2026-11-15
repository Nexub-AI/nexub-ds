'use client';

import * as React from 'react';
import { Button, IconButton, Popover, cn, safeHref, useNexubMessages } from '@nexub/react';
import { Bell } from '@nexub/icons';
import { NotificationItem } from '../NotificationItem/NotificationItem.js';

export interface NotificationCenterItem {
  id: string;
  title: string;
  description?: string;
  timestamp?: string;
  read?: boolean;
  icon?: React.ReactNode;
  /** Where the notification leads. */
  href?: string;
}

export interface NotificationCenterProps {
  notifications: NotificationCenterItem[];
  /** Called when a notification is opened (clicked or Enter). */
  onOpen?: (id: string) => void;
  onDismiss?: (id: string) => void;
  onMarkAllRead?: () => void;
  /** Shown when there are no notifications. */
  emptyText?: React.ReactNode;
  className?: string;
}

/**
 * A bell button with an unread count that opens the notification list.
 * Your app owns the notifications and their read state.
 */
export function NotificationCenter({
  notifications,
  onOpen,
  onDismiss,
  onMarkAllRead,
  emptyText,
  className,
}: NotificationCenterProps) {
  const t = useNexubMessages();
  const unread = notifications.filter((n) => !n.read).length;
  const headingId = React.useId();
  const shown = unread > 99 ? '99+' : String(unread);

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <IconButton
          variant="ghost"
          label={unread ? `${t.notificationCenter}, ${t.unreadNotifications(unread)}` : t.notificationCenter}
          className={cn('relative', className)}
        >
          <Bell size="sm" aria-hidden="true" />
          {unread > 0 && (
            <span
              aria-hidden="true"
              className="absolute -end-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-error)] px-1 text-[10px] font-semibold tabular-nums leading-none text-[var(--color-on-error)]"
            >
              {shown}
            </span>
          )}
        </IconButton>
      </Popover.Trigger>
      <Popover.Content align="end" aria-labelledby={headingId} className="flex w-96 max-w-[calc(100vw-2rem)] flex-col gap-1 p-2">
        <div className="flex items-center justify-between gap-2 px-2 py-1">
          <h2 id={headingId} className="text-title-sm font-semibold text-[var(--color-on-surface)]">
            {t.notificationCenter}
          </h2>
          {onMarkAllRead && unread > 0 && (
            <Button variant="text" size="sm" onClick={onMarkAllRead}>
              {t.markAllRead}
            </Button>
          )}
        </div>
        {notifications.length ? (
          <ul className="m-0 flex max-h-[min(28rem,70vh)] list-none flex-col gap-1 overflow-y-auto p-0">
            {notifications.map((n) => (
              <li key={n.id}>
                <NotificationItem
                  title={n.title}
                  description={n.description}
                  timestamp={n.timestamp}
                  read={n.read}
                  icon={n.icon}
                  href={safeHref(n.href)}
                  onSelect={onOpen ? () => onOpen(n.id) : undefined}
                  onDismiss={onDismiss ? () => onDismiss(n.id) : undefined}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-2 py-6 text-center text-body-md text-[var(--color-on-surface-muted)]">
            {emptyText ?? t.noNotifications}
          </p>
        )}
      </Popover.Content>
    </Popover.Root>
  );
}
