import type { ComponentEntry } from '../types';

const entry: ComponentEntry = {
  meta: {
    slug: 'approval-card',
    title: 'Approval Card',
    description: 'The agent asks before it acts: what will happen, then Approve or Deny.',
    category: 'AI',
    package: '@nexub/react',
    status: 'beta',
    addedIn: '4.8.0',
    related: ['message-bubble', 'thinking-indicator'],
  },
  props: [
    { name: 'title', type: 'string', required: true, description: 'What the agent wants to do.' },
    { name: 'onApprove / onDeny', type: '() => void', required: false, description: 'Called once with the choice.' },
  ],
  examples: [{ title: 'Before sending' }],
  a11y: { screenReader: ['The outcome is announced in a polite live region and replaces the buttons.'] },
};

export default entry;
