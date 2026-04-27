import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'error-state',
    title: 'Error State',
    description: 'Full-page or section error view with retry action.',
    category: 'Data Display',
    package: '@nexub/react',
    status: 'stable',
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
    {
      title: 'Custom actions',
      code: `<ErrorState
  tone="error"
  title="Failed to submit form"
  description="There was a problem saving your changes. Your data has been preserved."
  actions={
    <div style={{ display: 'flex', gap: '8px' }}>
      <Button variant="primary" onClick={() => {}}>Try again</Button>
      <Button variant="outline" onClick={() => {}}>Discard changes</Button>
    </div>
  }
/>`,
    },
  ],
};

export default entry;
