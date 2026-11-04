import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'helper-text',
    title: 'Helper Text',
    description: 'Small supporting text placed beneath a form field to provide hints or validation feedback.',
    category: 'Form & Input',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'tone', type: "'neutral' | 'info' | 'success' | 'warning' | 'danger'", default: "'neutral'", required: false, description: 'Semantic colour tone of the helper text.' },
    { name: 'disabled', type: 'boolean', required: false, description: 'Applies muted disabled styling.' },
  ],
  examples: [
    {
      title: 'Default',
    },
    {
      title: 'Tones',
    },
  ],
};

export default entry;
