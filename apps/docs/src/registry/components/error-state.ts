import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'error-state',
    title: 'Error State',
    description: 'Full-page or section error view with retry action.',
    category: 'Data Display',
    package: '@nexub/react',
    status: 'stable',
    addedIn: '0.0.1',
  },
  props: [
    { name: 'title', type: 'string', required: true, description: 'Primary error heading shown to the user.' },
    { name: 'description', type: 'string', required: false, description: 'Supporting text with more detail about the error or recovery steps.' },
    { name: 'tone', type: "'error' | 'warning' | 'info'", default: "'error'", required: false, description: 'Controls the icon and colour scheme of the error state.' },
    { name: 'onRetry', type: '() => void', required: false, description: 'When provided, renders a "Try again" button that calls this function on click.' },
    { name: 'actions', type: 'React.ReactNode', required: false, description: 'Custom action elements rendered below the description. Takes priority over the default retry button.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<ErrorState
  title="Something went wrong"
  description="We could not load the data. Please try again."
  onRetry={() => {}}
/>`,
    },
    {
      title: 'Warning',
      code: `<ErrorState
  tone="warning"
  title="Connection issue"
  description="Check your network and try again."
/>`,
    },
  ],
};

export default entry;
