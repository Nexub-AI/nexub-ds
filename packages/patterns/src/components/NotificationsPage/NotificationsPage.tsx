import * as React from 'react';
import { Badge, Button, EmptyStatePreset, IconButton, SkeletonPreset, Tabs, safeHref, useControllableState, useNexubMessages } from '@nexub/react';
import { Check, Mail, Settings } from '@nexub/icons';
import { NotificationItem } from '../NotificationItem/index.js';
import type { NotificationCenterItem } from '../NotificationCenter/index.js';
import {
  PageFrame,
  groupByDay,
  usePageStrings,
  useTemplateLocale,
  type PageFrameProps,
  type PageTemplateMessages,
  type Transaction,
} from '../PageFrame/PageFrame.js';
import { sharedMessages } from '../PageFrame/messages/shared.js';
import { notificationsMessages } from '../PageFrame/messages/notifications.js';

/** The defaults this template shows (11.7: not every template's strings). */
const STRINGS = { ...sharedMessages, ...notificationsMessages };

/** NotificationCenter's item, plus the `date` the page groups by. */
export interface NotificationsPageItem extends NotificationCenterItem {
  /** When it arrived. Items with a date are grouped under day headings, newest first. */
  date?: Date;
}

export interface NotificationsPageTab {
  id: string;
  label: React.ReactNode;
  count?: number;
  /** Which notifications the tab shows. Without it the tab shows `notifications` as given (your app filters). */
  filter?: (n: NotificationsPageItem) => boolean;
}

export interface NotificationsPageProps extends Omit<PageFrameProps, 'title' | 'children'> {
  /** @default messages.inbox */
  title?: React.ReactNode;
  notifications: NotificationsPageItem[];
  /** @default "All" and "Unread" (with the unread count) */
  tabs?: NotificationsPageTab[];
  tab?: string;
  defaultTab?: string;
  onTabChange?: (id: string) => void;
  /** Called when a notification is opened (clicked or Enter). */
  onOpen?: (id: string) => void;
  onDismiss?: (id: string) => void;
  onMarkAllRead?: () => void;
  /** Adds a read / unread toggle to each row; `read` is the state asked for. */
  onMarkRead?: (id: string, read: boolean) => void;
  /** Shows "Load more" under the list while `hasMore`. */
  onLoadMore?: () => void;
  hasMore?: boolean;
  loadingMore?: boolean;
  /** A link to notification settings. `onOpenSettings` renders a button in its place. */
  settingsHref?: string;
  onOpenSettings?: () => void;
  /** Today, for the "Today" and "Yesterday" headings. Without it every day shows its date (render never reads the clock). */
  now?: Date;
  loading?: boolean;
  /** @default an illustrated "all caught up" state */
  emptyState?: React.ReactNode;
  /** Shown in place of the list; wins over `loading` and the empty state. */
  errorState?: React.ReactNode;
  messages?: Partial<PageTemplateMessages>;
}

const sameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/** The full-page inbox: tabs, day groups, read state and "Load more". */
export const NotificationsPage = React.forwardRef<HTMLElement, NotificationsPageProps>(function NotificationsPage(
  {
    title,
    actions,
    notifications,
    tabs: tabsProp,
    tab: tabProp,
    defaultTab,
    onTabChange,
    onOpen,
    onDismiss,
    onMarkAllRead,
    onMarkRead,
    onLoadMore,
    hasMore,
    loadingMore,
    settingsHref,
    onOpenSettings,
    now,
    loading,
    emptyState,
    errorState,
    messages,
    ...props
  },
  ref,
) {
  const m = usePageStrings(messages, STRINGS);
  const t = useNexubMessages();
  const locale = useTemplateLocale();
  const unread = notifications.filter((n) => !n.read).length;
  const tabs: NotificationsPageTab[] = tabsProp ?? [
    { id: 'all', label: m.all },
    { id: 'unread', label: m.unreadOnly, count: unread, filter: (n) => !n.read },
  ];
  const [tab, setTab] = useControllableState<string>({ value: tabProp, defaultValue: defaultTab ?? tabs[0]?.id, onChange: onTabChange });
  const active = tabs.find((x) => x.id === tab);
  const shown = active?.filter ? notifications.filter(active.filter) : notifications;

  const groups = React.useMemo(() => {
    const undated = shown.filter((n) => !n.date);
    // groupByDay only reads `date`.
    const dated = groupByDay(shown.filter((n) => n.date) as unknown as Transaction[], locale) as unknown as { title: string; data: NotificationsPageItem[] }[];
    const yesterday = now && new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    const named = dated.map((g) => {
      const d = g.data[0]!.date!;
      return { ...g, title: now && sameDay(d, now) ? t.today : yesterday && sameDay(d, yesterday) ? m.yesterday : g.title };
    });
    return undated.length ? [{ title: '', data: undated }, ...named] : named;
  }, [shown, locale, now, t.today, m.yesterday]);

  const settings = settingsHref ? (
    <IconButton label={m.settings} asChild>
      <a href={safeHref(settingsHref)}>
        <Settings size="sm" aria-hidden="true" />
      </a>
    </IconButton>
  ) : (
    onOpenSettings && (
      <IconButton label={m.settings} onClick={onOpenSettings}>
        <Settings size="sm" aria-hidden="true" />
      </IconButton>
    )
  );
  const markAll = onMarkAllRead && unread > 0 && (
    <Button variant="tonal" size="sm" onClick={onMarkAllRead}>
      {t.markAllRead}
    </Button>
  );

  const list =
    errorState != null ? (
      errorState
    ) : loading ? (
      <div aria-busy="true">
        <SkeletonPreset preset="listRow" count={5} />
      </div>
    ) : shown.length === 0 ? (
      (emptyState ?? <EmptyStatePreset kind="noData" illustrated title={m.caughtUpTitle} description={m.caughtUpDescription} />)
    ) : (
      <div className="flex flex-col gap-6">
        {groups.map((g) => (
          <section key={g.title} aria-label={g.title || undefined} className="flex flex-col gap-2">
            {g.title && <h2 className="px-1 text-title-sm text-[var(--color-on-surface-variant)]">{g.title}</h2>}
            <ul className="m-0 flex list-none flex-col gap-1 p-0">
              {g.data.map((n) => (
                <li key={n.id} className="flex items-start gap-1">
                  {/* The unread dot is NotificationItem's: a shape with the name "Unread", not colour alone. */}
                  <NotificationItem
                    className="min-w-0 flex-1"
                    title={n.title}
                    description={n.description}
                    timestamp={n.timestamp}
                    read={n.read}
                    icon={n.icon}
                    href={safeHref(n.href)}
                    onSelect={onOpen ? () => onOpen(n.id) : undefined}
                    onDismiss={onDismiss ? () => onDismiss(n.id) : undefined}
                  />
                  {onMarkRead && (
                    <IconButton
                      className="mt-1 shrink-0"
                      size="sm"
                      label={n.read ? m.markUnread(n.title) : m.markRead(n.title)}
                      onClick={() => onMarkRead(n.id, !n.read)}
                    >
                      {n.read ? <Mail size="sm" aria-hidden="true" /> : <Check size="sm" aria-hidden="true" />}
                    </IconButton>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
        {onLoadMore && hasMore && (
          <Button variant="tonal" className="self-center" onClick={onLoadMore} loading={loadingMore}>
            {m.loadMore}
          </Button>
        )}
      </div>
    );

  return (
    <PageFrame
      ref={ref}
      title={title ?? m.inbox}
      actions={
        (actions || markAll || settings) && (
          <>
            {actions}
            {markAll}
            {settings}
          </>
        )
      }
      {...props}
    >
      {tabs.length > 1 ? (
        <Tabs.Root value={tab} onValueChange={setTab} className="flex flex-col gap-4">
          <Tabs.List>
            {tabs.map((x) => (
              <Tabs.Trigger key={x.id} value={x.id}>
                {x.label}
                {!!x.count && (
                  <Badge size="sm" variant="soft">
                    {x.count}
                  </Badge>
                )}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
          <Tabs.Content value={tab!}>{list}</Tabs.Content>
        </Tabs.Root>
      ) : (
        list
      )}
    </PageFrame>
  );
});
