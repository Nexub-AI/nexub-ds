import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'settings-section',
    title: 'SettingsSection',
    description: 'Grouped settings panel with title, description, and action area.',
    category: 'Layout',
    package: '@nexub/patterns',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'title', type: 'string', required: true, description: 'Section heading.' },
    { name: 'description', type: 'string', required: false, description: 'Supporting description for the section.' },
    { name: 'children', type: 'React.ReactNode', required: true, description: 'Settings controls.' },
    { name: 'action', type: 'React.ReactNode', required: false, description: 'Primary action (e.g. save button).' },
  ],
  examples: [
    {
      title: 'Default',
    },
  ],
};

export default entry;
