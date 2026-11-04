import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'banner',
    title: 'Banner',
    description: 'Deprecated — use Alert. Full-width announcement banner, typically used at the top of a page.',
    category: 'Feedback',
    package: '@nexub/react',
    status: 'deprecated',
    deprecation: { replacement: 'alert', removeIn: '3.0', migration: '`<Alert>` has the same props (tone, title, icon, action, onClose), so rename the element.' },
    addedIn: '0.0.1',
  },
  props: [
    { name: 'tone', type: "'neutral' | 'info' | 'success' | 'warning' | 'danger'", required: false, description: 'Semantic colour tone of the banner.' },
    { name: 'action', type: 'ReactNode', required: false, description: 'Action element (e.g. a button or link) rendered to the right of the content.' },
    { name: 'onClose', type: '() => void', required: false, description: 'When provided, renders a close button that dismisses the banner.' },
  ],
  examples: [
    {
      title: 'Default',
    },
    {
      title: 'With action',
    },
  ],
};

export default entry;
