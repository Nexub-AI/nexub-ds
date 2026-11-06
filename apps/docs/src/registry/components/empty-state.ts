import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'empty-state',
    title: 'Empty State',
    description: 'Placeholder UI shown when a list or page has no content.',
    category: 'Data Display',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
    updatedIn: '5.6.0',
  },
  props: [
    { name: 'EmptyState.Root layout', type: "'centered' | 'inline'", default: "'centered'", required: false, description: '"centered" stacks content vertically in the middle of its container; "inline" aligns content to the start.' },
    { name: 'EmptyState.Illustration children', type: 'React.ReactNode', required: false, description: 'Icon or SVG illustration to render above the title.' },
    { name: 'EmptyState.Title children', type: 'React.ReactNode', required: true, description: 'Primary heading text for the empty state.' },
    { name: 'EmptyState.Description children', type: 'React.ReactNode', required: false, description: 'Supporting text providing more context or guidance.' },
    { name: 'EmptyState.Actions children', type: 'React.ReactNode', required: false, description: 'One or more action buttons rendered below the description.' },
    { name: 'EmptyStatePreset kind', type: "'noData' | 'noResults' | 'noAccess' | 'serverError' | 'offline'", required: true, description: 'Ready-made icon, title and description (5.6). serverError and offline are announced as alerts.' },
    { name: 'EmptyStatePreset title / description / actions', type: 'ReactNode', required: false, description: 'Override the localised text; add buttons such as Retry.' },
  ],
  examples: [
    {
      title: 'Default',
    },
    {
      title: 'Custom illustration',
    },
    {
      title: 'Presets',
      description: '`EmptyStatePreset` for no data, no results, no access (403), server error (500) and offline.',
    },
  ],
};

export default entry;
