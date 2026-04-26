import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'alert',
    title: 'Alert',
    description: 'Inline contextual message with optional title, icon, and dismiss action.',
    category: 'Feedback',
    package: '@nexub/react',
    status: 'stable',
  },
  props: [
    { name: 'tone', type: "'neutral' | 'info' | 'success' | 'warning' | 'danger'", default: "'neutral'", required: false, description: 'Semantic colour tone of the alert.' },
    { name: 'title', type: 'string', required: false, description: 'Bold title rendered at the top of the alert.' },
    { name: 'icon', type: 'ReactNode', required: false, description: 'Custom icon rendered to the left of the content.' },
    { name: 'action', type: 'ReactNode', required: false, description: 'Action element (e.g. a button) rendered beside the content.' },
    { name: 'onClose', type: '() => void', required: false, description: 'When provided, renders a close button that calls this handler.' },
  ],
  examples: [
    {
      title: 'Default',
      code: `<Alert tone="info" title="Heads up">Your trial expires in 3 days.</Alert>`,
    },
    {
      title: 'Tones',
      code: `<div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
  <Alert tone="info" title="Information">This is an informational message.</Alert>
  <Alert tone="success" title="Success">Your changes have been saved.</Alert>
  <Alert tone="warning" title="Warning">Please review before proceeding.</Alert>
  <Alert tone="danger" title="Error">Something went wrong. Please try again.</Alert>
</div>`,
    },
    {
      title: 'Dismissible',
      code: `<Alert tone="success" title="Saved" onClose={() => {}}>Your changes have been saved.</Alert>`,
    },
  ],
};

export default entry;
