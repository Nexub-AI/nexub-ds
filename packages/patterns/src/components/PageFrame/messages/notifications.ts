import type { PageTemplateMessages } from '../PageFrame.js';

/** 11.7: notifications strings of the page templates. */
export const notificationsMessages = {
  inbox: 'Notifications',
  all: 'All',
  unreadOnly: 'Unread',
  markRead: (title) => `Mark as read: ${title}`,
  markUnread: (title) => `Mark as unread: ${title}`,
  yesterday: 'Yesterday',
  caughtUpTitle: 'You are all caught up',
  caughtUpDescription: 'New notifications will show up here.',
} satisfies Partial<PageTemplateMessages>;
