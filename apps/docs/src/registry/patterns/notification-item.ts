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
    { name: 'read', type: 'boolean', default: 'false', required: false, description: 'Unread items get a tinted background and an "Unread" dot.' },
    { name: 'icon', type: 'ReactNode', required: false, description: 'Icon or avatar before the text.' },
    { name: 'href / onSelect', type: 'string / () => void', required: false, description: 'Makes the whole item a link or a button (6.6).' },
    { name: 'onDismiss', type: '() => void', required: false, description: 'Shows a dismiss button.' },
  ],
  examples: [
    {
      title: 'Default',
    },
  ],
};

export default entry;
