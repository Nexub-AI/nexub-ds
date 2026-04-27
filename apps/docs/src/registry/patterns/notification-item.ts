import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'notification-item',
    title: 'NotificationItem',
    description: 'Single notification row for notification panels or dropdowns.',
    category: 'Feedback',
    package: '@nexub/patterns',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'title', type: 'string', required: true, description: 'Notification title.' },
    { name: 'description', type: 'string', required: false, description: 'Supporting text.' },
    { name: 'timestamp', type: 'string', required: false, description: 'Relative time string.' },
    { name: 'unread', type: 'boolean', default: 'false', required: false, description: 'Applies unread indicator styling.' },
    { name: 'avatar', type: 'React.ReactNode', required: false, description: 'Avatar for the notification actor.' },
    { name: 'onClick', type: '() => void', required: false, description: 'Click handler for the item.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<NotificationItem
  title="New comment on your post"
  description="Alex left a comment on 'Design System v2'"
  timestamp="5 min ago"
  unread
/>`,
    },
  ],
};

export default entry;
