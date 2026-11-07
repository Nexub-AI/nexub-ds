import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'notification-center',
    title: 'NotificationCenter',
    description: 'A bell with an unread count that opens the notification list.',
    category: 'Feedback',
    package: '@nexub/patterns',
    status: 'beta',
    addedIn: '6.6.0',
    related: ['notification-item'],
  },
  props: [
    { name: 'notifications', type: '{ id, title, description?, timestamp?, read?, icon?, href? }[]', required: true, description: 'Newest first. Your app owns them and their read state.' },
    { name: 'onOpen', type: '(id) => void', required: false, description: 'A notification was opened; mark it read here.' },
    { name: 'onDismiss', type: '(id) => void', required: false, description: 'Shows a dismiss button per item.' },
    { name: 'onMarkAllRead', type: '() => void', required: false, description: 'Shows "Mark all as read" while some are unread.' },
    { name: 'emptyText', type: 'ReactNode', default: '"You’re all caught up"', required: false, description: 'Shown with no notifications.' },
  ],
  examples: [{ title: 'Inbox' }],
  a11y: {
    notes: [
      'The bell reads "Notifications, 3 unread"; the count badge is decorative.',
      'The list opens in a popover labelled by its heading; Escape closes it and focus returns to the bell.',
      'Each item’s title is its link or button, stretched over the whole item.',
    ],
  },
};

export default entry;
